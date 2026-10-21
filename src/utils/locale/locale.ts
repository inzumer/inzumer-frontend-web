export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/** English first: the portfolio speaks to international teams. */
export const DEFAULT_LOCALE: Locale = 'en';

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
