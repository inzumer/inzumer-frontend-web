import { SITE_AUTHOR, SOCIAL_LINKS } from '@constants';

/** schema.org JSON-LD builders; the layout renders them. */
export type StructuredData = Record<string, unknown>;

const CONTEXT = 'https://schema.org';

const absolute = (href: string, site: URL | string): string => new URL(href, site).href;

export const personSchema = ({
  site,
  homeHref,
  jobTitle,
  description,
}: {
  site: URL | string;
  homeHref: string;
  jobTitle: string;
  description: string;
}): StructuredData => ({
  '@context': CONTEXT,
  '@type': 'Person',
  '@id': `${absolute(homeHref, site)}#person`,
  name: SITE_AUTHOR.name,
  alternateName: SITE_AUTHOR.handle,
  jobTitle,
  description,
  email: `mailto:${SITE_AUTHOR.email}`,
  url: absolute(homeHref, site),
  sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github],
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE_AUTHOR.city,
    addressCountry: SITE_AUTHOR.countryCode,
  },
});

export const breadcrumbSchema = (
  site: URL | string,
  items: { label: string; href: string }[],
): StructuredData => ({
  '@context': CONTEXT,
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: absolute(item.href, site),
  })),
});
