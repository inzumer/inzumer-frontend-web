import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GTAG_SRC } from '@services/analytics';
import { readSettings, updateSettings } from '@utils';
import { ConsentManager, COOKIES_HASH, type ConsentManagerLabels } from '../ConsentManager';

const labels: ConsentManagerLabels = {
  title: 'Cookies',
  description: 'Uso Google Analytics solo si lo permites.',
  privacyLink: 'Privacidad',
  accept: 'Aceptar',
  reject: 'Rechazar',
  customize: 'Personalizar',
  preferencesTitle: 'Preferencias de cookies',
  preferencesDescription: 'Elige qué puede guardar este sitio.',
  save: 'Guardar',
  cancel: 'Cancelar',
  required: 'Siempre activas',
  necessary: { title: 'Necesarias', description: 'Tema e idioma.' },
  analytics: { title: 'Analítica', description: 'Google Analytics.' },
};

const gtagScript = () => document.head.querySelector(`script[src^="${GTAG_SRC}"]`);

const renderManager = (measurementId: string | undefined = 'G-TEST') =>
  render(
    <ConsentManager measurementId={measurementId} privacyHref="/es/privacy" labels={labels} />,
  );

describe('ConsentManager', () => {
  afterEach(() => {
    const win = window as unknown as Record<string, unknown>;
    delete win['gtag'];
    delete win['dataLayer'];
    document.head.innerHTML = '';
  });

  it('should ask first and load Google Analytics only after accepting', async () => {
    const user = userEvent.setup();
    renderManager();

    expect(screen.getByRole('link', { name: 'Privacidad' })).toHaveAttribute('href', '/es/privacy');
    expect(gtagScript()).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(readSettings().consent).toStrictEqual({ analytics: true });
    expect(gtagScript()).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Aceptar' })).not.toBeInTheDocument();
  });

  it('should keep Google Analytics off when rejected', async () => {
    const user = userEvent.setup();
    renderManager();

    await user.click(screen.getByRole('button', { name: 'Rechazar' }));

    expect(readSettings().consent).toStrictEqual({ analytics: false });
    expect(gtagScript()).toBeNull();
  });

  it('should load right away for someone who already accepted', () => {
    updateSettings({ consent: { analytics: true } });
    renderManager();

    expect(screen.queryByRole('button', { name: 'Aceptar' })).not.toBeInTheDocument();
    expect(gtagScript()).not.toBeNull();
  });

  it('should open the preferences from the footer link', () => {
    updateSettings({ consent: { analytics: false } });
    renderManager();

    act(() => {
      window.location.hash = COOKIES_HASH;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(screen.getByRole('dialog', { name: 'Preferencias de cookies' })).toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });

  it('should show nothing without a measurement id', () => {
    const { container } = render(
      <ConsentManager measurementId={undefined} privacyHref="/es/privacy" labels={labels} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
