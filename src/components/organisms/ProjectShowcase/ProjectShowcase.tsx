import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Icon, RichText } from '@inzumer/ui-library';
import { CarouselArrows } from '@components/molecules/CarouselArrows';
import { SectionHeader } from '@components/molecules/SectionHeader';
import {
  ProjectDialog,
  type ProjectDetail,
  type ProjectDialogLabels,
} from '@components/organisms/ProjectDialog';
import { trackingId } from '@utils';

export interface ShowcaseProject extends ProjectDetail {
  summary: string;
  cover: { src: string; width: number; height: number; alt: string };
}

export interface ProjectShowcaseProps {
  title: string;
  projects: ShowcaseProject[];
  labels: {
    list: string;
    view: string;
    previous: string;
    next: string;
    dialog: ProjectDialogLabels;
  };
}

const KEY_STEPS: Record<string, (index: number, total: number) => number> = {
  ArrowDown: (index, total) => (index + 1) % total,
  ArrowRight: (index, total) => (index + 1) % total,
  ArrowUp: (index, total) => (index - 1 + total) % total,
  ArrowLeft: (index, total) => (index - 1 + total) % total,
  Home: () => 0,
  End: (_, total) => total - 1,
};

/** Projects as tabs: the list, the grayscale cover and the copy; "View project" opens it all in a dialog. */
export const ProjectShowcase = ({ title, projects, labels }: ProjectShowcaseProps) => {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const panelId = `${baseId}-panel`;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const total = projects.length;
  const project = projects[active];
  const tabId = (index: number) =>
    trackingId('projects', 'button', 'tab', projects[index]?.slug ?? index);

  if (!project) {
    return null;
  }

  const select = (index: number, focus = false) => {
    setActive(index);

    if (focus) {
      tabsRef.current[index]?.focus();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = KEY_STEPS[event.key];

    if (!step) {
      return;
    }

    event.preventDefault();
    select(step(active, total), true);
  };

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-12">
      <SectionHeader
        id={titleId}
        title={title}
        actions={
          <CarouselArrows
            scope="projects"
            labels={{ previous: labels.previous, next: labels.next }}
            controls={panelId}
            onPrevious={() => select((active - 1 + total) % total)}
            onNext={() => select((active + 1) % total)}
          />
        }
      />
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div
          role="tablist"
          aria-label={labels.list}
          aria-orientation="vertical"
          className="flex [scrollbar-width:none] gap-2 overflow-x-auto lg:flex-col lg:gap-1"
        >
          {projects.map((item, index) => {
            const selected = index === active;

            return (
              <button
                key={item.slug}
                ref={(element) => {
                  tabsRef.current[index] = element;
                }}
                id={tabId(index)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={onKeyDown}
                className={`flex min-h-11 shrink-0 items-center rounded-md px-1 text-left text-[1.4rem] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus) motion-reduce:transition-none ${
                  selected
                    ? 'gap-3 font-normal text-(--text-primary)'
                    : 'font-light text-(--text-tertiary) hover:text-(--text-secondary)'
                }`}
              >
                <span
                  aria-hidden
                  className={`h-px bg-current transition-all motion-reduce:transition-none ${selected ? 'w-6' : 'w-0'}`}
                />
                {item.name}
              </button>
            );
          })}
        </div>
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(active)}
          className="grid gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-center md:gap-12"
        >
          <div className="overflow-hidden rounded-[1.8rem] border border-(--border-default)">
            <img
              key={project.slug}
              src={project.cover.src}
              width={project.cover.width}
              height={project.cover.height}
              alt={project.cover.alt}
              loading={active === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="aspect-[4/3] w-full object-cover contrast-[1.05] grayscale-[1]"
            />
          </div>
          <div className="flex flex-col gap-5">
            <RichText
              as="h3"
              variant="h3"
              weight="light"
              className="text-[2.8rem] leading-tight tracking-[-0.02em]"
            >
              {project.title}
            </RichText>
            <RichText variant="p3" weight="light" className="text-(--text-secondary)">
              {project.summary}
            </RichText>
            <ul className="flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-(--border-strong) px-4 py-1.5 text-[1.2rem]"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <button
              id={trackingId('projects', 'button', 'view', project.slug)}
              type="button"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
              className="inline-flex min-h-11 w-fit items-center gap-2 text-[1.4rem] font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus)"
            >
              {labels.view}
              <Icon name="arrow-forward" size="sm" />
            </button>
            <div className="flex justify-between gap-4 border-t border-(--border-default) pt-5 text-[1.2rem] font-light text-(--text-tertiary)">
              <span>{project.kind}</span>
              <span className="font-medium text-(--text-primary)">{project.company}</span>
            </div>
          </div>
        </div>
      </div>
      <ProjectDialog
        project={project}
        open={open}
        onClose={() => setOpen(false)}
        labels={labels.dialog}
      />
    </section>
  );
};
