import type { APIContext } from 'astro';
import { GET } from '../llms.txt.ts';

describe('GET /llms.txt', () => {
  it('should point AI readers to the CV in every language and format', async () => {
    const response = await GET({} as APIContext);
    const text = await response.text();

    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(text).toContain('https://www.inzumer.com/es/cv.md');
    expect(text).toContain('https://www.inzumer.com/en/cv.pdf');
  });
});
