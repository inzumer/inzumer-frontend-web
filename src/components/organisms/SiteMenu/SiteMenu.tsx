import { useId, useState } from 'react';
import { Button, Drawer, Icon } from '@inzumer/ui-library';
import { trackingProps } from '@utils';

export interface SiteMenuLink {
  key: string;
  href: string;
  label: string;
}

export interface SiteMenuProps {
  links: SiteMenuLink[];
  /** The other language of the current page. */
  language: { href: string; label: string; lang: string };
  /** The PDF CV, downloaded with its file name. */
  cv: { href: string; label: string; fileName: string };
  labels: { open: string; close: string; title: string; navigation: string };
}

/** The same corner for the hamburger and the X, so one turns into the other. */
const cornerButtonClass =
  'top-[calc(2rem_+_env(safe-area-inset-top))] right-[calc(2rem_+_env(safe-area-inset-right))] z-40 size-11 rounded-full';

const linkClass =
  'group flex min-h-11 items-baseline gap-5 text-[clamp(3.2rem,7vw,6.4rem)] leading-[1.1] font-light tracking-[-0.035em] uppercase transition-colors hover:text-(--text-secondary) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--border-focus) motion-reduce:transition-none';

/** Hamburger fixed on the top end corner; opens the sections and the language over the whole screen. */
export const SiteMenu = ({ links, language, cv, labels }: SiteMenuProps) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const close = () => setOpen(false);

  return (
    <>
      <Button
        {...trackingProps('menu', 'button', 'open')}
        variant="ghost"
        size="icon"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className={`fixed ${cornerButtonClass}`}
      >
        <Icon name="menu" size="lg" />
      </Button>
      <Drawer
        id={panelId}
        open={open}
        onClose={close}
        title={labels.title}
        titleClassName="sr-only"
        size="full"
        className="px-[calc(2.4rem_+_env(safe-area-inset-left))] md:px-[12%]"
      >
        {/* The panel covers the screen, so this corner is the hamburger's. */}
        <Button
          {...trackingProps('menu', 'button', 'close')}
          variant="ghost"
          size="icon"
          aria-label={labels.close}
          onClick={close}
          className={`absolute ${cornerButtonClass}`}
        >
          <Icon name="close" size="lg" />
        </Button>
        <nav aria-label={labels.navigation} className="my-auto flex flex-col gap-1 py-8 md:gap-2">
          {links.map((link, index) => (
            <a
              key={link.key}
              {...trackingProps('menu', 'link', link.key)}
              href={link.href}
              onClick={close}
              className={linkClass}
            >
              <span
                aria-hidden
                className="w-8 shrink-0 text-[1.2rem] font-light tracking-[0.2em] text-(--text-tertiary)"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <a
            {...trackingProps('menu', 'link', 'language', language.lang)}
            href={language.href}
            hrefLang={language.lang}
            lang={language.lang}
            className="inline-flex min-h-11 w-fit items-center rounded-full border border-(--border-strong) px-5 text-[1.3rem] font-medium tracking-[0.14em]"
          >
            {language.label}
          </a>
          <a
            {...trackingProps('menu', 'link', 'cv')}
            href={cv.href}
            download={cv.fileName}
            className="inline-flex min-h-11 w-fit items-center rounded-full border border-(--border-strong) px-5 text-[1.3rem] font-medium"
          >
            {cv.label}
          </a>
        </div>
      </Drawer>
    </>
  );
};
