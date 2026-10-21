import { calculateScore } from '@actionguard/core';
import { describe, expect, it } from 'vitest';
import { renderBadgeSvg } from '../src/badges.js';
import { renderOgCardSvg } from '../src/og.js';
import { handleProxyRequest } from '../src/proxy.js';
import { renderServerProfileHtml } from '../src/server-profile.js';
import type { Env } from '../src/types.js';

describe('Fix 1 & 2: Trust and Real Numbers Verification', () => {
  describe('Proxy Pin Enforcement', () => {
    it('refuses an empty pin parameter', async () => {
      const req = new Request(
        'https://actionguard.ai/v1/proxy?target=https://api.github.com/mcp&pin=',
      );
      const env = {} as Env;
      const res = await handleProxyRequest(req, env);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error.message).toContain('Cryptographic pin rejected');
    });

    it('refuses the SHA-256 of an empty string as a pin', async () => {
      const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const req = new Request(
        `https://actionguard.ai/v1/proxy?target=https://api.github.com/mcp&pin=${EMPTY_SHA256}`,
      );
      const env = {} as Env;
      const res = await handleProxyRequest(req, env);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error.message).toContain('Cryptographic pin rejected');
    });
  });

  describe('Server Profile Trust Rules', () => {
    it('shows "Not yet pinned" and suppresses pin copy buttons when no schema hash exists', () => {
      const html = renderServerProfileHtml({
        slug: 'example-mcp',
        display_name: 'Example MCP',
        canonical_domain: 'example.com',
        verification_tier: 'Unverified (curated listing)',
        overall_grade: 'Pending',
        created_at: '2026-10-20T00:00:00Z',
        endpoints: [
          {
            protocol: 'mcp_streamable_http',
            url: 'https://example.com/mcp',
            last_status: 'unknown',
            current_schema_sha256: undefined,
            current_descriptions_sha256: undefined,
          },
        ],
      });

      expect(html).toContain('Not yet pinned');
      expect(html).not.toContain(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      );
      expect(html).not.toContain(
        'b5a2c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      );
      // CI YAML button should not be present
      expect(html).not.toContain('Copy CI Action YAML');
      // Gateway code snippet should not be generated without a pin
      expect(html).toContain('Pin Required to Test Gateway');
    });

    it('displays "Unreachable" and never A+ for an unreachable endpoint', () => {
      const html = renderServerProfileHtml({
        slug: 'unreachable-service',
        display_name: 'Unreachable Service',
        canonical_domain: 'offline.example.com',
        verification_tier: 'Unverified (curated listing)',
        overall_grade: 'A+', // Even if database had a stale A+, runtime status overrides
        created_at: '2026-10-20T00:00:00Z',
        endpoints: [
          {
            protocol: 'mcp_streamable_http',
            url: 'https://offline.example.com/mcp',
            last_status: 'down',
            last_checked_at: '2026-10-21T04:30:00Z',
          },
        ],
      });

      expect(html).toContain('Unreachable');
      // Should not claim A+ in grade badge
      expect(html).not.toContain('>A+<');
      expect(html).toContain('Unreachable (checked');
    });

    it('displays "Collecting data" when probes are fewer than 20', () => {
      const html = renderServerProfileHtml({
        slug: 'new-service',
        display_name: 'New Service',
        canonical_domain: 'new.example.com',
        verification_tier: 'Unverified (curated listing)',
        overall_grade: 'Pending',
        created_at: '2026-10-20T12:00:00Z',
        endpoints: [
          {
            protocol: 'mcp_streamable_http',
            url: 'https://new.example.com/mcp',
            last_status: 'up',
            last_latency_ms: 45,
          },
        ],
      });

      expect(html).toContain('Collecting data (0 probes');
      expect(html).not.toContain('99.98%');
    });
  });

  describe('Badge SVG Integrity', () => {
    it('renders "Unreachable" in red when service is unreachable or failing', () => {
      const svg = renderBadgeSvg('ActionGuard', 'Unreachable', 'Unreachable', 'unverified');
      expect(svg).toContain('fill="#ef4444"'); // Red color
      expect(svg).toContain('Unreachable');
      expect(svg).not.toContain('Verified');
    });

    it('does not falsely state "Verified" for unverified tier', () => {
      const svg = renderBadgeSvg('ActionGuard', 'A', 'A', 'Unverified (curated listing)');
      expect(svg).not.toContain('Domain Owner');
      expect(svg).not.toContain('Verified');
      expect(svg).toContain('A');
    });

    it('only displays "⭐ ... • Domain Owner" for confirmed Domain Verified tier', () => {
      const svg = renderBadgeSvg('ActionGuard', 'A+ • Domain Owner', 'A+', 'Domain Verified');
      expect(svg).toContain('⭐');
      expect(svg).toContain('Domain Owner');
    });
  });

  describe('OpenGraph Card Real Data Rendering', () => {
    it('renders "Collecting data" and "no data yet" instead of fake stats when unprobed', () => {
      const svg = renderOgCardSvg({
        title: 'Fresh MCP',
        domain: 'fresh.mcp.io',
      });

      expect(svg).not.toContain('99.98%');
      expect(svg).not.toContain('120ms');
      expect(svg).toContain('Collecting data');
      expect(svg).toContain('no data yet');
      expect(svg).toContain('Not yet pinned');
    });
  });

  describe('Scoring Logic via Core calculateScore', () => {
    it('computes grades accurately from lint and probe findings', () => {
      // 0 fails, 0 warns = A+
      const scoreAp = calculateScore([
        { id: '1', stage: 'transport', title: 'HTTP Handshake', status: 'pass', message: 'OK' },
      ]);
      expect(scoreAp.grade).toBe('A+');
      expect(scoreAp.numericalScore).toBe(100);

      // 1 warn (-8 points) = 92 -> A
      const scoreA = calculateScore([
        { id: '1', stage: 'transport', title: 'HTTP Handshake', status: 'pass', message: 'OK' },
        { id: '2', stage: 'schema', title: 'Schema Strictness', status: 'warn', message: 'Minor' },
      ]);
      expect(scoreA.grade).toBe('A');
      expect(scoreA.numericalScore).toBe(92);

      // 1 fail (-25 points) = 75 -> C
      const scoreC = calculateScore([
        { id: '1', stage: 'transport', title: 'HTTP Handshake', status: 'pass', message: 'OK' },
        { id: '2', stage: 'identity', title: 'Identity', status: 'fail', message: 'Failed' },
      ]);
      expect(scoreC.grade).toBe('C');
      expect(scoreC.numericalScore).toBe(75);

      // Unreachable / severe failure (-25 x 2) = 50 -> F
      const scoreF = calculateScore([
        { id: '1', stage: 'transport', title: 'Offline', status: 'fail', message: 'Down' },
        { id: '2', stage: 'transport', title: 'Timeout', status: 'fail', message: 'Timeout' },
      ]);
      expect(scoreF.grade).toBe('F');
    });
  });
});
