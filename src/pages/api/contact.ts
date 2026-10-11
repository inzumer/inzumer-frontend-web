import type { APIRoute } from 'astro';
import { createResendTransport, handleContact } from '@services/contact-email';
import { createRateLimiter } from '@utils';

/** Runs on demand (Vercel function); the rest of the site is static. */
export const prerender = false;

/** Five messages per address every ten minutes. */
const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export const POST: APIRoute = ({ request, clientAddress }) => {
  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env['RESEND_API_KEY'];
  const transport = apiKey ? createResendTransport(apiKey) : null;

  return handleContact(request, { transport, allow, clientAddress });
};
