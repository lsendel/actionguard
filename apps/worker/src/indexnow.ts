import type { Env } from './types.js';

export const INDEXNOW_KEY = '9f8b2c41e8a04b57b98d2460e1d52fa1';
export const INDEXNOW_HOST = 'actionguard.ai';

export async function submitToIndexNow(env: Env, customUrls?: string[]): Promise<{
  success: boolean;
  status: number;
  urlCount: number;
  message?: string;
}> {
  let urls = customUrls;

  if (!urls || urls.length === 0) {
    urls = [
      `https://${INDEXNOW_HOST}/`,
      `https://${INDEXNOW_HOST}/index`,
      `https://${INDEXNOW_HOST}/verify`,
      `https://${INDEXNOW_HOST}/docs/mcp-schema-drift`,
      `https://${INDEXNOW_HOST}/docs/a2a-agent-card-generator`,
      `https://${INDEXNOW_HOST}/docs/dns-aid-setup`,
    ];

    if (env.actionguard_db) {
      const services = await env.actionguard_db
        .prepare(`SELECT slug FROM services LIMIT 100`)
        .all<{ slug: string }>();

      if (services.results) {
        for (const s of services.results) {
          urls.push(`https://${INDEXNOW_HOST}/servers/${encodeURIComponent(s.slug)}`);
        }
      }
    }
  }

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: res.ok || res.status === 200 || res.status === 202,
      status: res.status,
      urlCount: urls.length,
      message: res.statusText,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      status: 500,
      urlCount: urls.length,
      message: msg,
    };
  }
}
