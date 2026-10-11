import {
  createEmailTheme,
  EmailCard,
  EmailText,
  MessageTemplate,
  renderEmail,
} from '@inzumer/email';
import { SITE_AUTHOR, SITE_URL } from '@constants';
import { getTranslations } from '@i18n';
import { interpolate, type ContactInput } from '@utils';

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/** Inzumer in email: black and white, Inter with safe fallbacks. */
const theme = createEmailTheme({
  colors: {
    text: '#151515',
    textSecondary: '#525252',
    border: '#e0e0e0',
    link: '#151515',
    primary: '#151515',
    primaryText: '#f8f8f8',
  },
  fonts: {
    body: "Inter, 'Helvetica Neue', Arial, sans-serif",
    heading: "Inter, 'Helvetica Neue', Arial, sans-serif",
  },
  // Rounded cards; pill buttons and the header image come with inzumerEmailTheme (@inzumer/email 0.4).
  radius: '18px',
});

const brand = { name: 'INZUMER' };

/**
 * Confirmation for the sender, in their language. It never repeats their message, so the form
 * can't be used to send arbitrary text to someone else's inbox.
 */
export const renderAutoReply = async ({ name, lang }: ContactInput): Promise<RenderedEmail> => {
  const t = getTranslations(lang, 'contact-email').autoReply;
  const { html, text } = await renderEmail(
    <MessageTemplate
      lang={lang}
      preview={t.preview}
      brand={brand}
      theme={theme}
      title={t.title}
      paragraphs={[interpolate(t.greeting, { name }), t.body]}
      action={{ href: `${SITE_URL}/${lang}`, label: t.button }}
      signature={t.signature}
      footer={{ reason: t.footer }}
    />,
  );

  return { subject: interpolate(t.subject, { name }), html, text };
};

/** The message split into paragraphs, with keys that stay unique when lines repeat. */
const messageLines = (message: string) =>
  message.split(/\n+/).map((line, position) => ({ key: `${position}:${line}`, line }));

/** Notice for Nahuel (in Spanish) with the whole message; replying answers the sender. */
export const renderNotification = async ({
  name,
  email,
  message,
}: ContactInput): Promise<RenderedEmail> => {
  const t = getTranslations('es', 'contact-email').notification;
  const { html, text } = await renderEmail(
    <MessageTemplate
      lang="es"
      preview={interpolate(t.preview, { name })}
      brand={brand}
      theme={theme}
      title={t.title}
      paragraphs={[interpolate(t.from, { name, email })]}
      action={{ href: `mailto:${email}`, label: t.button }}
      footer={{ reason: t.footer }}
    >
      <EmailCard>
        {messageLines(message).map(({ key, line }) => (
          <EmailText key={key}>{line}</EmailText>
        ))}
      </EmailCard>
    </MessageTemplate>,
  );

  return { subject: interpolate(t.subject, { name }), html, text };
};

/** Where the notice goes. */
export const NOTIFICATION_ADDRESS = SITE_AUTHOR.email;
