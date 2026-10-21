import { describe, expect, it } from 'vitest';

describe('Endpoint Deduplication & Verification Tier Preservation', () => {
  interface ServiceRow {
    id: string;
    org_id: string;
    slug: string;
    display_name: string;
    canonical_domain: string;
    verification_tier: string;
    overall_grade: string;
  }

  interface EndpointRow {
    id: string;
    service_id: string;
    url: string;
    last_status: string;
    last_latency_ms: number | null;
  }

  class MockD1 {
    services = new Map<string, ServiceRow>();
    endpoints = new Map<string, EndpointRow>();
    probes: Array<{
      endpoint_id: string;
      status: string;
      latency_ms: number | null;
      grade: string;
    }> = [];

    findServiceByDomainOrSlug(identifier: string): ServiceRow | undefined {
      const lower = identifier.toLowerCase();
      for (const s of this.services.values()) {
        if (s.canonical_domain.toLowerCase() === lower || s.slug.toLowerCase() === lower) {
          return s;
        }
      }
      return undefined;
    }

    // Mirrors persistInspectionReport logic in index.ts
    async persistInspection(report: {
      targetDomain: string;
      targetUrl: string;
      grade: string;
      status: string;
      latencyMs: number | null;
    }) {
      const cleanDomain = report.targetDomain.toLowerCase();
      const existing = this.findServiceByDomainOrSlug(cleanDomain);

      const serviceId = existing?.id || `srv_${cleanDomain.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const slug = existing?.slug || cleanDomain;
      const endpointId = `ep_${serviceId.replace(/^srv_/, '')}`;
      const gradeToStore = report.grade === 'F' ? 'Unreachable' : report.grade;

      if (!existing) {
        this.services.set(serviceId, {
          id: serviceId,
          org_id: `org_${cleanDomain}`,
          slug,
          display_name: report.targetDomain,
          canonical_domain: cleanDomain,
          overall_grade: gradeToStore,
          verification_tier: 'Unverified (curated listing)', // Seed / default tier
        });
      } else {
        // Crucial: NEVER update verification_tier on inspect!
        existing.overall_grade = gradeToStore;
      }

      this.endpoints.set(endpointId, {
        id: endpointId,
        service_id: serviceId,
        url: report.targetUrl,
        last_status: report.status,
        last_latency_ms: report.latencyMs,
      });

      this.probes.push({
        endpoint_id: endpointId,
        status: report.status,
        latency_ms: report.latencyMs,
        grade: gradeToStore,
      });

      return { serviceId, slug };
    }

    // Mirrors verify.ts domain verification claim
    async completeDomainClaim(domain: string, passed: boolean) {
      if (!passed) return false;
      const service = this.findServiceByDomainOrSlug(domain);
      if (service) {
        service.verification_tier = 'Domain Verified';
        return true;
      }
      return false;
    }
  }

  it('ensures inspecting the same domain twice updates the existing row and yields exactly one row', async () => {
    const db = new MockD1();

    // First inspection of analytics.where.care
    const firstResult = await db.persistInspection({
      targetDomain: 'analytics.where.care',
      targetUrl: 'https://analytics.where.care/mcp',
      grade: 'B',
      status: 'up',
      latencyMs: 110,
    });

    expect(db.services.size).toBe(1);
    expect(firstResult.slug).toBe('analytics.where.care');

    // Second inspection of the same domain with different URL parameters
    const secondResult = await db.persistInspection({
      targetDomain: 'analytics.where.care',
      targetUrl: 'https://analytics.where.care/mcp?v=2',
      grade: 'A',
      status: 'up',
      latencyMs: 90,
    });

    expect(db.services.size).toBe(1); // Still exactly one service record!
    expect(secondResult.serviceId).toBe(firstResult.serviceId);

    const saved = db.services.get(firstResult.serviceId);
    expect(saved?.overall_grade).toBe('A');
    expect(saved?.canonical_domain).toBe('analytics.where.care');
  });

  it('guarantees verification_tier cannot be modified or elevated by inspection', async () => {
    const db = new MockD1();

    // Pre-populate with initial unverified curated listing
    await db.persistInspection({
      targetDomain: 'example.com',
      targetUrl: 'https://example.com/mcp',
      grade: 'B',
      status: 'up',
      latencyMs: 100,
    });

    const initial = db.findServiceByDomainOrSlug('example.com');
    expect(initial?.verification_tier).toBe('Unverified (curated listing)');

    // Run inspection returning A+
    await db.persistInspection({
      targetDomain: 'example.com',
      targetUrl: 'https://example.com/mcp',
      grade: 'A+',
      status: 'up',
      latencyMs: 30,
    });

    // Verification tier must NOT change just because score is A+
    const afterProbe = db.findServiceByDomainOrSlug('example.com');
    expect(afterProbe?.verification_tier).toBe('Unverified (curated listing)');

    // Now execute real domain verification challenge
    const verified = await db.completeDomainClaim('example.com', true);
    expect(verified).toBe(true);

    const claimed = db.findServiceByDomainOrSlug('example.com');
    expect(claimed?.verification_tier).toBe('Domain Verified');

    // Subsequent inspection with failure or low score must NEVER demote the verified claim
    await db.persistInspection({
      targetDomain: 'example.com',
      targetUrl: 'https://example.com/mcp',
      grade: 'F',
      status: 'down',
      latencyMs: null,
    });

    const afterFailedProbe = db.findServiceByDomainOrSlug('example.com');
    expect(afterFailedProbe?.verification_tier).toBe('Domain Verified'); // Still Domain Verified!
    expect(afterFailedProbe?.overall_grade).toBe('Unreachable');
  });

  it('never assigns grade A+ to an unreachable endpoint', async () => {
    const db = new MockD1();

    await db.persistInspection({
      targetDomain: 'broken.service.io',
      targetUrl: 'https://broken.service.io/mcp',
      grade: 'F',
      status: 'down',
      latencyMs: null,
    });

    const s = db.findServiceByDomainOrSlug('broken.service.io');
    expect(s?.overall_grade).toBe('Unreachable');
    expect(s?.overall_grade).not.toBe('A+');
  });
});
