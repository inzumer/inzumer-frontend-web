import { BottomSheet, Icon, Modal, RichText, useMediaQuery } from '@inzumer/ui-library';
import {
  ProjectGallery,
  type GalleryImage,
  type ProjectGalleryProps,
} from '@components/molecules/ProjectGallery';
import { trackingId } from '@utils';

export interface ProjectDetail {
  slug: string;
  name: string;
  title: string;
  company: string;
  kind: string;
  stack: string[];
  /** Full page of the project, kept for search engines and sharing. */
  href: string;
  url?: string;
  urlLabel?: string;
  /** Body rendered from our own Markdown at build time. */
  html: string;
  /** The cover first, then the screens. */
  images: GalleryImage[];
}

export interface ProjectDialogLabels {
  close: string;
  stack: string;
  visit: string;
  page: string;
  gallery: ProjectGalleryProps['labels'];
}

export interface ProjectDialogProps {
  project: ProjectDetail | undefined;
  open: boolean;
  onClose: () => void;
  labels: ProjectDialogLabels;
}

const DESKTOP = '(min-width: 768px)';

const linkStyles =
  'inline-flex min-h-11 w-fit items-center gap-2 text-[1.4rem] font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus)';

/** The whole project in a layer: a Modal on desktop, a BottomSheet on phones. */
export const ProjectDialog = ({ project, open, onClose, labels }: ProjectDialogProps) => {
  const desktop = useMediaQuery(DESKTOP);

  if (!project) {
    return null;
  }

  // The header stays put and only the body scrolls, so the bar never reaches the rounded corners.
  const content = (
    <div className="flex min-h-0 flex-1 flex-col">
      <button
        id={trackingId('project-dialog', 'button', 'close', project.slug)}
        type="button"
        aria-label={labels.close}
        onClick={onClose}
        className="absolute top-[1.6rem] right-[1.6rem] z-10 flex size-11 items-center justify-center rounded-full border border-(--border-strong) bg-(--surface-primary) transition-colors hover:bg-(--btn-ghost-bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus) motion-reduce:transition-none"
      >
        <Icon name="close" size="sm" />
      </button>
      <div className="shrink-0 px-6 pr-20 pb-6 md:px-10 md:pt-10 md:pr-24">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[1.2rem] font-light tracking-[0.2em] text-(--text-tertiary) uppercase">
            <span>{project.kind}</span>
            <span className="text-(--text-primary)">{project.company}</span>
          </div>
          <RichText
            as="h2"
            variant="h2"
            weight="light"
            className="text-[clamp(3.2rem,5vw,4.8rem)] leading-[1] tracking-[-0.035em] uppercase"
          >
            {project.name}
          </RichText>
        </div>
      </div>
      <div className="dialog-scroll flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto overscroll-contain px-6 pb-[calc(2.4rem_+_env(safe-area-inset-bottom))] md:mb-[2.4rem] md:px-10 md:pb-6">
        {/* Width tied to the screen height, so a whole 16:10 screen fits without cropping. */}
        <div className="w-full md:max-w-[calc(50dvh*1.6)]">
          <ProjectGallery slug={project.slug} images={project.images} labels={labels.gallery} />
        </div>
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-12">
          <div className="flex flex-col gap-6">
            <RichText
              as="h3"
              variant="h3"
              weight="light"
              className="text-[2.4rem] leading-tight tracking-[-0.02em]"
            >
              {project.title}
            </RichText>
            {/* eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- our own Markdown, rendered by Astro at build time */}
            <div className="project-prose" dangerouslySetInnerHTML={{ __html: project.html }} />
          </div>
          <div className="flex flex-col gap-6 md:border-l md:border-(--border-default) md:pl-10">
            <RichText
              as="h3"
              variant="s4"
              className="tracking-[0.2em] text-(--text-tertiary) uppercase"
            >
              {labels.stack}
            </RichText>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-(--border-strong) px-4 py-1.5 text-[1.2rem]"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-1 border-t border-(--border-default) pt-5">
              {project.url && (
                <a
                  id={trackingId('project-dialog', 'link', 'visit', project.slug)}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkStyles}
                >
                  {labels.visit} {project.urlLabel ?? project.url}
                  <Icon name="arrow-forward" size="sm" />
                </a>
              )}
              <a
                id={trackingId('project-dialog', 'link', 'page', project.slug)}
                href={project.href}
                className={linkStyles}
              >
                {labels.page}
                <Icon name="arrow-forward" size="sm" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return desktop ? (
    <Modal
      open={open}
      onClose={onClose}
      maxHeight="tall"
      aria-label={project.name}
      // The lib's body becomes a plain column; our body scrolls on the panel's edge.
      className="relative max-w-[1080px] overflow-hidden rounded-[2.4rem] bg-(--surface-primary) p-0 shadow-none [&>div]:m-0 [&>div]:flex [&>div]:flex-col [&>div]:overflow-hidden [&>div]:p-0"
    >
      {content}
    </Modal>
  ) : (
    <BottomSheet
      open={open}
      onClose={onClose}
      aria-label={project.name}
      // At most 80% of the screen; only our body scrolls, below the handle and the title.
      className="relative flex max-h-[80dvh] flex-col overflow-hidden rounded-t-[2.4rem] bg-(--surface-primary) px-0 pb-0 shadow-none"
    >
      {content}
    </BottomSheet>
  );
};
