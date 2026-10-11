import { useId } from 'react';
import { RichText } from '@inzumer/ui-library';
import { SectionHeader } from '@components/molecules/SectionHeader';

export interface ExperienceItem {
  company: string;
  client?: string;
  role: string;
  dates: string;
  location: string;
  highlights: string[];
}

export interface ExperienceListProps {
  title: string;
  items: ExperienceItem[];
}

/** Roles as bordered cards, newest first: company (and client), role, dates and highlights. */
export const ExperienceList = ({ title, items }: ExperienceListProps) => {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-12">
      <SectionHeader id={titleId} title={title} />
      <ol className="grid gap-7 md:grid-cols-2">
        {items.map((item) => (
          <li
            key={`${item.company}-${item.role}`}
            className="flex flex-col gap-4 rounded-[1.8rem] border border-(--border-default) p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <RichText as="h3" variant="h5" className="font-normal">
                {item.client ? `${item.company} · ${item.client}` : item.company}
              </RichText>
              <RichText as="span" variant="s4" weight="light" className="text-(--text-tertiary)">
                {item.dates}
              </RichText>
            </div>
            <RichText variant="p3" className="text-(--text-secondary)">
              {item.role} · {item.location}
            </RichText>
            <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-(--text-tertiary)">
              {item.highlights.map((highlight) => (
                <li key={highlight}>
                  <RichText
                    as="span"
                    variant="p3"
                    weight="light"
                    className="text-(--text-secondary)"
                  >
                    {highlight}
                  </RichText>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
};
