import { Carousel } from '@inzumer/ui-library';
import { trackingId } from '@utils';

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface ProjectGalleryProps {
  /** Project slug, for the tracking ids. */
  slug: string;
  images: GalleryImage[];
  labels: {
    label: string;
    previous: string;
    next: string;
    slide: string;
    /** Added to each screen's alt text: the link opens it at full size. */
    open: string;
  };
}

/** Screens one at a time with a "03 / 10" counter, each linked to its full size (the slide crops it). */
export const ProjectGallery = ({ slug, images, labels }: ProjectGalleryProps) => {
  const total = images.length;

  if (total === 0) {
    return null;
  }

  return (
    <Carousel
      label={labels.label}
      previousLabel={labels.previous}
      nextLabel={labels.next}
      slideLabel={(index, total) => `${labels.slide} ${index + 1} / ${total}`}
      buttons={total > 1}
      indicatorStyle="counter"
      indicatorsPosition="start"
      buttonsPosition="end"
      slideClassName="w-full sm:w-full lg:w-full"
      buttonIds={{
        previous: trackingId('gallery', 'button', 'previous', slug),
        next: trackingId('gallery', 'button', 'next', slug),
      }}
      className="gap-5"
    >
      {images.map((image, position) => (
        <a
          key={image.src}
          id={trackingId('gallery', 'link', 'screen', slug, position + 1)}
          href={image.src}
          target="_blank"
          rel="noopener"
          aria-label={`${image.alt} · ${labels.open}`}
          className="block overflow-hidden rounded-[1.8rem] border border-(--border-default) bg-(--surface-secondary) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--border-focus)"
        >
          <img
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover"
          />
        </a>
      ))}
    </Carousel>
  );
};
