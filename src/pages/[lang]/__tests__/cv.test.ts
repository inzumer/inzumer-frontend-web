import type { APIContext } from 'astro';
import { GET as getJson } from '../cv.json.ts';
import { GET as getMarkdown } from '../cv.md.ts';
import { GET as getPdf } from '../cv.pdf.ts';

const context = (lang: string, path: string) =>
  ({
    params: { lang },
    site: new URL('https://www.inzumer.com'),
    url: new URL(`http://localhost${path}`),
  }) as unknown as APIContext;

describe('CV endpoints', () => {
  it('should serve the Markdown CV in the page language', async () => {
    const response = await getMarkdown(context('es', '/es/cv.md'));

    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(await response.text()).toContain('## Experiencia');
  });

  it('should serve JSON Resume with the canonical URL on the site', async () => {
    const response = await getJson(context('en', '/en/cv.json'));
    const resume = await response.json();

    expect(resume.meta).toStrictEqual({
      canonical: 'https://www.inzumer.com/en/cv.json',
      language: 'en',
    });
  });

  it('should fall back to the request URL without a site', async () => {
    const response = await getJson({
      ...context('en', '/en/cv.json'),
      site: undefined,
    } as unknown as APIContext);

    expect((await response.json()).meta.canonical).toBe('http://localhost/en/cv.json');
  });

  it('should serve the PDF with its file name', async () => {
    const response = await getPdf(context('es', '/es/cv.pdf'));

    expect(response.headers.get('Content-Type')).toBe('application/pdf');
    expect(response.headers.get('Content-Disposition')).toContain('Nahuel-Zamuner-CV-es.pdf');
    expect(new TextDecoder().decode((await response.arrayBuffer()).slice(0, 5))).toBe('%PDF-');
  }, 20000);
});
