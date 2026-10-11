import { GTM_SRC, loadTagManager, revokeAnalytics, trackClicks, trackEvent } from '../analytics';

type TestWindow = { dataLayer?: unknown[]; gtag?: unknown };

const win = () => window as unknown as TestWindow;

/** Plain objects pushed to the data layer (events), without the Consent Mode calls. */
const events = () =>
  (win().dataLayer ?? []).filter(
    (entry) => !(entry && typeof entry === 'object' && 'length' in entry),
  );

describe('analytics', () => {
  afterEach(() => {
    revokeAnalytics();
    delete win().gtag;
    delete win().dataLayer;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('should load Tag Manager once, with ad signals denied', () => {
    loadTagManager('GTM-TEST');
    loadTagManager('GTM-TEST');

    const scripts = document.head.querySelectorAll(`script[src^="${GTM_SRC}"]`);
    const [consent] = win().dataLayer ?? [];

    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toHaveAttribute('src', `${GTM_SRC}?id=GTM-TEST`);
    expect(Array.from(consent as ArrayLike<unknown>)).toStrictEqual([
      'consent',
      'default',
      {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ]);
    expect(events()[0]).toMatchObject({ event: 'gtm.js' });
  });

  it('should deny storage and stop events when consent is withdrawn', () => {
    loadTagManager('GTM-TEST');
    revokeAnalytics();
    trackEvent('generate_lead', { form: 'contact' });

    const last = win().dataLayer?.at(-1) as ArrayLike<unknown>;

    expect(Array.from(last)).toStrictEqual(['consent', 'update', { analytics_storage: 'denied' }]);
    expect(events()).not.toContainEqual(expect.objectContaining({ event: 'generate_lead' }));

    loadTagManager('GTM-TEST');
    trackEvent('generate_lead', { form: 'contact' });
    expect(events()).toContainEqual({ event: 'generate_lead', form: 'contact' });
  });

  it('should do nothing before consent', () => {
    trackEvent('generate_lead');

    expect(win().dataLayer).toBeUndefined();
  });

  it('should push ui_click with the parts of each tracking id', () => {
    loadTagManager('GTM-TEST');
    document.body.innerHTML = `
      <a id="project-dialog-link-page-belo" href="#"><span>Page</span></a>
      <button id="cookies-button-accept">Accept</button>
      <div id="projects">Not tracked</div>`;
    const stop = trackClicks();

    document.querySelector('span')?.click();
    document.getElementById('cookies-button-accept')?.click();
    document.getElementById('projects')?.click();
    stop();
    document.getElementById('cookies-button-accept')?.click();

    expect(
      events().filter((entry) => (entry as { event: string }).event === 'ui_click'),
    ).toStrictEqual([
      {
        event: 'ui_click',
        element_id: 'project-dialog-link-page-belo',
        scope: 'project-dialog',
        kind: 'link',
        name: 'page-belo',
      },
      {
        event: 'ui_click',
        element_id: 'cookies-button-accept',
        scope: 'cookies',
        kind: 'button',
        name: 'accept',
      },
    ]);
  });
});
