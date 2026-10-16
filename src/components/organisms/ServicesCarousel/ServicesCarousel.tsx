import { Carousel } from '@inzumer/ui-library';
import type { ServiceIconName } from '@components/atoms/Icons';
import { SectionHeader } from '@components/molecules/SectionHeader';
import { ServiceCard } from '@components/molecules/ServiceCard';
import { interpolate, trackingId } from '@utils';

export interface ServicesCarouselProps {
  title: string;
  services: { icon: ServiceIconName; title: string; text: string }[];
  more: { label: string; href: string };
  labels: { previous: string; next: string; goTo: string };
}

/** "How I can help": the lib's Carousel with the controls together on the right. */
export const ServicesCarousel = ({ title, services, more, labels }: ServicesCarouselProps) => (
  <Carousel
    label={title}
    header={<SectionHeader id="services-title" title={title} />}
    previousLabel={labels.previous}
    nextLabel={labels.next}
    goToLabel={(index) => interpolate(labels.goTo, { number: index + 1 })}
    buttonsPosition="end"
    indicatorsPosition="end"
    buttonIds={{
      previous: trackingId('services', 'button', 'previous'),
      next: trackingId('services', 'button', 'next'),
      indicator: (index) => trackingId('services', 'button', 'go-to', index + 1),
    }}
    className="gap-12"
  >
    {services.map((service, index) => (
      <ServiceCard key={service.title} {...service} more={more} index={index} />
    ))}
  </Carousel>
);
