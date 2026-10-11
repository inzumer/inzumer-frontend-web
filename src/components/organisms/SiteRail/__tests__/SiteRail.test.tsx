import { render, screen, within } from '@testing-library/react';
import { SiteRail } from '../SiteRail';

describe('SiteRail', () => {
  it('should link the profiles, mark the current language and offer the theme', () => {
    render(
      <SiteRail
        languages={[
          { lang: 'es', href: '/es', current: true },
          { lang: 'en', href: '/en', current: false },
        ]}
        labels={{
          rail: 'Redes y preferencias',
          language: 'Idioma',
          toDark: 'Pasar a modo oscuro',
          toLight: 'Pasar a modo claro',
        }}
      />,
    );

    const rail = screen.getByRole('navigation', { name: 'Redes y preferencias' });

    expect(within(rail).getByRole('link', { name: /GitHub/ })).toHaveAttribute(
      'href',
      'https://github.com/inzumer',
    );
    expect(within(rail).getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(within(rail).getByRole('link', { name: 'ES' })).toHaveAttribute('aria-current', 'true');
    expect(within(rail).getByRole('link', { name: 'EN' })).not.toHaveAttribute('aria-current');
    expect(within(rail).getByRole('button', { name: /Pasar a modo/ })).toBeInTheDocument();
  });
});
