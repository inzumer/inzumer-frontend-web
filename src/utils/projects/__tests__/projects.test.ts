import { projectsFor, projectSlug } from '../projects';

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
});
