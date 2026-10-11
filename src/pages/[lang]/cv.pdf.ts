import type { APIRoute } from 'astro';
import { renderCvPdf } from '@services/cv-pdf';
import { cvSource, localePaths, type Locale } from '@utils';

export const getStaticPaths = localePaths;

/** The ATS-friendly PDF, rendered at build time from the profile. */
export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Locale;
  const { fileName, ...source } = cvSource(lang);
  const pdf = await renderCvPdf({ ...source, lang });

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`,
    },
  });
};
