import { describe, expect, it, vi } from 'vitest';
import {
  buildWebhookPayload,
  dispatchDriftAlerts,
  renderDriftAlertEmailHtml,
} from '../src/alerts.js';
import type { Env } from '../src/types.js';

describe('Drift Event Pipeline & Notification Simulation', () => {
  const BASELINE_SCHEMA = 'aaaa111122223333444455556666777788889999aaaabbbbccccddddeeeeffff';
  const BASELINE_DESC = '1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff';
  const DRIFTED_SCHEMA = 'bbbb22223333444455556666777788889999aaaabbbbccccddddeeeeffffaaaa';
  const MUTATED_DESC = '2222333344445555666677778888999900001111aaaabbbbccccddddeeeeffff';

  it('detects breaking schema drift and formats critical alert payload', () => {
    const isSchemaDrift = BASELINE_SCHEMA !== DRIFTED_SCHEMA;
    expect(isSchemaDrift).toBe(true);

    const severity = isSchemaDrift ? 'breaking' : 'security_warning';
    const changeType = isSchemaDrift ? 'schema_modified' : 'description_mutated';

    const payload = buildWebhookPayload('https://hooks.slack.com/services/T1/B2/X3', {
      severity,
      changeType,
      serviceName: 'Production Payment MCP',
      domain: 'pay.example.com',
      slug: 'payment-mcp',
      oldHash: BASELINE_SCHEMA,
      newHash: DRIFTED_SCHEMA,
      reportUrl: 'https://actionguard.ai/servers/payment-mcp',
    });

    const parsed = JSON.parse(payload.body) as {
      text: string;
      blocks: Array<{ type: string; text?: { text: string } }>;
    };
    expect(parsed.text).toContain('Breaking Schema Drift');
    expect(parsed.blocks[0].text?.text).toContain('Breaking Schema Drift Detected');
  });

  it('detects description mutation and alerts with security warning', () => {
    const isDescMutation = BASELINE_DESC !== MUTATED_DESC;
    expect(isDescMutation).toBe(true);

    const severity = 'security_warning';
    const changeType = 'description_mutated';

    const payload = buildWebhookPayload('https://api.internal.corp/alerts/mcp-drift', {
      severity,
      changeType,
      serviceName: 'Production Payment MCP',
      domain: 'pay.example.com',
      slug: 'payment-mcp',
      oldHash: BASELINE_DESC,
      newHash: MUTATED_DESC,
      reportUrl: 'https://actionguard.ai/servers/payment-mcp',
    });

    const parsed = JSON.parse(payload.body) as {
      event: string;
      changeType: string;
      severity: string;
      oldHash: string;
      newHash: string;
    };
    expect(parsed.event).toBe('schema_drift');
    expect(parsed.severity).toBe('security_warning');
    expect(parsed.changeType).toBe('description_mutated');
    expect(parsed.oldHash).toBe(BASELINE_DESC);
    expect(parsed.newHash).toBe(MUTATED_DESC);
  });

  it('dispatches drift alerts to multi-channel subscribers (email + Slack + webhook)', async () => {
    const dispatchedUrls: string[] = [];
    const dispatchedBodies: unknown[] = [];

    const mockFetch = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      dispatchedUrls.push(url);
      if (init?.body) {
        dispatchedBodies.push(JSON.parse(init.body as string));
      }
      return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    });
    vi.stubGlobal('fetch', mockFetch);

    const mockSubscribers = [
      {
        notify_email: 'security-team@example.com',
        alert_webhook_url: 'https://hooks.slack.com/services/T9/B9/X9',
      },
      {
        notify_email: 'devops@example.com',
        alert_webhook_url: 'https://api.example.com/webhooks/actionguard',
      },
    ];

    const mockDb = {
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          all: vi.fn().mockResolvedValue({ results: mockSubscribers }),
        }),
      }),
    } as unknown as D1Database;

    const env: Env = {
      actionguard_db: mockDb,
      RESEND_API_KEY: 're_test_key_123',
      ALERT_FROM_EMAIL: 'alerts@actionguard.ai',
    } as unknown as Env;

    await dispatchDriftAlerts(
      env,
      'srv_payment_mcp',
      'Payment Gateway MCP',
      'pay.example.com',
      'payment-mcp',
      'schema_modified',
      'breaking',
      BASELINE_SCHEMA,
      DRIFTED_SCHEMA,
      'https://actionguard.ai/servers/payment-mcp',
    );

    // Verify Resend email dispatches (2 emails to security-team and devops)
    const emailCalls = dispatchedUrls.filter((u) => u.includes('api.resend.com/emails'));
    expect(emailCalls.length).toBe(2);

    // Verify Slack webhook dispatch
    const slackCalls = dispatchedUrls.filter((u) => u.includes('hooks.slack.com'));
    expect(slackCalls.length).toBe(1);

    // Verify custom API webhook dispatch
    const customApiCalls = dispatchedUrls.filter((u) => u.includes('api.example.com/webhooks'));
    expect(customApiCalls.length).toBe(1);

    vi.unstubAllGlobals();
  });
});
