import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';
import type { Env } from '../src/types.js';
import { serviceVisibility } from '../src/visibility.js';

function harness(listed: number | null, fail = false) {
  const bindings = {
    actionguard_db: {
      prepare: () => ({
        bind: () => ({
          first: async () => {
            if (fail) throw new Error('offline');
            return listed === null ? null : { listed };
          },
        }),
      }),
    },
  } as unknown as Env;
  const app = new Hono<{ Bindings: Env }>();
  app.use('*', serviceVisibility);
  app.get('/servers/:slug', (c) =>
    c.html('<html><head><title>Profile</title></head><body>Profile</body></html>'),
  );
  app.get('/connect/:slug', (c) => c.html('<html><head></head><body>Connect</body></html>'));
  // Raw Response handlers cover badge/OG routes that do not use c.body().
  app.get(
    '/badge/:target',
    () => new Response('badge', { headers: { 'Content-Type': 'image/svg+xml' } }),
  );
  app.get(
    '/og/:target',
    () => new Response('card', { headers: { 'Content-Type': 'image/svg+xml' } }),
  );
  app.get('/', (c) => c.html('<head></head>Home'));
  return (path: string) => app.request(path, {}, bindings);
}

describe('Direct unlisted service visibility', () => {
  for (const path of [
    '/servers/hidden',
    '/connect/hidden',
    '/badge/hidden.svg',
    '/badge/hidden.json',
    '/og/hidden.svg',
    '/og/hidden.png',
    '/badge/analytics.where.care.svg',
  ]) {
    it(`keeps ${path} reachable but noindex`, async () => {
      const response = await harness(0)(path);
      expect(response.status).toBe(200);
      expect(response.headers.get('X-Robots-Tag')).toContain('noindex');
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      if (path.startsWith('/servers/') || path.startsWith('/connect/')) {
        expect(await response.text()).toContain(
          '<meta name="robots" content="noindex, nofollow, noarchive">',
        );
      }
    });
    it(`does not noindex listed ${path}`, async () => {
      const response = await harness(1)(path);
      expect(response.headers.get('X-Robots-Tag')).toBeNull();
      expect(await response.text()).not.toContain('noindex');
    });
  }
  it('fails closed when visibility cannot be read', async () => {
    for (const read of [harness(null), harness(0, true)]) {
      expect((await read('/servers/hidden')).headers.get('X-Robots-Tag')).toContain('noindex');
    }
  });
  it('does not add database work or noindex to unrelated routes', async () => {
    const response = await harness(0, true)('/');
    expect(response.headers.get('X-Robots-Tag')).toBeNull();
  });
});
