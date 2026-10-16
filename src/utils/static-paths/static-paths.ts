import { LOCALES } from '@utils/locale';

/** `getStaticPaths` of a page that only varies by language. */
export const localePaths = () => LOCALES.map((lang) => ({ params: { lang } }));
