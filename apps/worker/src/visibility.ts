import type { MiddlewareHandler } from 'hono';
import type { Env } from './types.js';

// Direct links remain usable. Search engines must not index unlisted services.
// Keep robots.txt open so crawlers can read the noindex response.
export const serviceVisibility: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const match = /^\/(servers|connect|badge|og)\/([^/]+)$/.exec(c.req.path);
  if (!match) return next();

  let listed = false;
  try {
    const target = decodeURIComponent(match[2]);
    const slug = ['badge', 'og'].includes(match[1])
      ? target.replace(/\.(svg|png|json)$/, '')
      : target;
    const row = await c.env.actionguard_db
      ?.prepare('SELECT listed FROM services WHERE slug = ? OR LOWER(canonical_domain) = ? LIMIT 1')
      .bind(slug, slug.toLowerCase())
      .first<{ listed: number }>();
    listed = row?.listed === 1;
  } catch {
    // Unknown visibility must not accidentally make a hidden endpoint indexable.
  }

  await next();
  if (listed) return;

  const headers = new Headers(c.res.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  headers.set('Cache-Control', 'no-store');
  if (headers.get('Content-Type')?.includes('text/html')) {
    const html = (await c.res.text()).replace(
      /<head(?:\s[^>]*)?>/i,
      '$&<meta name="robots" content="noindex, nofollow, noarchive">',
    );
    headers.delete('Content-Length');
    c.res = new Response(html, { status: c.res.status, headers });
  } else {
    c.res = new Response(c.res.body, { status: c.res.status, headers });
  }
};
