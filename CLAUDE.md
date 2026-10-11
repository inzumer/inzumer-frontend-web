# CLAUDE.md

Guidance for Claude Code (and any other AI coding agent) working in this repository.

## Project

**inzumer.com** (`inzumer-frontend-web`): the bilingual (`/en`, `/es`) portfolio of Nahuel Zamuner,
Senior Frontend Engineer.

- Stack: Astro (static output) + React 19 islands, TypeScript strict, Tailwind v4 + `@inzumer/tokens`
  preset, `@inzumer/ui-library` components, `@inzumer/email` for the contact emails (sent through Resend), Vitest +
  Testing Library. Hosted on Vercel (`@astrojs/vercel`): every page is static, only
  `/api/contact` runs on demand.
- Shared packages live in `inzumer-<name>` repos and are published as `@inzumer/<name>`. The
  practices follow `inzumer-ui-library` and `milimon-frontend-web`.
- Agent roles live in [.claude/agents](./.claude/agents); start with `workflow-orchestrator-agent.md`.

Key commands (Node from `.nvmrc`, pnpm from `packageManager`):

| Command              | What it does                                                   |
| -------------------- | -------------------------------------------------------------- |
| `pnpm dev`           | Astro dev server                                               |
| `pnpm typecheck`     | `astro check` (TS + `.astro`)                                  |
| `pnpm lint`          | ESLint (TS, React, a11y, Astro, Vitest)                        |
| `pnpm test:coverage` | Vitest with the **90%** coverage gate                          |
| `pnpm build`         | Static pages in `dist/client`, the Vercel output in `.vercel/` |
| `pnpm format`        | Prettier (imports sorted, Astro + Tailwind plugins)            |
| `pnpm spellcheck`    | cspell (en + es; project words in `.cspell/project-words.txt`) |
| `pnpm audit:a11y`    | axe (WCAG 2.2 AA) on every built page, light and dark          |
| `pnpm validate`      | typecheck + lint + test:coverage + build                       |

## Non-negotiable conventions

- **Routes** in English and identical in both languages: `/es/projects/belo` ↔ `/en/projects/belo`.
  `/` picks the saved language, then the browser's, then English. Old `/projects/<slug>` URLs
  redirect (308) to English.
- **Translations**: `src/i18n/<folder>/{en,es}.json`, English is the source and Spanish must match its
  shape. `profile` is the single source for experience, skills, education and languages.
- **Projects**: `src/content/projects/<lang>/<slug>.md`, company projects first. Never invent dates,
  metrics or results; ask for them.
- **Tests**: every title starts with `should …` (enforced by `vitest/valid-title`).
- **Imports**: path aliases (`@components`, `@constants`, `@services`, `@hooks`, `@utils`, `@i18n`,
  `@layouts/*`, `@assets/*`, `@styles/*`, `@test/*`) for anything outside the current folder.
- **Tracking ids**: every interactive element has an id from `trackingId(scope, kind, name)`.
- **Placement**: UI in `src/components` (atoms / molecules / organisms), hooks in `src/hooks`, pure
  helpers in `src/utils`, values in `src/constants`, integrations in `src/services`
  (`contact-email` is server-only: never import it from an island).
- **Text**: headings and text use the ui-library `RichText`, in `.tsx` and `.astro`, never bare
  `<p>`/`<h*>` (Markdown bodies are the exception). Images use `astro:assets`.
- **Readability**: arrow functions; a blank line after every `if` and before every `return`.
- **Design**: elegant black and white, thin uppercase section titles, cards that are only a subtle
  border. Dark `#151515` by default; light mode is bone white `#F4F2EE`. Colors only through the CSS
  variables in `src/styles/theme.css`; both modes must pass the a11y audit.
- **Apps**: pages may run inside a WebView; anything pinned to an edge adds the safe-area insets.
- **Static first**: no `client:*` directive unless the component is interactive.
- **Security**: a strict Content-Security-Policy is generated at build time (`security.csp` in
  `astro.config.mjs`); a new inline script needs its hash there. The contact auto-reply never repeats
  the sender's message (it would turn the form into a spam relay).
- **Secrets**: `RESEND_API_KEY` lives only in Vercel (and a local `.env`, gitignored).
- **Dependencies**: latest compatible versions, `pnpm audit` clean, updated by hand (no Dependabot).

## Commit messages & PR titles

[Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) for every commit and PR
title: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `ci`, `build`,
`content`. Breaking changes: `!` before the colon and/or a `BREAKING CHANGE:` footer.

## Git workflow (gitflow)

- `main`: production. Only receives `release/*` and `hotfix/*` merges, tagged `vX.Y.Z`.
- `develop`: integration branch; features come in through PRs.
- `feature/<kebab-name>` from `develop`.
- `release/<version>`: cut every Friday by `release-prepare.yml` (inzumer-ci) when `develop` changed;
  Nahuel merges it and `release-finish.yml` tags, publishes the GitHub Release and backports to
  `develop`.
- Never commit directly on `main` or `develop`.

## Pull requests

Every PR uses [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) filled out in
full: what changed and why, checklist items only when true, and non-obvious decisions in "Notas
adicionales".
