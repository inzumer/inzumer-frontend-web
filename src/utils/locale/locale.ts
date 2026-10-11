export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/** English first: the portfolio speaks to international teams. */
export const DEFAULT_LOCALE: Locale = 'en';

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

export const toLocale = (value: unknown): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

/** The language of the current page (`<html lang>`), for UI shown after someone acts; English on the server. */
export const pageLocale = (): Locale =>
  toLocale(typeof document === 'undefined' ? undefined : document.documentElement.lang);
