import type { ReactNode } from 'react';
import { RichText } from '@inzumer/ui-library';

export interface SectionHeaderProps {
  id: string;
  title: string;
  /** Controls on the end side, such as carousel arrows. */
  actions?: ReactNode;
}

/** Section title: large, uppercase and thin, with optional actions on the end side. */
export const SectionHeader = ({ id, title, actions }: SectionHeaderProps) => (
  <div className="flex flex-wrap items-end justify-between gap-6">
    <RichText
      as="h2"
      id={id}
      variant="h2"
      weight="light"
      className="max-w-[16ch] text-[4rem] leading-[1.05] tracking-[-0.035em] uppercase md:text-[6.4rem]"
    >
      {title}
    </RichText>
    {actions}
  </div>
);
