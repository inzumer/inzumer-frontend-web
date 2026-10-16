import { RichText } from '@inzumer/ui-library';

export interface SectionHeaderProps {
  id: string;
  title: string;
}

/** Section title: large, uppercase and thin. */
export const SectionHeader = ({ id, title }: SectionHeaderProps) => (
  <RichText
    as="h2"
    id={id}
    variant="h2"
    weight="light"
    className="max-w-[16ch] text-[4rem] leading-[1.05] tracking-[-0.035em] uppercase md:text-[6.4rem]"
  >
    {title}
  </RichText>
);
