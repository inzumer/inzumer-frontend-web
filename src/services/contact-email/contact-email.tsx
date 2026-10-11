import {
  EmailBanner,
  EmailCard,
  EmailText,
  inzumerEmailTheme,
  MessageTemplate,
  renderEmail,
  type EmailSocialLink,
} from '@inzumer/email';
import { SITE_AUTHOR, SITE_URL, SOCIAL_LINKS } from '@constants';
import { getTranslations } from '@i18n';
import { interpolate, type ContactInput } from '@utils';

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/** The INZUMER wordmark in black over the email background, hosted with the email Storybook. */
const HEADER_IMAGE = 'https://ui-emails.inzumer.com/brand/inzumer-header.png';

const hero = <EmailBanner src={HEADER_IMAGE} alt="INZUMER, Senior Frontend Engineer" />;

const social: EmailSocialLink[] = [
  { network: 'linkedin', href: SOCIAL_LINKS.linkedin },
  { network: 'github', href: SOCIAL_LINKS.github },
];

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
      theme={inzumerEmailTheme}
      hero={hero}
      title={t.title}
      paragraphs={[interpolate(t.greeting, { name }), t.body]}
      action={{ href: `${SITE_URL}/${lang}`, label: t.button }}
      signature={t.signature}
      footer={{ reason: t.footer, social }}
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
      theme={inzumerEmailTheme}
      hero={hero}
      title={t.title}
      paragraphs={[interpolate(t.from, { name, email })]}
      action={{ href: `mailto:${email}`, label: t.button }}
      footer={{ reason: t.footer, social }}
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
