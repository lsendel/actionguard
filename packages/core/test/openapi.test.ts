import { describe, expect, it } from 'vitest';
import { convertOpenApiToMcp } from '../src/compiler/openapi.js';

describe('OpenAPI to MCP Converter', () => {
  const sampleSpec = {
    openapi: '3.0.3',
    info: {
      title: 'Customer Data API',
      description: 'Production customer management microservice',
      version: '2.0.0',
    },
    paths: {
      '/customers': {
        get: {
          operationId: 'list_customers',
          summary: 'List active customers with optional search filtering',
          parameters: [
            {
              name: 'query',
              in: 'query',
              description: 'Search string',
              required: false,
              schema: { type: 'string' },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Maximum number of records to return',
              required: true,
              schema: { type: 'number' },
            },
          ],
        },
        post: {
          operationId: 'create_customer',
          summary: 'Creates a new enterprise customer record',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Company name' },
                    email: { type: 'string', description: 'Primary contact email' },
                  },
                  required: ['name', 'email'],
                },
              },
            },
          },
        },
      },
    },
  };

  it('converts OpenAPI operations to MCP tools with strict parameters', () => {
    const result = convertOpenApiToMcp(sampleSpec);

    expect(result.projectName).toBe('customer-data-api');
    expect(result.tools.length).toBe(2);

    const listTool = result.tools.find((t) => t.name === 'list_customers');
    expect(listTool).toBeDefined();
    expect(listTool?.description).toContain('List active customers');
    expect(listTool?.inputSchema.properties?.query).toBeDefined();
    expect(listTool?.inputSchema.required).toEqual(['limit']);

    const createTool = result.tools.find((t) => t.name === 'create_customer');
    expect(createTool).toBeDefined();
    expect(createTool?.inputSchema.properties?.name).toBeDefined();
    expect(createTool?.inputSchema.properties?.email).toBeDefined();
    expect(createTool?.inputSchema.required).toEqual(['name', 'email']);
  });

  it('generates standard ActionGuard manifest metadata', () => {
    const result = convertOpenApiToMcp(JSON.stringify(sampleSpec));
    expect(result.manifest.name).toBe('customer-data-api');
    expect(result.manifest.version).toBe('2.0.0');
    expect(result.manifest.tools.length).toBe(2);
  });
});
