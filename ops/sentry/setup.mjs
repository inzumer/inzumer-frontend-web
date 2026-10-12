// Creates the "inzumer.com — health" dashboard (traffic-light thresholds) and its alerts in Sentry.
// Needs SENTRY_API_TOKEN (org:read, project:read, project:write, alerts:write), SENTRY_ORG and
// SENTRY_PROJECT in the environment. `--dry-run` only prints what it would send.
// Untested against a live organization yet: verify the first run (see ops/README.md).
const API = 'https://sentry.io/api/0';
const { SENTRY_API_TOKEN: token, SENTRY_ORG: org, SENTRY_PROJECT: project } = process.env;
const dryRun = process.argv.includes('--dry-run');

if (!dryRun && (!token || !org || !project)) {
  console.error('Set SENTRY_API_TOKEN, SENTRY_ORG and SENTRY_PROJECT (or use --dry-run).');
  process.exit(1);
}

const request = async (method, path, body) => {
  if (dryRun) {
    console.log(`${method} ${path}\n${JSON.stringify(body, null, 2)}\n`);

    return {};
  }

  const response = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) }),
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${method} ${path} → ${response.status}: ${text}`);
  }

  return text ? JSON.parse(text) : {};
};

/** Traffic light: green up to `green`, yellow up to `yellow`, red above (lower is better). */
const thresholds = (green, yellow, unit = null) => ({
  max_values: { max1: green, max2: yellow },
  unit,
});

let slot = 0;
/** Three big numbers per row, then full-width charts. */
const layout = (wide = false) => {
  const index = slot++;

  return wide
    ? { x: 0, y: 2 * Math.ceil(index / 3) + index, w: 6, h: 2, minH: 2 }
    : { x: (index % 3) * 2, y: Math.floor(index / 3) * 2, w: 2, h: 2, minH: 1 };
};

const bigNumber = (title, widgetType, aggregate, conditions, limits, unit) => ({
  title,
  displayType: 'big_number',
  widgetType,
  interval: '1h',
  thresholds: thresholds(...limits, unit),
  queries: [
    {
      name: '',
      fields: [aggregate],
      aggregates: [aggregate],
      columns: [],
      conditions,
      orderby: '',
    },
  ],
  layout: layout(),
});

const dashboard = (projectId) => ({
  title: 'inzumer.com — health',
  projects: projectId ? [projectId] : [],
  period: '24h',
  widgets: [
    bigNumber('New errors (24 h)', 'error-events', 'count()', 'event.type:error', [0, 5]),
    bigNumber(
      'Contact form failures',
      'error-events',
      'count()',
      'area:[contact-send,contact-config]',
      [0, 1],
    ),
    bigNumber('LCP p75', 'spans', 'p75(measurements.lcp)', '', [2500, 4000], 'millisecond'),
    bigNumber('INP p75', 'spans', 'p75(measurements.inp)', '', [200, 500], 'millisecond'),
    bigNumber('CLS p75', 'spans', 'p75(measurements.cls)', '', [0.1, 0.25]),
    bigNumber(
      '/api/contact p95',
      'spans',
      'p95(span.duration)',
      'span.op:http.server transaction:"POST /api/contact"',
      [1000, 3000],
      'millisecond',
    ),
    {
      title: 'Errors by hour',
      displayType: 'line',
      widgetType: 'error-events',
      interval: '1h',
      queries: [
        {
          name: 'Errors',
          fields: ['count()'],
          aggregates: ['count()'],
          columns: [],
          conditions: 'event.type:error',
          orderby: '',
        },
      ],
      layout: layout(true),
    },
  ],
});

/** Metric alert: warning (yellow) and critical (red), by email to the person who owns the token. */
const alert = (name, dataset, aggregate, query, warning, critical, userId) => ({
  name: `inzumer.com — ${name}`,
  dataset,
  aggregate,
  query,
  timeWindow: 60,
  thresholdType: 0,
  resolveThreshold: null,
  projects: [project],
  environment: 'production',
  triggers: [
    {
      label: 'critical',
      alertThreshold: critical,
      actions: [{ type: 'email', targetType: 'user', targetIdentifier: userId }],
    },
    {
      label: 'warning',
      alertThreshold: warning,
      actions: [{ type: 'email', targetType: 'user', targetIdentifier: userId }],
    },
  ],
});

const projectInfo = dryRun
  ? { id: 'PROJECT_ID' }
  : await request('GET', `/projects/${org}/${project}/`);
const me = dryRun ? { id: 'USER_ID' } : await request('GET', '/users/me/');

const created = await request(
  'POST',
  `/organizations/${org}/dashboards/`,
  dashboard(projectInfo.id),
);
console.log(`Dashboard: ${created.id ?? '(dry run)'}`);

for (const rule of [
  alert('errors', 'events', 'count()', 'event.type:error', 1, 6, me.id),
  alert('contact form', 'events', 'count()', 'area:[contact-send,contact-config]', 1, 2, me.id),
  alert('LCP', 'transactions', 'p75(measurements.lcp)', '', 2500, 4000, me.id),
  alert(
    '/api/contact',
    'transactions',
    'p95(transaction.duration)',
    'transaction:"POST /api/contact"',
    1000,
    3000,
    me.id,
  ),
]) {
  const result = await request('POST', `/organizations/${org}/alert-rules/`, rule);
  console.log(`Alert: ${rule.name} ${result.id ?? '(dry run)'}`);
}
