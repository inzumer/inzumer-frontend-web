import { useId } from 'react';
import { useHorizontalScroll } from '@inzumer/ui-library';
import type { ServiceIconName } from '@components/atoms/Icons';
import { CarouselArrows } from '@components/molecules/CarouselArrows';
import { SectionHeader } from '@components/molecules/SectionHeader';
import { ServiceCard } from '@components/molecules/ServiceCard';

export interface ServicesCarouselProps {
  title: string;
  services: { icon: ServiceIconName; title: string; text: string }[];
  more: { label: string; href: string };
  labels: { previous: string; next: string };
}

/** "How I can help": bordered cards in a row that scrolls, with round arrows by the title. */
export const ServicesCarousel = ({ title, services, more, labels }: ServicesCarouselProps) => {
  const titleId = useId();
  const trackId = useId();
  const { ref, edges, update, scrollByPage } = useHorizontalScroll<HTMLUListElement>();

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-12">
      <SectionHeader
        id={titleId}
        title={title}
        actions={
          <CarouselArrows
            scope="services"
            labels={labels}
            controls={trackId}
            disabled={{ previous: edges.start, next: edges.end }}
            onPrevious={() => scrollByPage(-1)}
            onNext={() => scrollByPage(1)}
          />
        }
      />
      <ul
        ref={ref}
        id={trackId}
        onScroll={update}
        className="-mx-1 grid snap-x snap-mandatory [scrollbar-width:none] auto-cols-[85%] grid-flow-col gap-7 overflow-x-auto overscroll-x-contain px-1 pb-2 sm:auto-cols-[calc((100%-2.8rem)/2)] lg:auto-cols-[calc((100%-5.6rem)/3)]"
      >
        {services.map((service, index) => (
          <li key={service.title} className="snap-start">
            <ServiceCard {...service} more={more} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
};
