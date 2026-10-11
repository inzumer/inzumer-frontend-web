import { useId } from 'react';
import { Icon, RichText } from '@inzumer/ui-library';
import { SectionHeader } from '@components/molecules/SectionHeader';
import { trackingId } from '@utils';

export interface EcosystemPiece {
  id: string;
  name: string;
  text: string;
  href: string;
  linkLabel: string;
}

export interface EcosystemSectionProps {
  title: string;
  intro: string;
  pieces: EcosystemPiece[];
  ai: { title: string; text: string; points: string[] };
}

/** The reusable stack as numbered, bordered pieces, then how AI fits into the work. */
export const EcosystemSection = ({ title, intro, pieces, ai }: EcosystemSectionProps) => {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-12">
      <SectionHeader id={titleId} title={title} />
      <RichText variant="p2" weight="light" className="max-w-[64ch] text-(--text-secondary)">
        {intro}
      </RichText>
      <ol className="grid gap-px overflow-hidden rounded-[1.8rem] border border-(--border-default) bg-(--border-default) sm:grid-cols-2 lg:grid-cols-3">
        {pieces.map((piece, index) => (
          <li key={piece.id} className="flex flex-col gap-4 bg-(--surface-primary) p-8">
            <RichText
              as="span"
              variant="s4"
              weight="light"
              className="tracking-[0.2em] text-(--text-tertiary)"
            >
              {String(index + 1).padStart(2, '0')}
            </RichText>
            <RichText
              as="h3"
              variant="h4"
              weight="light"
              className="text-[2.4rem] tracking-[-0.02em] uppercase"
            >
              {piece.name}
            </RichText>
            <RichText variant="p3" weight="light" className="flex-1 text-(--text-secondary)">
              {piece.text}
            </RichText>
            <a
              id={trackingId('ecosystem', 'link', piece.id)}
              href={piece.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-fit items-center gap-2 text-[1.3rem] font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus)"
            >
              {piece.linkLabel}
              <Icon name="arrow-forward" size="sm" />
            </a>
          </li>
        ))}
      </ol>
      <div className="grid gap-8 rounded-[1.8rem] border border-(--border-default) p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 md:p-12">
        <div className="flex flex-col gap-5">
          <RichText
            as="h3"
            variant="h3"
            weight="light"
            className="text-[2.8rem] leading-tight tracking-[-0.02em] uppercase"
          >
            {ai.title}
          </RichText>
          <RichText variant="p3" weight="light" className="text-(--text-secondary)">
            {ai.text}
          </RichText>
        </div>
        <ul className="flex flex-col">
          {ai.points.map((point) => (
            <li
              key={point}
              className="flex gap-4 border-b border-(--border-default) py-4 last:border-b-0"
            >
              <span aria-hidden className="mt-[1.1rem] h-px w-6 shrink-0 bg-(--text-primary)" />
              <RichText as="span" variant="p3" weight="light">
                {point}
              </RichText>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
