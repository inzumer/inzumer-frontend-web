import { RichText } from '@inzumer/ui-library';
import { SERVICE_ICONS, type ServiceIconName } from '@components/atoms/Icons';
import { trackingId } from '@utils';

export interface ServiceCardProps {
  icon: ServiceIconName;
  title: string;
  text: string;
  /** "Let's talk" link to the contact section. */
  more: { label: string; href: string };
  index: number;
}

/** Bordered card on the page color: centered icon in a soft circle, title, text and a link. */
export const ServiceCard = ({ icon, title, text, more, index }: ServiceCardProps) => {
  const ServiceIcon = SERVICE_ICONS[icon];

  return (
    <article className="flex h-full flex-col items-center gap-5 rounded-[1.8rem] border border-(--border-default) px-8 pt-10 pb-8 text-center transition-colors duration-200 focus-within:border-(--border-focus) hover:border-(--border-strong) motion-reduce:transition-none">
      <span className="grid size-[5.2rem] place-items-center rounded-full bg-(--badge-bg)">
        <ServiceIcon className="size-[2.2rem]" />
      </span>
      <RichText as="h3" variant="h5" className="font-normal">
        {title}
      </RichText>
      <RichText variant="p3" weight="light" className="max-w-[32ch] flex-1 text-(--text-secondary)">
        {text}
      </RichText>
      <a
        id={trackingId('services', 'link', 'talk', index)}
        href={more.href}
        className="inline-flex min-h-11 items-center text-[1.3rem] font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus)"
      >
        {more.label}
      </a>
    </article>
  );
};
