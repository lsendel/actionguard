import type { LintFinding, McpToolDefinition } from '../types.js';

export function lintSchemaStrictness(tools: McpToolDefinition[]): LintFinding[] {
  const findings: LintFinding[] = [];

  if (tools.length === 0) {
    findings.push({
      id: 'schema_no_tools',
      stage: 'schema',
      title: 'No Tools Advertised',
      status: 'warn',
      message: 'Server advertised 0 tools during inspection. Verify that tools/list is enabled and accessible.',
    });
    return findings;
  }

  findings.push({
    id: 'schema_tool_count',
    stage: 'schema',
    title: 'Tool Inventory',
    status: 'pass',
    message: `Server successfully advertised ${tools.length} tool${tools.length === 1 ? '' : 's'}.`,
    details: { count: tools.length },
  });

  let missingDescriptions = 0;
  let missingParamTypes = 0;
  let missingAnnotations = 0;

  for (const tool of tools) {
    if (!tool.description || tool.description.trim().length === 0) {
      missingDescriptions++;
    }

    // Check annotations
    if (!tool.annotations || Object.keys(tool.annotations).length === 0) {
      missingAnnotations++;
    }

    // Check parameters
    const schema = tool.inputSchema;
    if (schema && typeof schema === 'object') {
      const props = schema.properties as Record<string, { type?: string }> | undefined;
      if (props && typeof props === 'object') {
        for (const [propName, propVal] of Object.entries(props)) {
          if (!propVal || typeof propVal !== 'object' || !propVal.type) {
            missingParamTypes++;
          }
        }
      }
    }
  }

  // Findings for descriptions
  if (missingDescriptions > 0) {
    findings.push({
      id: 'schema_missing_descriptions',
      stage: 'schema',
      title: 'Tools Missing Descriptions',
      status: 'warn',
      message: `${missingDescriptions} of ${tools.length} tools lack a description. Orchestrators may struggle to select them reliably.`,
      details: { missingDescriptions, totalTools: tools.length },
    });
  } else {
    findings.push({
      id: 'schema_descriptions_complete',
      stage: 'schema',
      title: 'Tool Descriptions',
      status: 'pass',
      message: 'All tools provide clear natural-language descriptions.',
    });
  }

  // Findings for parameter types
  if (missingParamTypes > 0) {
    findings.push({
      id: 'schema_missing_types',
      stage: 'schema',
      title: 'Untyped Input Parameters',
      status: 'warn',
      message: `${missingParamTypes} parameter(s) lack an explicit "type" declaration in inputSchema.`,
      details: { missingParamTypes },
    });
  } else {
    findings.push({
      id: 'schema_types_complete',
      stage: 'schema',
      title: 'Parameter Type Safety',
      status: 'pass',
      message: 'All tool input parameters include explicit type definitions.',
    });
  }

  // Findings for annotations
  if (missingAnnotations > 0) {
    findings.push({
      id: 'schema_missing_annotations',
      stage: 'schema',
      title: 'MCP Tool Annotations',
      status: 'warn',
      message: `${missingAnnotations} of ${tools.length} tools lack MCP behavior annotations (e.g. readOnlyHint, destructiveHint, idempotentHint).`,
      details: { missingAnnotations, totalTools: tools.length },
    });
  } else {
    findings.push({
      id: 'schema_annotations_complete',
      stage: 'schema',
      title: 'MCP Tool Annotations',
      status: 'pass',
      message: 'Tools declare explicit behavioral annotations (readOnlyHint, destructiveHint).',
    });
  }

  return findings;
}
