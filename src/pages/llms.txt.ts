import type { APIRoute } from 'astro';
import { SITE_URL } from '@constants';
import { getTranslations } from '@i18n';
import { DEFAULT_LOCALE, llmsTxt, LOCALES } from '@utils';

/** `/llms.txt`: a short guide for AI readers to the CV in every format. */
export const GET: APIRoute = () =>
  new Response(llmsTxt(getTranslations(DEFAULT_LOCALE, 'profile'), SITE_URL, LOCALES), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
