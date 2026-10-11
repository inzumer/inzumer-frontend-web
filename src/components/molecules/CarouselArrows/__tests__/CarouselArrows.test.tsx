import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarouselArrows } from '../CarouselArrows';

describe('CarouselArrows', () => {
  it('should move both ways with tracked, labelled buttons', async () => {
    const user = userEvent.setup();
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    render(
      <CarouselArrows
        scope="services"
        labels={{ previous: 'Anterior', next: 'Siguiente' }}
        controls="services-track"
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Anterior' }));
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(onPrevious).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toHaveAttribute(
      'id',
      'services-button-next',
    );
    expect(screen.getByRole('button', { name: 'Anterior' })).toHaveAttribute(
      'aria-controls',
      'services-track',
    );
  });

  it('should disable an arrow at the edge', () => {
    render(
      <CarouselArrows
        scope="services"
        labels={{ previous: 'Anterior', next: 'Siguiente' }}
        disabled={{ previous: true }}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled();
  });
});
