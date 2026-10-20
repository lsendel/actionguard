import type { DualHashResult, McpToolDefinition } from '../types.js';
import { canonicalJsonStringify, sha256Hex } from './canonical.js';

/**
 * Strips all descriptions, docstrings, and examples from a JSON Schema object,
 * preserving only types, required fields, property names, enums, and structural constraints.
 */
function stripDescriptionsFromSchema(schema: unknown): unknown {
  if (schema === null || typeof schema !== 'object') {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map(stripDescriptionsFromSchema);
  }

  const obj = schema as Record<string, unknown>;
  const stripped: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Exclude human-readable documentation strings
    if (
      key === 'description' ||
      key === 'title' ||
      key === 'examples' ||
      key === 'example' ||
      key === '$comment' ||
      key === 'default'
    ) {
      continue;
    }
    stripped[key] = stripDescriptionsFromSchema(value);
  }

  return stripped;
}

/**
 * Recursively extracts all description, title, and example strings from a schema or tool.
 */
function extractDescriptions(val: unknown, collected: string[]): void {
  if (val === null || typeof val !== 'object') {
    return;
  }

  if (Array.isArray(val)) {
    for (const item of val) {
      extractDescriptions(item, collected);
    }
    return;
  }

  const obj = val as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (
      (key === 'description' || key === 'title' || key === 'example' || key === 'examples') &&
      typeof value === 'string'
    ) {
      collected.push(`${key}:${value.trim()}`);
    } else if (key === 'examples' && Array.isArray(value)) {
      for (const ex of value) {
        if (typeof ex === 'string') collected.push(`example:${ex.trim()}`);
      }
    } else {
      extractDescriptions(value, collected);
    }
  }
}

/**
 * Computes the structural schema hash (schema_sha256).
 * Any change to input arguments, types, required flags, or annotations changes this hash.
 */
export async function computeSchemaHash(tools: McpToolDefinition[]): Promise<string> {
  const normalizedTools = tools
    .map((tool) => ({
      name: tool.name,
      inputSchema: stripDescriptionsFromSchema(tool.inputSchema || {}),
      annotations: tool.annotations || {},
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const canonicalJson = canonicalJsonStringify(normalizedTools);
  return sha256Hex(canonicalJson);
}

/**
 * Computes the prompt & natural language hash (descriptions_sha256).
 * Any change to tool descriptions, parameter explanations, or examples changes this hash.
 */
export async function computeDescriptionsHash(tools: McpToolDefinition[]): Promise<string> {
  const toolDescriptions = tools
    .map((tool) => {
      const texts: string[] = [];
      if (tool.description) {
        texts.push(`tool_desc:${tool.description.trim()}`);
      }
      extractDescriptions(tool.inputSchema || {}, texts);
      return {
        name: tool.name,
        texts: texts.sort(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const canonicalJson = canonicalJsonStringify(toolDescriptions);
  return sha256Hex(canonicalJson);
}

/**
 * Computes the complete DualHashResult for an array of tools.
 */
export async function computeDualHash(tools: McpToolDefinition[]): Promise<DualHashResult> {
  const [schema_sha256, descriptions_sha256] = await Promise.all([
    computeSchemaHash(tools),
    computeDescriptionsHash(tools),
  ]);

  return {
    schema_sha256,
    descriptions_sha256,
    tool_count: tools.length,
    calculated_at: new Date().toISOString(),
  };
}
