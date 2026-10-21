import type { LintFinding } from '../types.js';

export interface IdentityProbeResult {
  dnsAid: {
    configured: boolean;
    dnssec: boolean;
    recordsFound: string[];
  };
  a2a: {
    configured: boolean;
    endpoint?: string;
    agentCard?: Record<string, unknown>;
  };
  findings: LintFinding[];
}

/**
 * Stage 1 Probe: Resolves decentralized identity, DNS-AID records, and A2A agent cards.
 */
export async function probeIdentity(
  domain: string,
  fetchFn?: typeof fetch,
): Promise<IdentityProbeResult> {
  const doFetch = fetchFn || fetch;
  const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
  const findings: LintFinding[] = [];

  let dnsAidConfigured = false;
  let dnssecVerified = false;
  const recordsFound: string[] = [];

  // 1. Probe DNS-AID via Cloudflare DoH (DNS over HTTPS)
  try {
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=_agents.${cleanDomain}&type=TXT`;
    const res = await doFetch(dohUrl, {
      headers: { Accept: 'application/dns-json' },
      signal: AbortSignal.timeout(2000),
    });

    if (res.ok) {
      const data = (await res.json()) as {
        Status?: number;
        AD?: boolean;
        Answer?: Array<{ data: string }>;
      };
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        dnsAidConfigured = true;
        recordsFound.push(...data.Answer.map((a) => a.data));
        dnssecVerified = Boolean(data.AD);

        findings.push({
          id: 'identity_dns_aid_found',
          stage: 'identity',
          title: 'DNS-AID Discovery Records',
          status: 'pass',
          message: `Found valid DNS-AID records under _agents.${cleanDomain}. DNSSEC authenticated: ${dnssecVerified ? 'YES' : 'NO'}.`,
          details: { records: recordsFound, dnssec: dnssecVerified },
        });
      }
    }
  } catch {
    // DNS timeout or unreachable
  }

  if (!dnsAidConfigured) {
    findings.push({
      id: 'identity_dns_aid_missing',
      stage: 'identity',
      title: 'DNS-AID Records Missing',
      status: 'warn',
      message: `No _agents.${cleanDomain} DNS discovery records detected. Adding DNS-AID enables decentralized agent resolution without vendor registries.`,
    });
  }

  // 2. Probe A2A Protocol (/.well-known/agent-card.json)
  let a2aConfigured = false;
  let a2aAgentCard: Record<string, unknown> | undefined;
  const a2aUrl = `https://${cleanDomain}/.well-known/agent-card.json`;

  try {
    const res = await doFetch(a2aUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      const card = (await res.json()) as Record<string, unknown>;
      if (card && typeof card === 'object' && card.name) {
        a2aConfigured = true;
        a2aAgentCard = card;

        findings.push({
          id: 'identity_a2a_found',
          stage: 'identity',
          title: 'A2A Agent Card Standard',
          status: 'pass',
          message: `Valid A2A Agent Card discovered at ${a2aUrl} (${card.name} v${card.version || '1.0'}).`,
          details: card,
        });
      }
    }
  } catch {
    // A2A not configured
  }

  if (!a2aConfigured) {
    findings.push({
      id: 'identity_a2a_missing',
      stage: 'identity',
      title: 'A2A Agent Card Missing',
      status: 'warn',
      message: `No A2A Agent Card found at ${a2aUrl}. ActionGuard can generate this file automatically.`,
    });
  }

  return {
    dnsAid: {
      configured: dnsAidConfigured,
      dnssec: dnssecVerified,
      recordsFound,
    },
    a2a: {
      configured: a2aConfigured,
      endpoint: a2aConfigured ? a2aUrl : undefined,
      agentCard: a2aAgentCard,
    },
    findings,
  };
}
