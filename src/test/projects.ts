import type { ProjectDialogLabels, ShowcaseProject } from '@components';

/** A project with a cover and two screens, for the showcase and dialog tests. */
export const projectFixture = (slug: string, name: string): ShowcaseProject => ({
  slug,
  name,
  title: `${name} title`,
  company: 'Mercado Libre',
  kind: 'Frontend web',
  summary: `${name} summary`,
  stack: ['React', 'TypeScript', 'Sass', 'Jest', 'Datadog'],
  href: `/es/projects/${slug}`,
  html: `<p>${name} body</p>`,
  cover: { src: `/${slug}.webp`, width: 800, height: 600, alt: `${name} cover` },
  images: [
    { src: `/${slug}.webp`, width: 800, height: 600, alt: `${name} cover` },
    { src: `/${slug}-1.webp`, width: 1600, height: 1000, alt: `${name} screen` },
  ],
});

export const dialogLabels: ProjectDialogLabels = {
  close: 'Cerrar proyecto',
  stack: 'Stack',
  visit: 'Visitar',
  page: 'Abrir la página completa',
  gallery: {
    label: 'Pantallas',
    previous: 'Pantalla anterior',
    next: 'Pantalla siguiente',
    slide: 'Pantalla',
    open: 'se abre en tamaño completo',
  },
};

/** Makes `matchMedia` answer the same for every query, as on a desktop or a phone. */
export const stubMatchMedia = (matches: boolean) => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
};
