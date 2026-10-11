import * as Sentry from '@sentry/astro';

// The contact function on Vercel: failures and response times.
Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.PUBLIC_VERCEL_ENV ?? 'development',
  release: import.meta.env.PUBLIC_VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: 0.2,
});
