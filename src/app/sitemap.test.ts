import { describe, expect, it, vi } from 'vitest';

vi.mock('@/data/communities', () => ({
  REACT_COMMUNITIES: [
    {
      slug: 'react-miami',
      updated_at: '2026-05-01T00:00:00.000Z',
    },
  ],
}));

vi.mock('@/lib/authors', () => ({
  getAllAuthors: () => [
    {
      slug: 'seth-webster',
    },
  ],
}));

vi.mock('@/lib/updates', () => ({
  getAllUpdates: () => [
    {
      slug: 'spring-update',
      metadata: {
        date: '2026-04-20T00:00:00.000Z',
      },
    },
  ],
}));

vi.mock('@/lib/shopify', () => ({
  getAllCollections: vi.fn(async () => [
    {
      handle: 'foundation-drop',
      updatedAt: '2026-04-01T00:00:00.000Z',
    },
  ]),
  getAllProducts: vi.fn(async () => [
    {
      handle: 'react-cap',
    },
  ]),
}));

describe('sitemap', () => {
  it('excludes dead educators routes and includes the missing public static and dynamic routes', async () => {
    const { default: sitemap } = await import('./sitemap');

    const entries = await sitemap();
    const urls = entries.map((entry) => new URL(entry.url).pathname);
    const collectionEntry = entries.find(
      (entry) => new URL(entry.url).pathname === '/store/collections/foundation-drop',
    );

    expect(urls).not.toContain('/educators');
    expect(urls).not.toContain('/educators/apply');

    expect(urls).toEqual(
      expect.arrayContaining([
        '/',
        '/about',
        '/about/board-of-directors',
        '/about/technical-steering-committee',
        '/authors',
        '/authors/seth-webster',
        '/communities',
        '/communities/add',
        '/communities/react-miami',
        '/communities/start',
        '/impact',
        '/libraries',
        '/privacy',
        '/scoring',
        '/store',
        '/store/collections',
        '/store/collections/foundation-drop',
        '/store/products/react-cap',
        '/terms',
        '/updates',
        '/updates/spring-update',
      ]),
    );

    expect(collectionEntry?.lastModified).toEqual(new Date('2026-04-01T00:00:00.000Z'));
  });
});
