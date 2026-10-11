import type { Locale } from '@utils/locale';

interface ProjectEntry {
  id: string;
  data: { order: number };
}

/** Slug of an entry stored as `<lang>/<slug>.md`: `en/belo` → `belo`. */
export const projectSlug = (id: string): string => id.split('/').pop() ?? id;

/** One language's projects, in showcase order. */
export const projectsFor = <T extends ProjectEntry>(entries: T[], lang: Locale): T[] =>
  entries
    .filter((entry) => entry.id.startsWith(`${lang}/`))
    .sort((a, b) => a.data.order - b.data.order);

interface ProcessedImage {
  src: string;
  attributes: Record<string, unknown>;
}

/** An optimized image as the gallery needs it; falls back to 4:3 when Astro gives no size. */
export const galleryImage = ({ src, attributes }: ProcessedImage, alt: string) => ({
  src,
  width: Number(attributes['width'] ?? 1200),
  height: Number(attributes['height'] ?? 900),
  alt,
});
