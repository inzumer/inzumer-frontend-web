interface AnalyticsWindow {
  dataLayer?: unknown[];
  /** Consent Mode calls, queued for Tag Manager. */
  gtag?: (...args: unknown[]) => void;
}

export const GTM_SRC = 'https://www.googletagmanager.com/gtm.js';

/** Our tracking ids: `<scope>-<kind>-<name>` with a clickable kind. */
const TRACKED_ID = /^([a-z0-9-]+?)-(button|link|switch)-([a-z0-9-]+)$/;

const analyticsWindow = (): AnalyticsWindow => window as unknown as AnalyticsWindow;

let allowed = false;

/** Loads Tag Manager once, after consent: analytics storage granted, every ad signal denied. */
export const loadTagManager = (containerId: string, doc: Document = document): void => {
  const win = analyticsWindow();
  allowed = true;

  if (win.gtag) {
    win.gtag('consent', 'update', { analytics_storage: 'granted' });

    return;
  }

  win.dataLayer = win.dataLayer ?? [];
  // Tag Manager reads Consent Mode calls as `arguments` objects, like gtag.js.
  win.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    win.dataLayer?.push(arguments);
  };
  win.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  win.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = doc.createElement('script');
  script.async = true;
  script.src = `${GTM_SRC}?id=${encodeURIComponent(containerId)}`;
  doc.head.append(script);
};

/** Consent withdrawn: GA4 tags stop storing and no more events are pushed. */
export const revokeAnalytics = (): void => {
  allowed = false;
  analyticsWindow().gtag?.('consent', 'update', { analytics_storage: 'denied' });
};

/** Pushes an event for Tag Manager, only while analytics is allowed. */
export const trackEvent = (name: string, params: Record<string, string | number> = {}): void => {
  if (allowed) {
    analyticsWindow().dataLayer?.push({ event: name, ...params });
  }
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
