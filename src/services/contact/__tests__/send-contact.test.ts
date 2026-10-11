import { CONTACT_ENDPOINT, sendContact } from '../send-contact';

const input = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'Hola, quiero hablar de un proyecto.',
  lang: 'es',
} as const;

describe('sendContact', () => {
  it('should post the form as JSON and report success', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));

    await expect(sendContact(input, fetcher)).resolves.toBe(true);
    expect(fetcher).toHaveBeenCalledWith(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  });

  it('should report failure on an error status or a network error', async () => {
    await expect(
      sendContact(input, vi.fn().mockResolvedValue(new Response(null, { status: 502 }))),
    ).resolves.toBe(false);
    await expect(sendContact(input, vi.fn().mockRejectedValue(new Error('offline')))).resolves.toBe(
      false,
    );
  });
});
