import { useEffect, useState, type RefObject } from 'react';

/** The slide nearest to the start of a ui-library Carousel's track, following its scroll. */
export const useSlideIndex = (carouselRef: RefObject<HTMLElement | null>): number => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = carouselRef.current?.querySelector<HTMLElement>('[data-carousel-track]');

    if (!track) {
      return undefined;
    }

    const update = () => {
      const slides = [...track.children] as HTMLElement[];
      const start = slides[0]?.offsetLeft ?? 0;
      const nearest = slides.reduce(
        (best, slide, position) =>
          Math.abs(slide.offsetLeft - start - track.scrollLeft) <
          Math.abs((slides[best]?.offsetLeft ?? 0) - start - track.scrollLeft)
            ? position
            : best,
        0,
      );

      setIndex(nearest);
    };

    track.addEventListener('scroll', update, { passive: true });

    return () => track.removeEventListener('scroll', update);
  }, [carouselRef]);

  return index;
};
