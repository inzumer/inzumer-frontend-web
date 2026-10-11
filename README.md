# inzumer.com

Portfolio of Nahuel Zamuner, Senior Frontend Engineer, in English and Spanish:
<https://www.inzumer.com>.

## Stack

- [Astro](https://astro.build) static pages with React 19 islands, TypeScript strict.
- [Tailwind CSS 4](https://tailwindcss.com) with the `@inzumer/tokens` preset and the
  `@inzumer/ui-library` components.
- Contact form: an Astro endpoint on Vercel that sends the emails through Resend, built with
  `@inzumer/email`.
- Vitest + Testing Library (90% coverage gate), ESLint, Prettier, cspell and an axe audit.

## Getting started

```bash
pnpm install
pnpm dev
```

Node comes from `.nvmrc` and pnpm from `packageManager`.

| Command             | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `pnpm dev`          | Development server                                               |
| `pnpm build`        | Production build                                                 |
| `pnpm validate`     | every CI step: types, lint, format, spelling, tests, build, a11y |
| `pnpm format:check` | Prettier                                                         |
| `pnpm spellcheck`   | cspell                                                           |
| `pnpm audit:a11y`   | axe (WCAG 2.2 AA) on every page, light and dark                  |

## Structure

```txt
src/
  components/   atoms · molecules · organisms (React, one folder each with its tests)
  content/      projects/<lang>/<slug>.md
  i18n/         <folder>/{en,es}.json (profile = experience, skills, education)
  layouts/      base layout and footer
  pages/        [lang]/index, [lang]/projects/[slug], 404, api/contact
  services/     contact client; contact-email (server only)
  utils/        locale, routes, settings, SEO, contact schema, rate limit…
```

## Projects

The home shows the projects as tabs; **View project** opens all of it without leaving the page: a
`Modal` on desktop and a `BottomSheet` on phones (ui-library), with the screens in a carousel and
the Markdown body. Each project keeps its own page for search engines and sharing, linked from the
dialog. To add one, write `src/content/projects/{en,es}/<slug>.md` with its images in
`src/assets/projects/<slug>/`.

## Menu and waits

The hamburger opens the sections over the whole screen (the lib's `Drawer` with `size="full"`). While a
message is on its way, or another page of the site loads for more than 300 ms, the lib's `Loader`
covers the page with the site background, a thin spinning ring and friendly questions
in the page's language, from `common.loader` in `src/i18n`.

## CV

Built at build time from `src/i18n/profile` (the same data as the Experience section), in both
languages, so the CV never drifts from the site:

| File              | For                                                                          |
| ----------------- | ---------------------------------------------------------------------------- |
| `/{lang}/cv.pdf`  | People and ATS filters: one column, standard headings, real text (Helvetica) |
| `/{lang}/cv.md`   | AI readers: plain Markdown                                                   |
| `/{lang}/cv.json` | Tools that import [JSON Resume](https://jsonresume.org)                      |
| `/llms.txt`       | A short guide for AI readers to every format                                 |

The PDF is drawn with `@react-pdf/renderer` in `src/services/cv-pdf`; headings have no letter
spacing because ATS parsers read spaced capitals as separate letters. To change the CV, edit the
profile; the headings and file names live in `src/i18n/cv`.

## Analytics

- **Vercel Web Analytics and Speed Insights**: visits and Core Web Vitals, without cookies.
- **Google Analytics 4**, only after consent. `ConsentManager` shows the lib's `CookieConsent`
  banner while there is no answer, saves it in `inzumer:settings` and loads gtag.js only when
  `analytics` is allowed (no ad signals). The footer's **Cookies** link (`#cookies`) reopens the
  preferences; `/{lang}/privacy` explains what is collected. Without `PUBLIC_GA_ID` in Vercel
  nothing loads and no banner shows.

| Event           | When                                                                | Parameters                            |
| --------------- | ------------------------------------------------------------------- | ------------------------------------- |
| `ui_click`      | A click on any element with a tracking id (`<scope>-<kind>-<name>`) | `element_id`, `scope`, `kind`, `name` |
| `generate_lead` | The contact form was sent                                           | `form`                                |
| `contact_error` | The contact form failed                                             | `form`                                |
| `file_download` | The CV PDF (GA4 enhanced measurement)                               | automatic                             |

In GA4, register `element_id`, `scope`, `kind` and `name` as event-scoped custom dimensions and
mark `generate_lead` as a key event.

## Contact emails

`/api/contact` validates the form, drops bots (honeypot) and floods (5 per address every 10
minutes), then sends two emails from `contact@inzumer.com` through [Resend](https://resend.com): the
message to Nahuel, with "reply to" set to the sender, and a confirmation to the sender in their
language, with "reply to" set to inzumer@gmail.com. The confirmation never repeats the message.

It needs `RESEND_API_KEY` (set in Vercel) and the `inzumer.com` domain verified in Resend (DNS
records in Vercel; no mailbox on the domain is needed). Locally, copy `.env.example` to `.env`.

## Deploy

Vercel builds every push (`vercel.json` pins the framework and pnpm). `develop` is the integration
branch and `main` is production; releases are cut on Fridays by `release-prepare.yml`. See
[CLAUDE.md](./CLAUDE.md) for the conventions.
