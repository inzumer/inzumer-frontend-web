import { useEffect, useState } from 'react';
import { SiteLoader, type SiteLoaderProps } from '@components/molecules/SiteLoader';

/** Waits this long before showing up, so fast pages never flash it. */
export const PAGE_LOADER_DELAY_MS = 300;

/** Whether a click on this link leaves for another page of the site in the same tab. */
export const leavesForPage = (event: MouseEvent, link: HTMLAnchorElement): boolean => {
  const url = new URL(link.href, window.location.href);
  const samePage =
    url.pathname === window.location.pathname && url.search === window.location.search;

  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !link.target &&
    !link.hasAttribute('download') &&
    url.origin === window.location.origin &&
    !samePage
  );
};

/** The loader while the next page of the site loads; hidden again when the browser comes back. */
export const PageLoader = (props: SiteLoaderProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href]');

      if (
        !(link instanceof HTMLAnchorElement) ||
        event.defaultPrevented ||
        !leavesForPage(event, link)
      ) {
        return;
      }

      timer = setTimeout(() => setLoading(true), PAGE_LOADER_DELAY_MS);
    };

    // Back/forward cache: the page returns as it was left, loader included.
    const onPageShow = () => {
      clearTimeout(timer);
      setLoading(false);
    };

    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', onClick);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return loading ? <SiteLoader {...props} /> : null;
};
