import type {
  DriftChange,
  DriftDiffResult,
  DriftSeverity,
  McpToolDefinition,
} from '../types.js';
import { canonicalJsonStringify } from './canonical.js';
import { computeDescriptionsHash, computeSchemaHash } from './dual-hash.js';

export async function diffToolSets(
  previousTools: McpToolDefinition[],
  currentTools: McpToolDefinition[]
): Promise<DriftDiffResult> {
  const [prevSchemaHash, nextSchemaHash] = await Promise.all([
    computeSchemaHash(previousTools),
    computeSchemaHash(currentTools),
  ]);

  const [prevDescHash, nextDescHash] = await Promise.all([
    computeDescriptionsHash(previousTools),
    computeDescriptionsHash(currentTools),
  ]);

  const schemaChanged = prevSchemaHash !== nextSchemaHash;
  const descriptionsChanged = prevDescHash !== nextDescHash;

  if (!schemaChanged && !descriptionsChanged) {
    return {
      hasDrift: false,
      severity: 'none',
      changes: [],
      schemaChanged: false,
      descriptionsChanged: false,
    };
  }

  const prevMap = new Map<string, McpToolDefinition>(previousTools.map((t) => [t.name, t]));
  const nextMap = new Map<string, McpToolDefinition>(currentTools.map((t) => [t.name, t]));
  const changes: DriftChange[] = [];

  // Check for removed tools
  for (const [name, prevTool] of prevMap.entries()) {
    if (!nextMap.has(name)) {
      changes.push({
        toolId: name,
        changeType: 'tool_removed',
        severity: 'breaking',
        message: `Tool "${name}" was removed from the server. Downstream orchestrators will fail if calling this tool.`,
      });
    }
  }

  // Check for added tools or modified tools
  for (const [name, nextTool] of nextMap.entries()) {
    const prevTool = prevMap.get(name);
    if (!prevTool) {
      changes.push({
        toolId: name,
        changeType: 'tool_added',
        severity: 'non_breaking',
        message: `New tool "${name}" was added to the server.`,
      });
      continue;
    }

    // Compare schemas
    const prevSchema = canonicalJsonStringify(prevTool.inputSchema || {});
    const nextSchema = canonicalJsonStringify(nextTool.inputSchema || {});
    if (prevSchema !== nextSchema) {
      changes.push({
        toolId: name,
        changeType: 'schema_modified',
        severity: 'breaking',
        message: `Input schema for tool "${name}" was modified.`,
        details: {
          previous: prevTool.inputSchema,
          current: nextTool.inputSchema,
        },
      });
    }

    // Compare descriptions
    if ((prevTool.description || '') !== (nextTool.description || '')) {
      changes.push({
        toolId: name,
        changeType: 'description_mutated',
        severity: 'security_warning',
        message: `Natural language description for tool "${name}" changed. Verify for prompt injection or behavior shift.`,
        details: {
          previousDescription: prevTool.description,
          currentDescription: nextTool.description,
        },
      });
    }

    // Check annotations regression (e.g. readOnlyHint was true, now false or removed)
    if (prevTool.annotations?.readOnlyHint === true && nextTool.annotations?.readOnlyHint !== true) {
      changes.push({
        toolId: name,
        changeType: 'annotation_regressed',
        severity: 'breaking',
        message: `Tool "${name}" was previously marked readOnlyHint: true, but is no longer declared read-only.`,
      });
    }
  }

  let highestSeverity: DriftSeverity = 'non_breaking';
  if (changes.some((c) => c.severity === 'breaking')) {
    highestSeverity = 'breaking';
  } else if (changes.some((c) => c.severity === 'security_warning')) {
    highestSeverity = 'security_warning';
  }

  return {
    hasDrift: true,
    severity: highestSeverity,
    changes,
    schemaChanged,
    descriptionsChanged,
  };
}
