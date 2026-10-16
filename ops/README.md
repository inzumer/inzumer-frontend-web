# Ops: analytics and monitoring setup

Setup that lives outside the code (Tag Manager, Google Analytics, Sentry), kept here so it can be
repeated and reviewed.

## Google Tag Manager + GA4

The site loads the container `GTM-5Z7WHKZT` (the `PUBLIC_GTM_ID` variable in Vercel Production) only after the visitor accepts analytics, and pushes no
events: everything is measured from the element ids (see README → Analytics). The container is
configured by hand in Tag Manager (no import file); GA4 property _inzumer.com_, measurement id
`G-FCRNWLY41Q`.

- **Variables**: constant `GA4 Measurement ID`; custom JavaScript `Tracking ID` (the id of the
  closest clicked element that has one); built-in `Click Element`.
- **Triggers**: _Clicks - tracked ids_ (all elements, `Tracking ID` matches `-(button|link|switch)-`),
  _Contact - sent_ (element visibility, id `contact-status-success`) and _Contact - failed_
  (`contact-status-error`).
- **Tags**: _Google tag - GA4_ (initialization), `ui_click` (`element_id`), `generate_lead` and
  `contact_error` (`form` = contact).
- **GA4**: custom event dimensions `element_id` and `form`; `generate_lead` as a key event.

## Sentry

`@sentry/astro` is wired in the site; it stays off until the environment has a DSN.

1. **Project**: Sentry → _Create project_ → platform **Astro** → name `inzumer`.
2. **Vercel** (Production and Preview): `PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` and
   `SENTRY_AUTH_TOKEN` (source maps). Redeploy and check that a test error arrives.
3. **Dashboard and alerts**: `ops/sentry/setup.mjs` creates _inzumer.com — health_ (traffic-light
   big numbers: new errors, contact form failures, LCP, INP, CLS and `/api/contact` p95, plus errors
   by hour) and four metric alerts (warning = yellow, critical = red, by email).
   - Create a personal token with `org:read`, `project:read`, `project:write`, `alerts:write` and
     keep it in your environment as `SENTRY_API_TOKEN` (never in a file or a chat).
   - `node ops/sentry/setup.mjs --dry-run` prints the requests; without the flag it creates them.
   - It hasn't run against a live organization yet: if an endpoint rejects a field, adjust it here
     (or with the Sentry connector) and run it again.

| Panel                 | Green    | Yellow   | Red      |
| --------------------- | -------- | -------- | -------- |
| New errors (24 h)     | 0        | 1–5      | > 5      |
| Contact form failures | 0        | 1        | ≥ 2      |
| LCP p75               | ≤ 2.5 s  | ≤ 4 s    | > 4 s    |
| INP p75               | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| CLS p75               | ≤ 0.1    | ≤ 0.25   | > 0.25   |
| `/api/contact` p95    | ≤ 1 s    | ≤ 3 s    | > 3 s    |
