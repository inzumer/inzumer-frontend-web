type Gtag = (...args: unknown[]) => void;

interface AnalyticsWindow extends Window {
  dataLayer?: unknown[];
  gtag?: Gtag;
  [key: `ga-disable-${string}`]: boolean | undefined;
}

export const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js';

/** Our tracking ids: `<scope>-<kind>-<name>` with a clickable kind. */
const TRACKED_ID = /^([a-z0-9-]+?)-(button|link|switch)-([a-z0-9-]+)$/;

const analyticsWindow = (): AnalyticsWindow => window as unknown as AnalyticsWindow;

/** Loads gtag.js once, after consent; anonymous IPs and no ad signals. */
export const loadAnalytics = (measurementId: string, doc: Document = document): void => {
  const win = analyticsWindow();
  win[`ga-disable-${measurementId}`] = false;

  if (win.gtag) {
    return;
  }

  win.dataLayer = win.dataLayer ?? [];
  // gtag.js reads the `arguments` object, not an array.
  win.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    win.dataLayer?.push(arguments);
  };
  win.gtag('js', new Date());
  win.gtag('config', measurementId, { allow_google_signals: false });

  const script = doc.createElement('script');
  script.async = true;
  script.src = `${GTAG_SRC}?id=${encodeURIComponent(measurementId)}`;
  doc.head.append(script);
};

/** Stops sending after consent is withdrawn; the cookies go away with the next visit. */
export const disableAnalytics = (measurementId: string): void => {
  analyticsWindow()[`ga-disable-${measurementId}`] = true;
};

/** Sends an event when GA is loaded; otherwise does nothing. */
export const trackEvent = (name: string, params: Record<string, string | number> = {}): void => {
  analyticsWindow().gtag?.('event', name, params);
};

/** `ui_click` for every element with a tracking id, read from the id itself. */
export const trackClicks = (doc: Document = document): (() => void) => {
  const onClick = (event: MouseEvent) => {
    const element = (event.target as Element | null)?.closest?.('[id]');
    const match = element?.id.match(TRACKED_ID);

    if (!element || !match) {
      return;
    }

    const [, scope = '', kind = '', name = ''] = match;
    trackEvent('ui_click', { element_id: element.id, scope, kind, name });
  };

  doc.addEventListener('click', onClick, { capture: true });

  return () => doc.removeEventListener('click', onClick, { capture: true });
};
