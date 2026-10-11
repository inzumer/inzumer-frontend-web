import type { APIRoute } from 'astro';
import { cvMarkdown, cvSource, localePaths, type Locale } from '@utils';

export const getStaticPaths = localePaths;

/** The CV as plain Markdown, for AI readers. */
export const GET: APIRoute = ({ params }) => {
  const { profile, headings, contact } = cvSource(params.lang as Locale);

  return new Response(cvMarkdown(profile, headings, contact), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
