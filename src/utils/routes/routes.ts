import { isLocale, type Locale } from '@utils/locale';

/** Route slugs are always English and identical in every locale. */
const ROUTES = {
  home: '',
  projects: 'projects',
  privacy: 'privacy',
} as const;

export type RouteName = keyof typeof ROUTES;

const join = (...parts: string[]): string =>
  `/${parts.filter((part) => part.length > 0).join('/')}`;

/** Clean public path of a built page: `/es/projects/belo.html` → `/es/projects/belo`. */
export const canonicalPath = (pathname: string): string =>
  pathname.replace(/\.html$/, '').replace(/\/index$/, '') || '/';

/** Builds `/{lang}/{route}[/...rest]`. */
export const localizedPath = (lang: Locale, route: RouteName, ...rest: string[]): string =>
  join(lang, ROUTES[route], ...rest);

/** Swaps the locale prefix of a pathname, keeping the rest of the route. */
export const switchLocalePath = (pathname: string, lang: Locale): string => {
  const segments = pathname.split('/').filter((segment) => segment.length > 0);
  const rest = isLocale(segments[0]) ? segments.slice(1) : segments;

  return join(lang, ...rest);
};
