import { breadcrumbSchema, personSchema } from '../seo';

const SITE = 'https://www.inzumer.com';

describe('seo', () => {
  it('should describe the person with absolute URLs and profiles', () => {
    const person = personSchema({
      site: SITE,
      homeHref: '/en',
      jobTitle: 'Senior Frontend Engineer',
      description: 'Fast, accessible interfaces.',
    });

    expect(person).toMatchObject({
      '@type': 'Person',
      '@id': 'https://www.inzumer.com/en#person',
      name: 'Nahuel Zamuner',
      jobTitle: 'Senior Frontend Engineer',
      url: 'https://www.inzumer.com/en',
      sameAs: ['https://www.linkedin.com/in/inzumer', 'https://github.com/inzumer'],
    });
  });

  it('should number the breadcrumb trail from one', () => {
    expect(
      breadcrumbSchema(SITE, [
        { label: 'Inicio', href: '/es' },
        { label: 'Belo', href: '/es/projects/belo' },
      ]),
    ).toStrictEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.inzumer.com/es' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Belo',
          item: 'https://www.inzumer.com/es/projects/belo',
        },
      ],
    });
  });
});
