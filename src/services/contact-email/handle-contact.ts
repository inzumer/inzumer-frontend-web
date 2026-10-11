import { contactSchema } from '@utils';
import { sendContactEmails, type MailTransport } from './mailer';

export interface HandleContactOptions {
  /** `null` when the Resend key isn't configured. */
  transport: MailTransport | null;
  /** Rate limit by client address; `false` means too many messages. */
  allow: (key: string) => boolean;
  clientAddress: string;
}

const status = (code: number) => new Response(null, { status: code });

/** POST /api/contact: validates, filters bots and floods, then sends both emails. */
export const handleContact = async (
  request: Request,
  { transport, allow, clientAddress }: HandleContactOptions,
): Promise<Response> => {
  const body: unknown = await request.json().catch(() => null);
  const honeypot = (body as { website?: unknown } | null)?.website;

  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return status(204);
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return status(400);
  }

  if (!allow(clientAddress)) {
    return status(429);
  }

  if (!transport) {
    console.error('Contact form: RESEND_API_KEY is not set.');

    return status(503);
  }

  try {
    await sendContactEmails(parsed.data, transport);

    return status(204);
  } catch (error) {
    console.error('Contact form: sending failed.', error);

    return status(502);
  }
};
