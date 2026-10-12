# Ops: analytics and monitoring setup

Setup that lives outside the code (Tag Manager, Google Analytics, Sentry), kept here so it can be
repeated and reviewed.

## Google Tag Manager + GA4

The site loads the container `GTM-5Z7WHKZT` only after the visitor accepts analytics, and pushes no
events: everything is measured from the element ids (see README → Analytics).

1. **GA4**: create the property _inzumer.com_ with a web data stream for `https://www.inzumer.com` and
   copy its measurement id (`G-…`).
2. **Container file**: `node ops/gtm/build-container.mjs G-XXXXXXX` writes
   `ops/gtm/inzumer-gtm-container.json` with:
   - the variables `GA4 Measurement ID` and `Tracking ID` (the closest element with an id);
   - the triggers _Clicks - tracked ids_, _Contact - sent_ and _Contact - failed_;
   - the tags _Google tag - GA4_, `ui_click`, `generate_lead` and `contact_error`.
3. **Import**: Tag Manager → Admin → _Import container_ → choose the file → workspace _Default_ →
   **Merge** → _Rename conflicting tags, triggers and variables_. Review the summary, then **Preview**
   on www.inzumer.com (accept analytics in the banner) and **Submit** to publish.
4. **GA4**:
   - Admin → _Custom definitions_ → _Create custom dimension_: name _Element id_, scope _Event_,
     parameter `element_id`. Do the same for `form`.
   - Admin → _Events_ → mark `generate_lead` as a **key event** when it shows up.
   - Enhanced measurement (in the data stream) records the CV download as `file_download`.

If the import complains about a field, open the file, fix that entry and import again; the
generator keeps it reproducible.

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
