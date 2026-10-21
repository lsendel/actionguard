// Core Types
export * from './types.js';

// Canonical JSON and Dual-Hashing Engine
export { canonicalJsonStringify, sha256Hex } from './hashing/canonical.js';
export {
  computeSchemaHash,
  computeDescriptionsHash,
  computeDualHash,
} from './hashing/dual-hash.js';
export { diffToolSets } from './hashing/diff.js';

// Linters
export {
  calculateToolTokenCost,
  estimateTokenCount,
  lintTokenBloat,
  TOKEN_BLOAT_FAIL_THRESHOLD,
  TOKEN_BLOAT_WARN_THRESHOLD,
} from './linter/token-bloat.js';
export { lintPromptInjection } from './linter/prompt-injection.js';
export { lintSchemaStrictness } from './linter/schema-strictness.js';

// Compiler & Artifacts
export {
  compileToA2AAgentCard,
  compileToDnsAidRecords,
  compileToGitHubAction,
  compileToMcpRegistry,
  generateArtifacts,
  generateStarterManifest,
  validateManifest,
} from './compiler/manifest.js';

// Scoring
export { calculateScore } from './scoring/grade.js';

// Telemetry & Uptime
export {
  calculateMedianLatency,
  calculateUptimeStats,
  type ProbeRecord,
  type UptimeStats,
} from './telemetry/uptime.js';

// Probes & Live Inspector
export { isSafeTargetUrl } from './probes/ssrf.js';
export { probeIdentity } from './probes/identity.js';
export { probeTransport } from './probes/transport.js';
export { runInspection, type InspectOptions } from './probes/inspector.js';
