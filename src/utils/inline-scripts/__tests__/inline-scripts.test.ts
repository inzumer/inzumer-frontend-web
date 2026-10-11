import { languageRedirectScript, notFoundLanguageScript, themeScript } from '../inline-scripts';

const run = (script: string) => new Function(script)();

describe('inline scripts', () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['colorScheme'];
    vi.unstubAllGlobals();
  });

  it('should apply the saved color scheme, or follow the OS', () => {
    const listeners: (() => void)[] = [];
    let dark = true;
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return dark;
      },
      addEventListener: (_event: string, listener: () => void) => listeners.push(listener),
    }));

    run(themeScript('inzumer:settings'));
    expect(document.documentElement.dataset['colorScheme']).toBe('dark');
    dark = false;
    listeners.forEach((listener) => listener());
    expect(document.documentElement.dataset['colorScheme']).toBe('light');

    localStorage.setItem('inzumer:settings', JSON.stringify({ colorScheme: 'dark' }));
    run(themeScript('inzumer:settings'));
    expect(document.documentElement.dataset['colorScheme']).toBe('dark');
    listeners.forEach((listener) => listener());
    expect(document.documentElement.dataset['colorScheme']).toBe('dark');

    localStorage.setItem('inzumer:settings', '{broken');
    run(themeScript('inzumer:settings'));
    expect(document.documentElement.dataset['colorScheme']).toBe('light');
  });

  it('should use the site default before the OS when there is no saved choice', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn() }));

    run(themeScript('inzumer:settings', 'dark'));
    expect(document.documentElement.dataset['colorScheme']).toBe('dark');

    localStorage.setItem('inzumer:settings', JSON.stringify({ colorScheme: 'light' }));
    run(themeScript('inzumer:settings', 'dark'));
    expect(document.documentElement.dataset['colorScheme']).toBe('light');
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('should redirect to the saved language, then the browser language, under the base', () => {
    const replace = vi.fn();
    vi.stubGlobal('location', { replace });
    const options = {
      storageKey: 'inzumer:settings',
      locales: ['es', 'en'],
      fallbackLocale: 'es',
      base: '/site',
    };

    localStorage.setItem('inzumer:settings', JSON.stringify({ locale: 'en' }));
    run(languageRedirectScript(options));
    expect(replace).toHaveBeenLastCalledWith('/site/en');

    localStorage.clear();
    vi.stubGlobal('navigator', { languages: ['fr-FR', 'en-US'], language: 'fr' });
    run(languageRedirectScript({ ...options, base: '' }));
    expect(replace).toHaveBeenLastCalledWith('/en');

    vi.stubGlobal('navigator', { languages: [], language: 'de' });
    localStorage.setItem('inzumer:settings', '{broken');
    run(languageRedirectScript(options));
    expect(replace).toHaveBeenLastCalledWith('/site/es');
  });

  it('should show the 404 message in the language of the requested URL, under the base', () => {
    document.body.innerHTML =
      '<section data-not-found="es"></section><section data-not-found="en" hidden></section>';
    const [es, en] = document.querySelectorAll<HTMLElement>('[data-not-found]');
    const script = notFoundLanguageScript({ locales: ['es', 'en'], base: '/site' });

    window.history.replaceState(null, '', '/site/en/missing');
    run(script);
    expect(document.documentElement.lang).toBe('en');
    expect([es?.hidden, en?.hidden]).toStrictEqual([true, false]);

    window.history.replaceState(null, '', '/site/unknown');
    document.documentElement.lang = 'es';
    run(script);
    expect(document.documentElement.lang).toBe('es');
    window.history.replaceState(null, '', '/');
    document.body.innerHTML = '';
  });
});
