import type { LintFinding, McpToolDefinition } from '../types.js';

export const TOKEN_BLOAT_WARN_THRESHOLD = 2500;
export const TOKEN_BLOAT_FAIL_THRESHOLD = 5000;

/**
 * Estimates LLM token count from raw characters (~4 characters per token for English/JSON).
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Calculates the combined token footprint of all tool definitions.
 * When orchestrators connect to an MCP server, all tool schemas are injected into the system prompt.
 */
export function calculateToolTokenCost(tools: McpToolDefinition[]): number {
  const jsonStr = JSON.stringify(tools);
  return estimateTokenCount(jsonStr);
}

export function lintTokenBloat(tools: McpToolDefinition[]): LintFinding {
  const tokenCost = calculateToolTokenCost(tools);

  if (tokenCost > TOKEN_BLOAT_FAIL_THRESHOLD) {
    return {
      id: 'token_bloat_critical',
      stage: 'schema',
      title: 'Context Token Footprint Exceeded',
      status: 'fail',
      message: `Your tool schemas consume ~${tokenCost.toLocaleString()} tokens per conversation turn. This exceeds the recommended limit (${TOKEN_BLOAT_FAIL_THRESHOLD.toLocaleString()} tokens) and will significantly slow down agents and increase inference costs.`,
      details: { tokenCost, threshold: TOKEN_BLOAT_FAIL_THRESHOLD },
    };
  }

  if (tokenCost > TOKEN_BLOAT_WARN_THRESHOLD) {
    return {
      id: 'token_bloat_warning',
      stage: 'schema',
      title: 'High Context Token Footprint',
      status: 'warn',
      message: `Your tool schemas consume ~${tokenCost.toLocaleString()} tokens per conversation turn. Consider splitting tools into specialized sub-servers or compacting parameter documentation.`,
      details: { tokenCost, threshold: TOKEN_BLOAT_WARN_THRESHOLD },
    };
  }

  return {
    id: 'token_bloat_healthy',
    stage: 'schema',
    title: 'Context Token Footprint',
    status: 'pass',
    message: `Context footprint is compact (~${tokenCost.toLocaleString()} tokens for ${tools.length} tool${tools.length === 1 ? '' : 's'}).`,
    details: { tokenCost },
  };
}
