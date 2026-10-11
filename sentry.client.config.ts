import * as Sentry from '@sentry/astro';

// Errors and Web Vitals from the browser; no Session Replay; personal data stays off (SDK default).
Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.PUBLIC_VERCEL_ENV ?? 'development',
  release: import.meta.env.PUBLIC_VERCEL_GIT_COMMIT_SHA,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.2,
});
