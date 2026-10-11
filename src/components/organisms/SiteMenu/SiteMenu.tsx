import { useId, useState } from 'react';
import { Button, Drawer, Icon } from '@inzumer/ui-library';
import { trackingId } from '@utils';

export interface SiteMenuLink {
  key: string;
  href: string;
  label: string;
}

export interface SiteMenuProps {
  links: SiteMenuLink[];
  /** The other language of the current page. */
  language: { href: string; label: string; lang: string };
  labels: { open: string; close: string; title: string; navigation: string };
}

const linkClass =
  'flex min-h-11 items-center text-[2.4rem] font-light tracking-[-0.02em] uppercase underline-offset-8 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--border-focus)';

/** Hamburger fixed on the top end corner; opens a side drawer with the sections and the language. */
export const SiteMenu = ({ links, language, labels }: SiteMenuProps) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const close = () => setOpen(false);

  return (
    <>
      <Button
        id={trackingId('menu', 'button', 'open')}
        variant="ghost"
        size="icon"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className="fixed top-[calc(2rem_+_env(safe-area-inset-top))] right-[calc(2rem_+_env(safe-area-inset-right))] z-40 size-11 rounded-full"
      >
        <Icon name="menu" size="lg" />
      </Button>
      <Drawer
        id={panelId}
        open={open}
        onClose={close}
        title={labels.title}
        titleClassName="sr-only"
        closeLabel={labels.close}
      >
        <nav aria-label={labels.navigation} className="flex flex-col gap-2 pt-8">
          {links.map((link) => (
            <a
              key={link.key}
              id={trackingId('menu', 'link', link.key)}
              href={link.href}
              onClick={close}
              className={linkClass}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          id={trackingId('menu', 'link', 'language', language.lang)}
          href={language.href}
          hrefLang={language.lang}
          lang={language.lang}
          className="mt-auto inline-flex min-h-11 w-fit items-center rounded-full border border-(--border-strong) px-5 text-[1.3rem] font-medium tracking-[0.14em]"
        >
          {language.label}
        </a>
      </Drawer>
    </>
  );
};
