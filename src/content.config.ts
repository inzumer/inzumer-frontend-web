import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** One file per project and language: `content/projects/<lang>/<slug>.md`. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Tab and breadcrumb label, shorter than the title. */
      name: z.string(),
      company: z.string(),
      kind: z.string(),
      summary: z.string(),
      url: z.url().optional(),
      urlLabel: z.string().optional(),
      stack: z.array(z.string()).min(1),
      cover: image(),
      coverAlt: z.string(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      /** Position in the showcase, lowest first. */
      order: z.number().int(),
    }),
});

export const collections = { projects };
