import type { Env } from './types.js';

export async function hashApiKey(key: string): Promise<string> {
  const enc = new TextEncoder().encode(key);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createNewApiKey(
  env: Env,
  email: string,
  keyName = 'Default Key',
  tier = 'free',
): Promise<{
  id: string;
  rawKey: string;
  prefix: string;
  tier: string;
  monthlyQuota: number;
} | null> {
  if (!env.actionguard_db) return null;

  // Find or create organization for this developer
  const orgId = `org_${Math.random().toString(36).substring(2, 10)}`;
  await env.actionguard_db
    .prepare('INSERT OR IGNORE INTO organizations (id, name, slug) VALUES (?, ?, ?)')
    .bind(orgId, email, email.replace(/[^a-z0-9]/g, '_'))
    .run();

  const randBytes = new Uint8Array(24);
  crypto.getRandomValues(randBytes);
  const randomHex = Array.from(randBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const rawKey = `ag_live_${randomHex}`;
  const keyHash = await hashApiKey(rawKey);
  const prefix = `ag_live_${randomHex.substring(0, 6)}...`;
  const keyId = `key_${Math.random().toString(36).substring(2, 10)}`;
  const monthlyQuota = tier === 'enterprise' ? 1000000 : tier === 'pro' ? 50000 : 5000;
  const rateLimit = tier === 'enterprise' ? 600 : tier === 'pro' ? 240 : 60;

  await env.actionguard_db
    .prepare(
      `INSERT INTO api_keys (id, org_id, key_hash, prefix, name, tier, rate_limit_per_minute, monthly_quota, used_this_month)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    )
    .bind(keyId, orgId, keyHash, prefix, keyName, tier, rateLimit, monthlyQuota)
    .run();

  return {
    id: keyId,
    rawKey,
    prefix,
    tier,
    monthlyQuota,
  };
}

export async function validateAndTrackKey(
  env: Env,
  rawKey: string,
): Promise<{
  valid: boolean;
  tier?: string;
  quotaRemaining?: number;
  error?: string;
}> {
  if (!env.actionguard_db) return { valid: false, error: 'Database unavailable' };

  const keyHash = await hashApiKey(rawKey);
  const record = await env.actionguard_db
    .prepare(
      `SELECT id, tier, monthly_quota, used_this_month, expires_at
       FROM api_keys
       WHERE key_hash = ?`,
    )
    .bind(keyHash)
    .first<{
      id: string;
      tier: string;
      monthly_quota: number;
      used_this_month: number;
      expires_at?: string;
    }>();

  if (!record) {
    return { valid: false, error: 'Invalid API key' };
  }

  if (record.expires_at && new Date(record.expires_at).getTime() < Date.now()) {
    return { valid: false, error: 'API key expired' };
  }

  if (record.used_this_month >= record.monthly_quota) {
    return {
      valid: false,
      tier: record.tier,
      error: `Monthly quota of ${record.monthly_quota} calls reached. Upgrade to Pro for 50,000+ calls.`,
    };
  }

  // Asynchronously increment usage counter
  await env.actionguard_db
    .prepare('UPDATE api_keys SET used_this_month = used_this_month + 1 WHERE id = ?')
    .bind(record.id)
    .run();

  return {
    valid: true,
    tier: record.tier,
    quotaRemaining: Math.max(0, record.monthly_quota - (record.used_this_month + 1)),
  };
}
