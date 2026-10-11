import { BottomSheet, Icon, Modal, RichText, useMediaQuery } from '@inzumer/ui-library';
import {
  ProjectGallery,
  type GalleryImage,
  type ProjectGalleryProps,
} from '@components/molecules/ProjectGallery';
import { trackingId, trackingProps } from '@utils';

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

/** Our surface and a thin, uppercase title on the lib's dialogs. */
const panelStyles =
  'bg-(--surface-primary) shadow-none [&>h2]:mb-6 [&>h2]:text-[clamp(3.2rem,5vw,4.8rem)] [&>h2]:leading-none [&>h2]:font-light [&>h2]:tracking-[-0.035em] [&>h2]:uppercase';

const linkStyles =
  'inline-flex min-h-11 w-fit items-center gap-2 text-[1.4rem] font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus)';

/** The whole project in a layer: a Modal on desktop, a BottomSheet on phones. */
export const ProjectDialog = ({ project, open, onClose, labels }: ProjectDialogProps) => {
  const desktop = useMediaQuery(DESKTOP);

  if (!project) {
    return null;
  }

  // The lib's X renders it as id and data-testid.
  const closeId = trackingId('project-dialog', 'button', 'close', project.slug);

  // The lib keeps this title and the X in place and scrolls the body on the panel's edge.
  const title = (
    <>
      <span className="mb-3 flex flex-wrap gap-x-6 gap-y-1 text-[1.2rem] font-light tracking-[0.2em] text-(--text-tertiary) normal-case">
        <span className="uppercase">{project.kind}</span>
        <span className="text-(--text-primary) uppercase">{project.company}</span>
      </span>
      {project.name}
    </>
  );

  const content = (
    <div className="flex flex-col gap-8 pb-[env(safe-area-inset-bottom)]">
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
                {...trackingProps('project-dialog', 'link', 'visit', project.slug)}
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
              {...trackingProps('project-dialog', 'link', 'page', project.slug)}
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
  );

  return desktop ? (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      closeLabel={labels.close}
      closeId={closeId}
      maxHeight="tall"
      className={`max-w-[1080px] rounded-[2.4rem] ${panelStyles}`}
    >
      {content}
    </Modal>
  ) : (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      closeLabel={labels.close}
      closeId={closeId}
      className={`rounded-t-[2.4rem] ${panelStyles}`}
    >
      {content}
    </BottomSheet>
  );
};
