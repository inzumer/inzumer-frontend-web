## Descripción

<!-- Qué problema resuelve o qué funcionalidad agrega. Contexto adicional si hace falta. -->

## Tipo de cambio

<!-- Marcá con una "x" lo que corresponda -->

- [ ] Bug fix
- [ ] Nueva feature / sección / página
- [ ] Contenido (proyectos, perfil, traducciones)
- [ ] Refactor sin cambio de funcionalidad
- [ ] Documentación
- [ ] CI / build / tooling

## Checklist

- [ ] El título del PR y los commits siguen [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (ver [CLAUDE.md](../CLAUDE.md))
- [ ] `pnpm validate` pasa localmente (typecheck, lint, test:coverage ≥ 90%, build)
- [ ] `pnpm format:check`, `pnpm spellcheck` y `pnpm audit:a11y` pasan
- [ ] Traducciones: `en` y `es` tienen la misma forma y los mismos datos; ningún dato sin confirmar
- [ ] Accesibilidad revisada en modo claro y oscuro (teclado, nombres, contraste)
- [ ] Mobile-first verificado
- [ ] Capturas en claro y oscuro si cambia el diseño
- [ ] `pnpm audit` sin vulnerabilidades

## Issue relacionado

Closes #

## Notas adicionales

<!-- Decisiones técnicas, capturas (claro/oscuro, mobile/desktop), etc. -->
