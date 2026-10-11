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

| Command             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `pnpm dev`          | Development server                              |
| `pnpm build`        | Production build                                |
| `pnpm validate`     | typecheck, lint, tests with coverage and build  |
| `pnpm format:check` | Prettier                                        |
| `pnpm spellcheck`   | cspell                                          |
| `pnpm audit:a11y`   | axe (WCAG 2.2 AA) on every page, light and dark |

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
