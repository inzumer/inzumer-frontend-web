/** GA4 measurement id from Vercel (`PUBLIC_GA_ID`); without it nothing loads. */
export const GA_MEASUREMENT_ID: string | undefined = import.meta.env.PUBLIC_GA_ID || undefined;

/** Cookie categories; only `analytics` is optional. */
export const CONSENT_CATEGORIES = { necessary: 'necessary', analytics: 'analytics' } as const;
