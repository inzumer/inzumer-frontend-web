import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm, type ContactFormLabels } from '../ContactForm';

const labels: ContactFormLabels = {
  name: 'Nombre',
  email: 'Correo electrónico',
  message: 'Mensaje',
  placeholderName: 'Tu nombre',
  placeholderEmail: 'tu@correo.com',
  placeholderMessage: 'Contame',
  send: 'Enviar mensaje',
  sending: 'Enviando…',
  success: 'Mensaje enviado.',
  error: 'No se pudo enviar.',
  invalid: 'Revisá los campos marcados.',
  honeypot: 'Dejá este campo vacío',
};

const fill = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Nombre'), 'Ada');
  await user.type(screen.getByLabelText('Correo electrónico'), 'ada@example.com');
  await user.type(screen.getByLabelText('Mensaje'), 'Hola, quiero hablar de un proyecto.');
};

describe('ContactForm', () => {
  it('should mark invalid fields and not send', async () => {
    const user = userEvent.setup();
    const send = vi.fn();
    render(<ContactForm lang="es" labels={labels} send={send} />);

    await user.type(screen.getByLabelText('Correo electrónico'), 'nope');
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(send).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Revisá los campos marcados.');
  });

  it('should send the fields with the language, announce success and clear the form', async () => {
    const user = userEvent.setup();
    const send = vi.fn().mockResolvedValue(true);
    render(<ContactForm lang="es" labels={labels} send={send} />);

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(send).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hola, quiero hablar de un proyecto.',
      website: '',
      lang: 'es',
    });
    expect(await screen.findByText('Mensaje enviado.')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
  });

  it('should announce a failure and keep what was written', async () => {
    const user = userEvent.setup();
    render(<ContactForm lang="en" labels={labels} send={vi.fn().mockResolvedValue(false)} />);

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(await screen.findByText('No se pudo enviar.')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ada');
  });

  it('should show the sending state while it waits', async () => {
    const user = userEvent.setup();
    let finish: (sent: boolean) => void = () => {};
    const send = vi.fn(() => new Promise<boolean>((resolve) => (finish = resolve)));
    render(<ContactForm lang="es" labels={labels} send={send} />);

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(screen.getByRole('button', { name: 'Enviando…' })).toHaveAttribute('aria-busy', 'true');
    finish(true);
    expect(await screen.findByText('Mensaje enviado.')).toBeInTheDocument();
  });

  it('should keep the honeypot out of reach', () => {
    render(<ContactForm lang="es" labels={labels} />);

    const honeypot = document.querySelector('input[name="website"]');

    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
