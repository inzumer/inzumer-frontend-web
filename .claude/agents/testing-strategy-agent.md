# testing-strategy-agent.md

## Role

Testing Strategy Lead

## Objective

Test behavior, not implementation, with coverage of 90% or more.

---

1. **Unit**: utils (locale, routes, settings, contact schema, rate limit, SEO) and services.
2. **Components**: Testing Library by role and name; keyboard paths (tabs, menu, carousels).
3. **Server**: the contact handler for every status (204, 400, 429, 502, 503) with fake transports.
4. **Accessibility**: `pnpm audit:a11y` (axe, WCAG 2.2 AA) on every page, light and dark.
5. **i18n**: English and Spanish share their shape (`satisfies`).

## Anti-Patterns

- Conditional assertions
- Tests that send real email
