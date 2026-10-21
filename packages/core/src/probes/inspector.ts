import { generateArtifacts, generateStarterManifest } from '../compiler/manifest.js';
import { computeDualHash } from '../hashing/dual-hash.js';
import { lintPromptInjection } from '../linter/prompt-injection.js';
import { lintSchemaStrictness } from '../linter/schema-strictness.js';
import { calculateToolTokenCost, lintTokenBloat } from '../linter/token-bloat.js';
import { calculateScore } from '../scoring/grade.js';
import type { InspectionReport, LintFinding, McpToolDefinition } from '../types.js';
import { probeIdentity } from './identity.js';
import { isSafeTargetUrl } from './ssrf.js';
import { probeTransport } from './transport.js';

export interface InspectOptions {
  mockTools?: McpToolDefinition[];
  skipSsrf?: boolean;
}

/**
 * Runs the complete 5-Stage Live Inspection against a target URL or domain.
 */
export async function runInspection(
  targetUrl: string,
  options: InspectOptions = {},
): Promise<InspectionReport> {
  const urlCheck = isSafeTargetUrl(targetUrl);
  if (!urlCheck.isSafe && !options.skipSsrf) {
    throw new Error(`Target URL rejected: ${urlCheck.reason}`);
  }

  const urlObj = urlCheck.url || new URL(targetUrl);
  const domain = urlObj.hostname;
  const reportId = `rep_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;

  const findings: LintFinding[] = [];

  // Stage 1: Identity & Discovery Resolution
  const identityResult = await probeIdentity(domain);
  findings.push(...identityResult.findings);

  // Stage 2: Transport & Handshake Probe
  const transportResult = await probeTransport(targetUrl);
  findings.push(...transportResult.findings);

  // Collect discovered tools or use mocks
  const discoveredTools: McpToolDefinition[] = options.mockTools || transportResult.tools;

  // Stage 3: Schema Quality & Ergonomics
  findings.push(...lintSchemaStrictness(discoveredTools));
  findings.push(lintTokenBloat(discoveredTools));

  // Stage 4: Security & Integrity Audit
  findings.push(...lintPromptInjection(discoveredTools));
  const hashes = await computeDualHash(discoveredTools);

  // Calculate overall grade (0 - 100, A+ to F)
  const score = calculateScore(findings);

  // Stage 5: Artifact Generator
  const starterManifest = generateStarterManifest(domain, targetUrl, discoveredTools);
  const artifacts = generateArtifacts(starterManifest);

  const tokenCostEstimate = calculateToolTokenCost(discoveredTools);

  return {
    id: reportId,
    targetUrl,
    targetDomain: domain,
    inspectedAt: new Date().toISOString(),
    score,
    hashes,
    findings,
    tools: discoveredTools,
    tokenCostEstimate,
    generatedArtifacts: artifacts,
  };
}
