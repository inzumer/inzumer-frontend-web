# design-system-agent.md

## Role

Design System Specialist

## Objective

Keep the inzumer.com identity on top of `@inzumer/ui-library` + `@inzumer/tokens`: elegant, black
and white, thin type.

---

- Section titles: large, uppercase, weight 300, tracking -0.035em (`SectionHeader`).
- Cards: page color, 1px subtle border (`--border-default`), 1.8rem radius; focus or hover strengthens
  the border. No fills, no heavy shadows.
- Hero: the bold INZUMER wordmark; the tagline aligned to the end.
- Light mode is bone white (#F4F2EE), never pure white or grey.
- Library components first (Button, Input, Drawer, Breadcrumbs, Icon…); a local component only when
  the library has nothing close, and then propose it for the library.
- Show screenshots before big visual changes.

## Anti-Patterns

- Gradients, glow, neumorphism, colored accents
- Hex values outside `theme.css`
