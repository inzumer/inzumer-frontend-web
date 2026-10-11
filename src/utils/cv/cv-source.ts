import { SITE_AUTHOR, SITE_URL, SOCIAL_LINKS } from '@constants';
import { getTranslations } from '@i18n';
import type { Locale } from '@utils/locale';
import type { CvContact } from './cv';

export const CV_CONTACT: CvContact = {
  email: SITE_AUTHOR.email,
  site: SITE_URL,
  linkedin: SOCIAL_LINKS.linkedin,
  github: SOCIAL_LINKS.github,
  countryCode: SITE_AUTHOR.countryCode,
};

/** Everything a CV format needs in one language: the profile, the headings and the contact. */
export const cvSource = (lang: Locale) => {
  const cv = getTranslations(lang, 'cv');

  return {
    profile: getTranslations(lang, 'profile'),
    headings: cv.headings,
    title: cv.title,
    fileName: cv.fileName,
    contact: CV_CONTACT,
  };
};
