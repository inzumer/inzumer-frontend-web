import { handleContact } from '../handle-contact';

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'Hola, quiero hablar de un proyecto.',
  lang: 'es',
};

const post = (body: unknown) =>
  new Request('https://www.inzumer.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const okTransport = () => ({ sendMail: vi.fn().mockResolvedValue({}) });
const options = (overrides = {}) => ({
  transport: okTransport(),
  allow: () => true,
  clientAddress: '1.2.3.4',
  ...overrides,
});

describe('handleContact', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should send both emails for a valid message', async () => {
    const transport = okTransport();
    const response = await handleContact(post(valid), options({ transport }));

    expect(response.status).toBe(204);
    expect(transport.sendMail).toHaveBeenCalledTimes(2);
  });

  it('should pretend success for bots without sending anything', async () => {
    const transport = okTransport();
    const response = await handleContact(
      post({ ...valid, website: 'spam' }),
      options({ transport }),
    );

    expect(response.status).toBe(204);
    expect(transport.sendMail).not.toHaveBeenCalled();
  });

  it('should reject invalid or unreadable bodies', async () => {
    expect((await handleContact(post({ ...valid, email: 'nope' }), options())).status).toBe(400);
    expect((await handleContact(post('{broken'), options())).status).toBe(400);
  });

  it('should stop floods from the same address', async () => {
    const allow = vi.fn().mockReturnValue(false);
    const response = await handleContact(post(valid), options({ allow }));

    expect(response.status).toBe(429);
    expect(allow).toHaveBeenCalledWith('1.2.3.4');
  });

  it('should report a missing configuration or a failed delivery', async () => {
    expect((await handleContact(post(valid), options({ transport: null }))).status).toBe(503);

    const transport = { sendMail: vi.fn().mockRejectedValue(new Error('smtp')) };

    expect((await handleContact(post(valid), options({ transport }))).status).toBe(502);
  });
});
