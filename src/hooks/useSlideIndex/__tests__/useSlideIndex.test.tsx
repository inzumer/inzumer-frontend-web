import { act, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { useSlideIndex } from '../useSlideIndex';

const Probe = ({ track = true }: { track?: boolean }) => {
  const ref = useRef<HTMLElement>(null);
  const index = useSlideIndex(ref);

  return (
    <section ref={ref}>
      {track && (
        <div data-carousel-track="" data-testid="track">
          <div data-testid="slide" />
          <div data-testid="slide" />
          <div data-testid="slide" />
        </div>
      )}
      <output>{index}</output>
    </section>
  );
};

/** jsdom has no layout: each slide sits 100px after the previous one. */
const placeSlides = () => {
  screen.getAllByTestId('slide').forEach((slide, position) => {
    Object.defineProperty(slide, 'offsetLeft', { value: position * 100 });
  });
};

describe('useSlideIndex', () => {
  it('should follow the slide nearest to the scroll position', () => {
    render(<Probe />);
    placeSlides();
    const track = screen.getByTestId('track');

    expect(screen.getByRole('status')).toHaveTextContent('0');

    act(() => {
      track.scrollLeft = 180;
      fireEvent.scroll(track);
    });
    expect(screen.getByRole('status')).toHaveTextContent('2');

    act(() => {
      track.scrollLeft = 90;
      fireEvent.scroll(track);
    });
    expect(screen.getByRole('status')).toHaveTextContent('1');
  });

  it('should stay on the first slide without a track', () => {
    render(<Probe track={false} />);

    expect(screen.getByRole('status')).toHaveTextContent('0');
  });
});
