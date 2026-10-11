import type { ContactInput } from '@utils';
import { NOTIFICATION_ADDRESS, renderAutoReply, renderNotification } from './contact-email';

export interface MailMessage {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}

export interface MailTransport {
  sendMail: (message: MailMessage) => Promise<unknown>;
}

export const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/** Sender on the verified inzumer.com domain (no mailbox needed); replies go to Gmail. */
export const CONTACT_SENDER = 'Nahuel Zamuner <contact@inzumer.com>';

/** Resend's HTTP API (`RESEND_API_KEY`, set in Vercel; never in the repo). */
export const createResendTransport = (
  apiKey: string,
  fetcher: typeof fetch = fetch,
): MailTransport => ({
  sendMail: async ({ replyTo, ...message }) => {
    const response = await fetcher(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...message, ...(replyTo && { reply_to: replyTo }) }),
    });

    if (!response.ok) {
      throw new Error(`Resend answered ${response.status}: ${await response.text()}`);
    }

    return response.json();
  },
});

/** Sends the notice to Nahuel and the confirmation to the sender; both can be answered by email. */
export const sendContactEmails = async (
  input: ContactInput,
  transport: MailTransport,
  from: string = CONTACT_SENDER,
): Promise<void> => {
  const [notification, autoReply] = await Promise.all([
    renderNotification(input),
    renderAutoReply(input),
  ]);

  await transport.sendMail({
    from,
    to: NOTIFICATION_ADDRESS,
    replyTo: input.email,
    ...notification,
  });
  await transport.sendMail({ from, to: input.email, replyTo: NOTIFICATION_ADDRESS, ...autoReply });
};
