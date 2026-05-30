import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('getAllCollections', () => {
  const originalEnv = {
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_TOKEN: process.env.SHOPIFY_STOREFRONT_TOKEN,
  };

  beforeEach(() => {
    vi.resetModules();
    process.env.SHOPIFY_STORE_DOMAIN = 'react-foundation.myshopify.com';
    process.env.SHOPIFY_STOREFRONT_TOKEN = 'test-token';
  });

  afterEach(() => {
    process.env.SHOPIFY_STORE_DOMAIN = originalEnv.SHOPIFY_STORE_DOMAIN;
    process.env.SHOPIFY_STOREFRONT_TOKEN = originalEnv.SHOPIFY_STOREFRONT_TOKEN;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns collection updatedAt values from the Shopify response for sitemap consumers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Collection/1',
                  handle: 'foundation-drop',
                  title: 'Foundation Drop',
                  description: 'A limited collection',
                  descriptionHtml: '<p>A limited collection</p>',
                  updatedAt: '2026-04-01T00:00:00.000Z',
                  image: null,
                  products: {
                    edges: [],
                  },
                  isDrop: null,
                  dropNumber: null,
                  dropStartDate: null,
                  dropEndDate: null,
                  dropSeason: null,
                  dropYear: null,
                  dropTheme: null,
                  limitedEditionSize: null,
                  isPerennial: null,
                  collectionType: null,
                  homeFeatured: null,
                  homeFeaturedOrder: null,
                  accentGradient: null,
                  timeLimited: null,
                },
              },
            ],
          },
        },
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const { getAllCollections } = await import('./shopify');
    const collections = await getAllCollections();

    const [{ body }] = fetchMock.mock.calls.map(([, requestInit]) => requestInit as RequestInit);
    const requestPayload = JSON.parse(String(body)) as { query: string };

    expect(requestPayload.query).toContain('updatedAt');
    expect(collections[0]).toEqual(
      expect.objectContaining({
        handle: 'foundation-drop',
        updatedAt: '2026-04-01T00:00:00.000Z',
      }),
    );
  });
});
