import { canonicalPath, localizedPath, switchLocalePath } from '../routes';

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
});
