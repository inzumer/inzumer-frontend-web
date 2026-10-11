import type { APIContext } from 'astro';
import { POST } from '../contact';

const request = () =>
  new Request('https://www.inzumer.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hola, quiero hablar de un proyecto.',
      lang: 'es',
    }),
  });

describe('POST /api/contact', () => {
  it('should answer 503 while the Resend key is missing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('RESEND_API_KEY', '');

    const response = await POST({ request: request(), clientAddress: '1.2.3.4' } as APIContext);

    expect(response.status).toBe(503);
    vi.unstubAllEnvs();
  });
});
