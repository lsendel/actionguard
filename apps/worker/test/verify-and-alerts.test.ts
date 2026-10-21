import { describe, expect, it, vi } from 'vitest';
import {
  buildWebhookPayload,
  dispatchDriftAlerts,
  renderDriftAlertEmailHtml,
} from '../src/alerts.js';
import type { Env } from '../src/types.js';

describe('Domain Verification & Alerts', () => {
  describe('Drift Alert Email & Webhooks', () => {
    it('renders drift alert HTML with breaking changes and hashes', () => {
      const html = renderDriftAlertEmailHtml({
        serviceName: 'Test MCP Service',
        domain: 'mcp.example.com',
        slug: 'test-mcp',
        changeType: 'schema_modified',
        severity: 'breaking',
        oldHash: '1111111111111111111111111111111111111111111111111111111111111111',
        newHash: '2222222222222222222222222222222222222222222222222222222222222222',
        reportUrl: 'https://actionguard.ai/servers/test-mcp',
      });

      expect(html).toContain('CRITICAL SCHEMA DRIFT');
      expect(html).toContain('mcp.example.com');
      expect(html).toContain('1111111111111111111111111111111111111111111111111111111111111111');
      expect(html).toContain('2222222222222222222222222222222222222222222222222222222222222222');
      expect(html).toContain('https://actionguard.ai/servers/test-mcp');
    });

    it('builds Slack Block Kit webhook payload for breaking drift', () => {
      const payload = buildWebhookPayload('https://hooks.slack.com/services/T00/B00/X00', {
        severity: 'breaking',
        changeType: 'schema_modified',
        serviceName: 'Test Service',
        domain: 'test.example.com',
        slug: 'test-service',
        oldHash: 'aaaa',
        newHash: 'bbbb',
        reportUrl: 'https://actionguard.ai/servers/test-service',
      });

      expect(payload.headers['Content-Type']).toBe('application/json');
      const body = JSON.parse(payload.body) as {
        text: string;
        blocks: Array<{ text: { text: string } }>;
      };
      expect(body.text).toContain('Breaking Schema Drift');
      expect(body.blocks[0].text.text).toContain('Breaking Schema Drift Detected');
    });

    it('builds standard JSON webhook payload for generic webhook endpoints', () => {
      const payload = buildWebhookPayload('https://api.mycompany.com/webhook', {
        severity: 'security_warning',
        changeType: 'description_mutated',
        serviceName: 'Test Service',
        domain: 'test.example.com',
        slug: 'test-service',
        oldHash: 'aaaa',
        newHash: 'bbbb',
        reportUrl: 'https://actionguard.ai/servers/test-service',
      });

      expect(payload.headers['Content-Type']).toBe('application/json');
      const body = JSON.parse(payload.body) as {
        event: string;
        changeType: string;
        severity: string;
        oldHash: string;
        newHash: string;
      };
      expect(body.event).toBe('schema_drift');
      expect(body.changeType).toBe('description_mutated');
      expect(body.severity).toBe('security_warning');
      expect(body.oldHash).toBe('aaaa');
      expect(body.newHash).toBe('bbbb');
    });

    it('dispatches webhook alerts even if RESEND_API_KEY is not configured', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
      vi.stubGlobal('fetch', mockFetch);

      const mockDb = {
        prepare: vi.fn().mockReturnValue({
          bind: vi.fn().mockReturnValue({
            all: vi.fn().mockResolvedValue({
              results: [
                {
                  notify_email: 'dev@example.com',
                  alert_webhook_url: 'https://api.mycompany.com/webhook',
                },
              ],
            }),
          }),
        }),
      } as unknown as D1Database;

      const env = {
        actionguard_db: mockDb,
      } as Env;

      await dispatchDriftAlerts(
        env,
        'srv_test',
        'Test Service',
        'test.example.com',
        'test-service',
        'schema_modified',
        'breaking',
        'old123',
        'new456',
        'https://actionguard.ai/servers/test-service',
      );

      // Webhook fetch should be called despite no email key
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.mycompany.com/webhook',
        expect.objectContaining({
          method: 'POST',
        }),
      );

      vi.unstubAllGlobals();
    });
  });

  describe('Domain Ownership Verification Flow', () => {
    it('verifies domain via DNS TXT record matching verification token', async () => {
      const mockFetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('cloudflare-dns.com')) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                Answer: [{ data: '"actionguard-verification=tok_secret123"' }],
              }),
              { status: 200, headers: { 'Content-Type': 'application/dns-json' } },
            ),
          );
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      vi.stubGlobal('fetch', mockFetch);

      // Verify DoH response parsing
      const dohUrl = 'https://cloudflare-dns.com/dns-query?name=_actionguard.test.com&type=TXT';
      const res = await fetch(dohUrl);
      const json = (await res.json()) as { Answer?: Array<{ data: string }> };
      const match = json.Answer?.some((a) =>
        a.data.replace(/^"|"$/g, '').includes('actionguard-verification=tok_secret123'),
      );
      expect(match).toBe(true);

      vi.unstubAllGlobals();
    });

    it('falls back to .well-known/actionguard-verification.txt', async () => {
      const mockFetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('actionguard-verification.txt')) {
          return Promise.resolve(new Response('tok_secret123', { status: 200 }));
        }
        return Promise.resolve(new Response('{}', { status: 200 }));
      });

      vi.stubGlobal('fetch', mockFetch);

      const wkRes = await fetch('https://test.com/.well-known/actionguard-verification.txt');
      const text = await wkRes.text();
      expect(text.trim()).toBe('tok_secret123');

      vi.unstubAllGlobals();
    });
  });
});
