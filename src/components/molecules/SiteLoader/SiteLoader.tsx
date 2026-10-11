import { Loader } from '@inzumer/ui-library';
import { LoaderMark } from '@components/atoms/LoaderMark';

export interface SiteLoaderProps {
  /** What is loading, for screen readers. */
  label: string;
  /** Friendly questions that take turns under the mark. */
  messages: readonly string[];
}

/** Full-screen wait over the site's own background: a thin ring and the questions, thin type. */
export const SiteLoader = ({ label, messages }: SiteLoaderProps) => (
  // Above the dialogs too; the lib's dark blur gives way to the page color.
  <div className="relative z-[60] [&>div]:bg-(--surface-primary) [&>div]:backdrop-blur-none">
    <Loader
      screen
      label={label}
      messages={messages}
      mark={<LoaderMark />}
      size="lg"
      speed="slow"
      className="gap-8 [&_span]:text-[1.8rem] [&_span]:font-light [&_span]:tracking-[-0.01em] [&_span]:text-(--text-primary) [&_span]:drop-shadow-none [&>span:last-child]:max-w-[32rem]"
    />
  </div>
);
