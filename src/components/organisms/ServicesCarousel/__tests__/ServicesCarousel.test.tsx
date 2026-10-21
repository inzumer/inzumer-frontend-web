import { render, screen, within } from '@testing-library/react';
import { ServicesCarousel } from '../ServicesCarousel';

const services = [
  { icon: 'speed', title: 'Interfaces rápidas', text: 'Uno.' },
  { icon: 'phone', title: 'Apps en WebView', text: 'Dos.' },
] as const;

describe('ServicesCarousel', () => {
  it('should list every service in a named carousel with tracked controls', () => {
    render(
      <ServicesCarousel
        title="En qué puedo ayudarte"
        services={[...services]}
        more={{ label: 'Hablemos', href: '#contact' }}
        labels={{ previous: 'Anterior', next: 'Siguiente', goTo: 'Ir al servicio {number}' }}
      />,
    );

    const carousel = screen.getByRole('region', { name: 'En qué puedo ayudarte' });

    expect(within(carousel).getAllByRole('group', { name: /\/ 2$/ })).toHaveLength(2);
    expect(within(carousel).getAllByRole('link', { name: 'Hablemos' })).toHaveLength(2);
    expect(within(carousel).getByRole('button', { name: 'Siguiente' })).toHaveAttribute(
      'id',
      'services-button-next',
    );
    expect(within(carousel).getByRole('button', { name: 'Ir al servicio 2' })).toHaveAttribute(
      'id',
      'services-button-go-to-2',
    );
  });
});
