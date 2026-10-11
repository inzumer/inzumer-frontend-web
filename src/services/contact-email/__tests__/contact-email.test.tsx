import { NOTIFICATION_ADDRESS, renderAutoReply, renderNotification } from '../contact-email';

const input = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'Hola.\nQuiero hablar de un proyecto.',
  lang: 'en',
} as const;

describe('contact emails', () => {
  it('should thank the sender in their language without repeating the message', async () => {
    const email = await renderAutoReply(input);

    expect(email.subject).toBe('Thanks for writing, Ada');
    expect(email.text).toContain('Hi Ada,');
    expect(email.html).toContain('lang="en"');
    expect(email.html).not.toContain('Quiero hablar de un proyecto');
    expect(email.html).toContain('https://www.inzumer.com/en');
  });

  it('should give Nahuel the whole message and a reply link, in Spanish', async () => {
    const email = await renderNotification(input);

    expect(email.subject).toBe('Nuevo mensaje de Ada');
    expect(email.text).toContain('De: Ada <ada@example.com>');
    expect(email.text).toContain('Quiero hablar de un proyecto.');
    expect(email.html).toContain('mailto:ada@example.com');
    expect(NOTIFICATION_ADDRESS).toBe('inzumer@gmail.com');
  });

  it('should escape what people write', async () => {
    const email = await renderNotification({ ...input, message: '<script>alert(1)</script> hola' });

    expect(email.html).not.toContain('<script>alert(1)</script>');
  });
});
