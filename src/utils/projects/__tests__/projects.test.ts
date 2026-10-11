import { galleryImage, projectsFor, projectSlug } from '../projects';

describe('projects', () => {
  it('should take the slug from the entry id', () => {
    expect(projectSlug('en/payments-v2')).toBe('payments-v2');
    expect(projectSlug('belo')).toBe('belo');
  });

  it('should keep one language and sort by order', () => {
    const entries = [
      { id: 'es/belo', data: { order: 2 } },
      { id: 'en/belo', data: { order: 2 } },
      { id: 'en/payments-v2', data: { order: 1 } },
    ];

    expect(projectsFor(entries, 'en').map((entry) => entry.id)).toStrictEqual([
      'en/payments-v2',
      'en/belo',
    ]);
  });

  it('should keep the size Astro gives and fall back to 4:3', () => {
    expect(
      galleryImage({ src: '/a.webp', attributes: { width: 1600, height: 1000 } }, 'Screen'),
    ).toStrictEqual({ src: '/a.webp', width: 1600, height: 1000, alt: 'Screen' });
    expect(galleryImage({ src: '/b.webp', attributes: {} }, 'Cover')).toStrictEqual({
      src: '/b.webp',
      width: 1200,
      height: 900,
      alt: 'Cover',
    });
  });
});
