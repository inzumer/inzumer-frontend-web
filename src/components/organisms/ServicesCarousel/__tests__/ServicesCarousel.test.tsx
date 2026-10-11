import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServicesCarousel } from '../ServicesCarousel';

const services = [
  { icon: 'speed', title: 'Interfaces rápidas', text: 'Uno.' },
  { icon: 'phone', title: 'Apps en WebView', text: 'Dos.' },
] as const;

const renderCarousel = () =>
  render(
    <ServicesCarousel
      title="En qué puedo ayudarte"
      services={[...services]}
      more={{ label: 'Hablemos', href: '#contact' }}
      labels={{ previous: 'Anterior', next: 'Siguiente' }}
    />,
  );

describe('ServicesCarousel', () => {
  it('should list every service under a named section', () => {
    renderCarousel();

    const section = screen.getByRole('region', { name: 'En qué puedo ayudarte' });

    expect(within(section).getAllByRole('listitem')).toHaveLength(2);
    expect(within(section).getAllByRole('link', { name: 'Hablemos' })).toHaveLength(2);
  });

  it('should page the row with the arrows once it overflows', async () => {
    const user = userEvent.setup();
    const scrollBy = vi.fn();
    Element.prototype.scrollBy = scrollBy;
    renderCarousel();
    const list = screen.getByRole('list');
    const next = screen.getByRole('button', { name: 'Siguiente' });

    expect(next).toBeDisabled();
    expect(next).toHaveAttribute('aria-controls', list.id);

    Object.defineProperty(list, 'scrollWidth', { value: 2000, configurable: true });
    Object.defineProperty(list, 'clientWidth', { value: 1000, configurable: true });
    fireEvent.scroll(list);

    expect(next).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    await user.click(next);
    expect(scrollBy).toHaveBeenCalledOnce();

    Object.defineProperty(list, 'scrollLeft', { value: 1000, configurable: true });
    fireEvent.scroll(list);
    await user.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(scrollBy).toHaveBeenCalledTimes(2);
  });
});
