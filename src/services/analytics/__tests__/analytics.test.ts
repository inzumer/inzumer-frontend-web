import { GTM_SRC, loadTagManager, revokeAnalytics } from '../analytics';

type TestWindow = { dataLayer?: unknown[]; gtag?: unknown };

const win = () => window as unknown as TestWindow;

/** Consent Mode calls are `arguments` objects; events are plain objects. */
const asArray = (entry: unknown) => Array.from(entry as ArrayLike<unknown>);

describe('analytics', () => {
  afterEach(() => {
    delete win().gtag;
    delete win().dataLayer;
    document.head.innerHTML = '';
  });

  it('should load Tag Manager once, with ad signals denied', () => {
    loadTagManager('GTM-TEST');
    loadTagManager('GTM-TEST');

    const scripts = document.head.querySelectorAll(`script[src^="${GTM_SRC}"]`);
    const [consent, start] = win().dataLayer ?? [];

    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toHaveAttribute('src', `${GTM_SRC}?id=GTM-TEST`);
    expect(asArray(consent)).toStrictEqual([
      'consent',
      'default',
      {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ]);
    expect(start).toMatchObject({ event: 'gtm.js' });
    expect(asArray(win().dataLayer?.at(-1))).toStrictEqual([
      'consent',
      'update',
      { analytics_storage: 'granted' },
    ]);
  });

  it('should deny analytics storage when consent is withdrawn', () => {
    loadTagManager('GTM-TEST');
    revokeAnalytics();

    expect(asArray(win().dataLayer?.at(-1))).toStrictEqual([
      'consent',
      'update',
      { analytics_storage: 'denied' },
    ]);
  });

  it('should do nothing on withdrawal before Tag Manager loads', () => {
    revokeAnalytics();

    expect(win().dataLayer).toBeUndefined();
  });
});
