import type { Locale } from '@utils/locale';
import commonEn from './common/en.json';
import commonEs from './common/es.json';
import contactEmailEn from './contact-email/en.json';
import contactEmailEs from './contact-email/es.json';
import homeEn from './home/en.json';
import homeEs from './home/es.json';
import notFoundEn from './not-found/en.json';
import notFoundEs from './not-found/es.json';
import profileEn from './profile/en.json';
import profileEs from './profile/es.json';
import projectPageEn from './project-page/en.json';
import projectPageEs from './project-page/es.json';

/** `src/i18n/<folder>/{es,en}.json`; English is the source and Spanish must match its shape. */
const dictionaries = {
  common: { en: commonEn, es: commonEs satisfies typeof commonEn },
  'contact-email': { en: contactEmailEn, es: contactEmailEs satisfies typeof contactEmailEn },
  home: { en: homeEn, es: homeEs satisfies typeof homeEn },
  'not-found': { en: notFoundEn, es: notFoundEs satisfies typeof notFoundEn },
  profile: { en: profileEn, es: profileEs satisfies typeof profileEn },
  'project-page': { en: projectPageEn, es: projectPageEs satisfies typeof projectPageEn },
} as const;

export type Namespace = keyof typeof dictionaries;

export type Translations<N extends Namespace> = (typeof dictionaries)[N]['en'];

export const getTranslations = <N extends Namespace>(lang: Locale, namespace: N): Translations<N> =>
  dictionaries[namespace][lang];
