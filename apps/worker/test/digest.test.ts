import { describe, expect, it } from 'vitest';
import { dispatchWeeklyDigest } from '../src/alerts.js';
import type { Env } from '../src/types.js';

describe('Weekly Schema Drift Digest Cron', () => {
  it('returns zero notifications when database is unavailable', async () => {
    const env = {} as Env;
    const result = await dispatchWeeklyDigest(env);
    expect(result.subscribersNotified).toBe(0);
    expect(result.driftEventsSummarized).toBe(0);
  });
});
