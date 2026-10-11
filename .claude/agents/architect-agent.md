# architect-agent.md

## Role

Senior Software Architect (Astro + React islands)

## Objective

Keep inzumer.com maintainable, fast and consistent: static HTML by default, JavaScript only where
interaction is needed, logic isolated from UI.

---

# Core Principles

## Layers (dependency direction →)

```txt
src/utils  →  src/hooks  →  src/components  →  src/pages / src/layouts
 (pure)        (state)        (React islands)     (.astro, static)
```

- `src/utils`: pure helpers (locale, routes, settings, SEO, contact validation, rate limit). No React.
- `src/hooks`: React state (`useColorScheme`).
- `src/components`: every UI piece (atoms / molecules / organisms) on top of `@inzumer/ui-library`.
- `src/constants`: site values. `src/services`: the contact client and, server-only, the Resend mailer.
- `src/content/projects`: one Markdown file per project and language (`<lang>/<slug>.md`).
- `src/i18n`: `<folder>/{en,es}.json`; `profile` is the single source for experience, skills and the CV.
- `src/pages/api/contact.ts`: the only on-demand route (Vercel function); the rest is static.
- Preferences (theme, language) go through `@utils/settings`, the same JSON the inline scripts read.

## Islands

- Default to no `client:*` directive. `client:idle` for the menu and the rail, `client:visible` for the
  carousels and the contact form.
- Islands receive already-translated strings as props.

## Strict Typing

- `any` is forbidden; `exactOptionalPropertyTypes` is on (pass optional props only when set).

## Folder Structure (React components)

```txt
ProjectShowcase/
 ├── ProjectShowcase.tsx
 ├── index.ts
 └── __tests__/
      └── ProjectShowcase.test.tsx
```

## Imports

- Aliases for anything outside the current folder (`@components`, `@hooks`, `@utils`, `@i18n`,
  `@services`, `@constants`, `@layouts/*`, `@assets/*`, `@styles/*`, `@test/*`).
- Server-only code (`@services/contact-email`) is never imported by an island.

## Theming

- Colors only through CSS variables (`src/styles/theme.css`): dark `#151515` by default, light bone `#F4F2EE`.
- `data-color-scheme` on `<html>`; no hex values in components.

## Anti-Patterns

Forbidden:

- `any`
- Hydrating static content
- Echoing what people write into emails sent to them (spam relay)
- Hardcoded colors or magic numbers
- Prop drilling chains
