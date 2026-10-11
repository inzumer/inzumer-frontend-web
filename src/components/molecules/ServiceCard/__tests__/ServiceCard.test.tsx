import { render, screen } from '@testing-library/react';
import { ServiceCard } from '../ServiceCard';

describe('ServiceCard', () => {
  it('should render the service with its icon, text and contact link', () => {
    const { container } = render(
      <ServiceCard
        icon="speed"
        title="Interfaces rápidas"
        text="Core Web Vitals en verde."
        more={{ label: 'Hablemos', href: '#contact' }}
        index={0}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Interfaces rápidas' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Core Web Vitals en verde.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hablemos' })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: 'Hablemos' })).toHaveAttribute(
      'id',
      'services-link-talk-0',
    );
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
