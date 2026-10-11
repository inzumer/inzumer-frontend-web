import type { APIRoute } from 'astro';
import { cvSource, jsonResume, localePaths, type Locale } from '@utils';

export const getStaticPaths = localePaths;

/** The CV in the JSON Resume standard. */
export const GET: APIRoute = ({ params, site, url }) => {
  const lang = params.lang as Locale;
  const { profile, contact } = cvSource(lang);
  const canonical = new URL(url.pathname, site ?? url).href;

  return new Response(JSON.stringify(jsonResume(profile, contact, lang, canonical), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
