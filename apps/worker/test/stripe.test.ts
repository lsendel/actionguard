import { describe, expect, it } from 'vitest';
import {
  createCheckoutSession,
  handleStripeWebhook,
  renderPricingSuccessHtml,
} from '../src/stripe.js';
import type { Env } from '../src/types.js';

describe('Stripe Checkout & Subscription Webhook', () => {
  it('creates test checkout session when STRIPE_SECRET_KEY is omitted', async () => {
    const env = {} as Env;
    const result = await createCheckoutSession(env, {
      plan: 'pro',
      email: 'dev@testco.com',
      successUrl: 'https://actionguard.ai/pricing/success',
      cancelUrl: 'https://actionguard.ai/pricing',
    });

    expect(result.sessionId).toMatch(/^cs_test_/);
    expect(result.checkoutUrl).toContain('https://actionguard.ai/pricing/success');
    expect(result.checkoutUrl).toContain('tier=pro');
    expect(result.checkoutUrl).toContain('dev%40testco.com');
  });

  it('renders payment confirmation UI with tier and email', () => {
    const html = renderPricingSuccessHtml('pro', 'founder@startup.com');
    expect(html).toContain('Welcome to ActionGuard PRO!');
    expect(html).toContain('founder@startup.com');
    expect(html).toContain('PAYMENT CONFIRMED');
    expect(html).toContain('https://actionguard.ai/proxy/:slug');
  });

  it('handles empty or non-checkout webhook payloads gracefully', async () => {
    const env = {} as Env;
    const req = new Request('https://actionguard.ai/api/stripe/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'payment_intent.created' }),
    });

    const res = await handleStripeWebhook(req, env);
    expect(res.success).toBe(true);
  });

  it('reuses existing organization when creating api keys repeatedly for same email', async () => {
    const orgs = new Map<string, { id: string; name: string; slug: string }>();
    const keys = new Map<string, unknown>();

    const mockDb = {
      prepare: (sql: string) => ({
        bind: (...args: unknown[]) => ({
          first: async () => {
            if (sql.includes('SELECT id FROM organizations WHERE slug = ?')) {
              const slug = args[0] as string;
              return orgs.get(slug) || null;
            }
            return null;
          },
          run: async () => {
            if (sql.includes('INSERT INTO organizations')) {
              const [id, name, slug] = args as [string, string, string];
              orgs.set(slug, { id, name, slug });
            } else if (sql.includes('INSERT INTO api_keys')) {
              const [id] = args as [string];
              keys.set(id, args);
            }
            return { success: true };
          },
        }),
      }),
    };

    const env = { actionguard_db: mockDb } as unknown as Env;

    const key1 = await createCheckoutSession(env, {
      plan: 'pro',
      email: 'repeat@testco.com',
      successUrl: 'https://actionguard.ai/pricing/success',
      cancelUrl: 'https://actionguard.ai/pricing',
    });

    const key2 = await createCheckoutSession(env, {
      plan: 'pro',
      email: 'repeat@testco.com',
      successUrl: 'https://actionguard.ai/pricing/success',
      cancelUrl: 'https://actionguard.ai/pricing',
    });

    expect(key1.sessionId).toMatch(/^cs_test_/);
    expect(key2.sessionId).toMatch(/^cs_test_/);
    expect(orgs.size).toBe(1);
    expect(keys.size).toBe(2);
  });
});
