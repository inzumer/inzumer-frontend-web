import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, relative, sep } from 'node:path';
import { launchChrome, sleep } from './lib/chrome.mjs';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const PORT = Number(process.env.PORT ?? 4329);
const SITE_BASE = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');
const BASE = `http://localhost:${PORT}${SITE_BASE}`;
/** Static pages: `dist/client` with the Vercel adapter, `dist` without one. */
const DIST = existsSync(join('dist', 'client')) ? join('dist', 'client') : 'dist';
/** The theme follows the saved choice (the site starts dark), not the OS. */
const SETTINGS_KEY = 'inzumer:settings';

const pages = (function collect(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      return entry === '_astro' ? [] : collect(path);
    }

    if (
      !entry.endsWith('.html') ||
      entry === '404.html' ||
      // Search Console ownership file, not a page.
      entry.startsWith('google') ||
      path === join(DIST, 'index.html')
    ) {
      return [];
    }

    return [
      `/${relative(DIST, path)
        .split(sep)
        .join('/')
        .replace(/(\/?index)?\.html$/, '')}`,
    ];
  });
})(DIST);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};
/** Serves the built pages: `/es` → `es/index.html`. */
const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', BASE).pathname).slice(
    SITE_BASE.length,
  );
  const candidates = [
    join(DIST, pathname),
    join(DIST, pathname, 'index.html'),
    join(DIST, `${pathname}.html`),
  ];
  const file = candidates.find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  );

  if (!file) {
    response.writeHead(404);
    response.end();

    return;
  }

  response.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  response.end(readFileSync(file));
}).listen(PORT);
const preview = { kill: () => server.close() };
let browser;
try {
  browser = await launchChrome(PORT + 1);
  const { send, evaluate } = browser;
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });

  const failures = [];
  for (const scheme of ['light', 'dark']) {
    await send('Page.navigate', { url: `${BASE}/en` });
    await sleep(500);
    await evaluate(
      `localStorage.setItem('${SETTINGS_KEY}', JSON.stringify({ colorScheme: '${scheme}' }))`,
    );
    for (const [index, page] of pages.entries()) {
      const navigation = await send('Page.navigate', { url: `${BASE}${page}` });
      if (navigation.result?.errorText) {
        throw new Error(`Could not load ${page}: ${navigation.result.errorText}`);
      }

      await sleep(700);
      const withMenu = index < 2;
      if (withMenu) {
        await evaluate(`document.querySelector('button[aria-controls]')?.click()`);
        await sleep(400);
      }

      await evaluate(axeSource);
      const violations = await evaluate(
        `axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })
          .then((r) => r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ') + ' — ' + (n.failureSummary || '').split('\\n').slice(0, 2).join(' ')) })))`,
      );
      for (const violation of violations) {
        failures.push({ page: `${page}${withMenu ? ' (menu open)' : ''}`, scheme, ...violation });
      }
    }
  }
  console.log(`Audited ${pages.length} pages × 2 color schemes.`);
  if (failures.length > 0) {
    for (const failure of failures) {
      console.log(
        `\n[${failure.impact}] ${failure.id} — ${failure.help}\n  ${failure.page} (${failure.scheme})`,
      );
      for (const node of failure.nodes) {
        console.log(`   · ${node}`);
      }
    }
    console.log(`\n${failures.length} violation(s).`);
    process.exitCode = 1;
  } else {
    console.log('No accessibility violations found.');
  }
} finally {
  browser?.close();
  preview.kill();
}
