import { disableAnalytics, GTAG_SRC, loadAnalytics, trackClicks, trackEvent } from '../analytics';

type TestWindow = Window & { dataLayer?: unknown[]; gtag?: unknown } & Record<string, unknown>;

const win = () => window as unknown as TestWindow;

describe('analytics', () => {
  afterEach(() => {
    delete win().gtag;
    delete win().dataLayer;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('should load gtag once, without ad signals', () => {
    loadAnalytics('G-TEST');
    loadAnalytics('G-TEST');

    const scripts = document.head.querySelectorAll(`script[src^="${GTAG_SRC}"]`);

    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toHaveAttribute('src', `${GTAG_SRC}?id=G-TEST`);
    expect(Array.from(win().dataLayer?.[1] as ArrayLike<unknown>)).toStrictEqual([
      'config',
      'G-TEST',
      { allow_google_signals: false },
    ]);
  });

  it('should stop and resume sending with the consent', () => {
    loadAnalytics('G-TEST');
    disableAnalytics('G-TEST');
    expect(win()['ga-disable-G-TEST']).toBe(true);

    loadAnalytics('G-TEST');
    expect(win()['ga-disable-G-TEST']).toBe(false);
  });

  it('should do nothing while GA is not loaded', () => {
    expect(() => trackEvent('generate_lead')).not.toThrow();
  });

  it('should send ui_click with the parts of each tracking id', () => {
    const gtag = vi.fn();
    win().gtag = gtag;
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

    expect(gtag.mock.calls).toStrictEqual([
      [
        'event',
        'ui_click',
        {
          element_id: 'project-dialog-link-page-belo',
          scope: 'project-dialog',
          kind: 'link',
          name: 'page-belo',
        },
      ],
      [
        'event',
        'ui_click',
        { element_id: 'cookies-button-accept', scope: 'cookies', kind: 'button', name: 'accept' },
      ],
    ]);
  });
});
