interface AnalyticsWindow {
  dataLayer?: unknown[];
  /** Consent Mode calls, queued for Tag Manager. */
  gtag?: (...args: unknown[]) => void;
}

export const GTM_SRC = 'https://www.googletagmanager.com/gtm.js';

const analyticsWindow = (): AnalyticsWindow => window as unknown as AnalyticsWindow;

/** Loads Tag Manager once, after consent: analytics storage granted, every ad signal denied. */
export const loadTagManager = (containerId: string, doc: Document = document): void => {
  const win = analyticsWindow();

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

/** Consent withdrawn: the GA4 tags in Tag Manager stop storing. */
export const revokeAnalytics = (): void => {
  analyticsWindow().gtag?.('consent', 'update', { analytics_storage: 'denied' });
};
