import {
  createResendTransport,
  RESEND_ENDPOINT,
  sendContactEmails,
  type MailMessage,
} from '../mailer';

const input = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'Hola, quiero hablar de un proyecto.',
  lang: 'es',
} as const;

const message: MailMessage = {
  from: 'Nahuel Zamuner <contact@inzumer.com>',
  to: 'ada@example.com',
  replyTo: 'inzumer@gmail.com',
  subject: 'Hola',
  html: '<p>Hola</p>',
  text: 'Hola',
};

describe('mailer', () => {
  it('should send the notice to Nahuel first, then the confirmation to the sender', async () => {
    const sent: MailMessage[] = [];
    const transport = {
      sendMail: async (mail: MailMessage) => {
        sent.push(mail);
      },
    };

    await sendContactEmails(input, transport);

    expect(sent.map(({ to, replyTo, from }) => ({ to, replyTo, from }))).toStrictEqual([
      {
        to: 'inzumer@gmail.com',
        replyTo: 'ada@example.com',
        from: 'Nahuel Zamuner <contact@inzumer.com>',
      },
      {
        to: 'ada@example.com',
        replyTo: 'inzumer@gmail.com',
        from: 'Nahuel Zamuner <contact@inzumer.com>',
      },
    ]);
    expect(sent[1]?.subject).toBe('Gracias por escribirme, Ada');
  });

  it('should not confirm when the notice fails', async () => {
    const sendMail = vi.fn().mockRejectedValueOnce(new Error('resend'));

    await expect(sendContactEmails(input, { sendMail })).rejects.toThrow('resend');
    expect(sendMail).toHaveBeenCalledOnce();
  });

  it('should post to Resend with the key and the reply-to address', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ id: 'email-1' }));

    await expect(
      createResendTransport('re_test', fetcher).sendMail(message),
    ).resolves.toStrictEqual({
      id: 'email-1',
    });
    expect(fetcher).toHaveBeenCalledWith(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: 'Bearer re_test', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: 'inzumer@gmail.com',
      }),
    });
  });

  it('should leave out reply-to when there is none and fail on an error answer', async () => {
    const { replyTo: _, ...withoutReply } = message;
    const fetcher = vi.fn().mockResolvedValue(new Response('domain not verified', { status: 403 }));

    await expect(createResendTransport('re_test', fetcher).sendMail(withoutReply)).rejects.toThrow(
      'Resend answered 403: domain not verified',
    );
    expect(JSON.parse(fetcher.mock.calls[0]?.[1]?.body as string)).not.toHaveProperty('reply_to');
  });
});
