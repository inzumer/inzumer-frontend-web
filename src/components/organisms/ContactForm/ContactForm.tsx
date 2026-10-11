import { useState, type SyntheticEvent } from 'react';
import { Button, Input, RichText, Textarea } from '@inzumer/ui-library';
import { sendContact } from '@services/contact';
import { invalidContactFields, trackingId, type ContactField, type Locale } from '@utils';

export interface ContactFormLabels {
  name: string;
  email: string;
  message: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderMessage: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  invalid: string;
  honeypot: string;
}

export interface ContactFormProps {
  lang: Locale;
  labels: ContactFormLabels;
  send?: typeof sendContact;
}

type Status = 'idle' | 'sending' | 'success' | 'error' | 'invalid';

const field = (form: FormData, name: string): string => String(form.get(name) ?? '');

/** Contact form: checks the fields here, sends them to the endpoint and announces the result. */
export const ContactForm = ({ lang, labels, send = sendContact }: ContactFormProps) => {
  const [status, setStatus] = useState<Status>('idle');
  const [invalid, setInvalid] = useState<ContactField[]>([]);

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const input = {
      name: field(form, 'name'),
      email: field(form, 'email'),
      message: field(form, 'message'),
      website: field(form, 'website'),
      lang,
    };
    const wrong = invalidContactFields(input);
    setInvalid(wrong);

    if (wrong.length > 0) {
      setStatus('invalid');

      return;
    }

    setStatus('sending');
    const sent = await send(input);
    setStatus(sent ? 'success' : 'error');

    if (sent) {
      formElement.reset();
    }
  };

  /** Only invalid fields get the prop (`exactOptionalPropertyTypes`). */
  const errorFor = (name: ContactField) =>
    invalid.includes(name) ? { error: labels.invalid } : {};
  const message = { success: labels.success, error: labels.error, invalid: labels.invalid }[
    status as 'success' | 'error' | 'invalid'
  ];

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      <Input
        id={trackingId('contact', 'input', 'name')}
        name="name"
        autoComplete="name"
        required
        label={labels.name}
        placeholder={labels.placeholderName}
        {...errorFor('name')}
      />
      <Input
        id={trackingId('contact', 'input', 'email')}
        name="email"
        type="email"
        autoComplete="email"
        required
        label={labels.email}
        placeholder={labels.placeholderEmail}
        {...errorFor('email')}
      />
      <Textarea
        id={trackingId('contact', 'input', 'message')}
        name="message"
        rows={5}
        required
        label={labels.message}
        placeholder={labels.placeholderMessage}
        {...errorFor('message')}
      />
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {labels.honeypot}
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Button
        id={trackingId('contact', 'button', 'send')}
        type="submit"
        size="lg"
        loading={status === 'sending'}
        className="self-start rounded-full px-8"
      >
        {status === 'sending' ? labels.sending : labels.send}
      </Button>
      <RichText role="status" variant="p3" className="min-h-[2.4rem] text-(--text-secondary)">
        {message ?? ''}
      </RichText>
    </form>
  );
};
