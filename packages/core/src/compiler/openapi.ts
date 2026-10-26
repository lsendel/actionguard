import type { McpToolDefinition } from '../types.js';

export interface OpenApiConversionResult {
  projectName: string;
  title: string;
  description: string;
  tools: McpToolDefinition[];
  manifest: {
    name: string;
    title: string;
    description: string;
    version: string;
    tools: McpToolDefinition[];
  };
}

interface OpenApiOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: Array<{
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    description?: string;
    required?: boolean;
    schema?: {
      type?: string;
      description?: string;
      enum?: unknown[];
    };
  }>;
  requestBody?: {
    required?: boolean;
    description?: string;
    content?: {
      'application/json'?: {
        schema?: {
          type?: string;
          properties?: Record<string, unknown>;
          required?: string[];
        };
      };
    };
  };
}

export function convertOpenApiToMcp(
  rawSpec: string | Record<string, unknown>,
): OpenApiConversionResult {
  const spec = (typeof rawSpec === 'string' ? JSON.parse(rawSpec) : rawSpec) as {
    info?: { title?: string; description?: string; version?: string };
    paths?: Record<string, Record<string, OpenApiOperation>>;
  };

  const title = spec.info?.title || 'OpenAPI Microservice';
  const description =
    spec.info?.description || 'Auto-converted OpenAPI service exposed as an MCP agent server.';
  const version = spec.info?.version || '1.0.0';
  const projectName = title.toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  const tools: McpToolDefinition[] = [];
  const paths = spec.paths || {};

  for (const [pathStr, methods] of Object.entries(paths)) {
    if (!methods || typeof methods !== 'object') continue;

    for (const [method, op] of Object.entries(methods)) {
      if (['parameters', 'summary', 'description'].includes(method)) continue;
      if (!op || typeof op !== 'object') continue;

      const operation = op as OpenApiOperation;
      const toolName =
        operation.operationId ||
        `${method}_${pathStr.replace(/[^a-zA-Z0-9]/g, '_')}`.replace(/_+/g, '_').toLowerCase();

      const toolDescription =
        operation.summary ||
        operation.description ||
        `Executes ${method.toUpperCase()} request on ${pathStr}`;

      const properties: Record<string, unknown> = {};
      const required: string[] = [];

      // Process parameters (path, query, header)
      if (Array.isArray(operation.parameters)) {
        for (const p of operation.parameters) {
          if (!p.name) continue;
          properties[p.name] = {
            type: p.schema?.type || 'string',
            description: p.description || `Parameter ${p.name} in ${p.in}`,
            ...(p.schema?.enum ? { enum: p.schema.enum } : {}),
          };
          if (p.required) {
            required.push(p.name);
          }
        }
      }

      // Process requestBody (JSON schema)
      const jsonSchema = operation.requestBody?.content?.['application/json']?.schema;
      if (jsonSchema?.properties) {
        for (const [propName, propVal] of Object.entries(jsonSchema.properties)) {
          properties[propName] = propVal;
        }
        if (Array.isArray(jsonSchema.required)) {
          for (const reqField of jsonSchema.required) {
            if (!required.includes(reqField)) {
              required.push(reqField);
            }
          }
        }
      }

      tools.push({
        name: toolName,
        description: toolDescription,
        inputSchema: {
          type: 'object',
          properties,
          required: required.length > 0 ? required : undefined,
        },
      });
    }
  }

  return {
    projectName,
    title,
    description,
    tools,
    manifest: {
      name: projectName,
      title,
      description,
      version,
      tools,
    },
  };
}
