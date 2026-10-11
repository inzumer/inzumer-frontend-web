import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SiteMenu } from '../SiteMenu';

const renderMenu = () =>
  render(
    <SiteMenu
      links={[
        { key: 'projects', href: '/es#projects', label: 'Proyectos' },
        { key: 'contact', href: '/es#contact', label: 'Contacto' },
      ]}
      language={{ href: '/en', label: 'EN', lang: 'en' }}
      labels={{ open: 'Abrir menú', close: 'Cerrar menú', title: 'Menú', navigation: 'Principal' }}
    />,
  );

describe('SiteMenu', () => {
  it('should open a drawer with the sections and the other language', async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Abrir menú' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Menú' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Proyectos' })).toHaveAttribute(
      'id',
      'menu-link-projects',
    );
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('hreflang', 'en');
  });

  it('should close when a section is chosen', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Abrir menú' }));
    await user.click(screen.getByRole('link', { name: 'Contacto' }));

    expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
