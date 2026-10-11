import {
  canonicalPath,
  isActivePath,
  localizedPath,
  stripBase,
  switchLocalePath,
  withBase,
} from '../routes';

describe('routes', () => {
  it('should turn built file paths into the clean public path', () => {
    expect(canonicalPath('/es/projects/belo.html')).toBe('/es/projects/belo');
    expect(canonicalPath('/es/index.html')).toBe('/es');
    expect(canonicalPath('/en/projects')).toBe('/en/projects');
    expect(canonicalPath('/index.html')).toBe('/');
  });

  it('should build localized paths with English slugs', () => {
    expect(localizedPath('es', 'home')).toBe('/es');
    expect(localizedPath('en', 'projects', 'belo')).toBe('/en/projects/belo');
  });

  it.each([
    ['/es/projects/belo', 'en', '/en/projects/belo'],
    ['/en/projects/', 'es', '/es/projects'],
    ['/es', 'en', '/en'],
    ['/', 'en', '/en'],
    ['/projects', 'es', '/es/projects'],
  ] as const)('should switch %s to %s → %s', (pathname, lang, expected) => {
    expect(switchLocalePath(pathname, lang)).toBe(expected);
  });

  it('should mark the locale root as active only on exact match', () => {
    expect(isActivePath('/es', '/es')).toBe(true);
    expect(isActivePath('/es/', '/es')).toBe(true);
    expect(isActivePath('/es/projects', '/es')).toBe(false);
  });

  it('should mark sections as active for nested pages', () => {
    expect(isActivePath('/es/projects/belo', '/es/projects')).toBe(true);
    expect(isActivePath('/es/projects-old', '/es/projects')).toBe(false);
    expect(isActivePath('/', '/es/projects')).toBe(false);
  });

  describe('under a base path', () => {
    const BASE = '/site';

    it('should add and remove the base', () => {
      expect(withBase('/og.png', BASE)).toBe('/site/og.png');
      expect(withBase('favicon.ico', BASE)).toBe('/site/favicon.ico');
      expect(withBase('/es', '')).toBe('/es');
      expect(stripBase('/site/es/projects', BASE)).toBe('/es/projects');
      expect(stripBase('/site', BASE)).toBe('/');
      expect(stripBase('/site-old/es', BASE)).toBe('/site-old/es');
    });

    it('should switch languages keeping the base', () => {
      expect(switchLocalePath('/site/es/projects/belo', 'en', BASE)).toBe('/site/en/projects/belo');
    });
  });
});
