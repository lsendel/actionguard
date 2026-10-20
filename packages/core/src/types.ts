import { z } from 'zod';

export interface McpToolAnnotations {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

export interface McpToolDefinition {
  name: string;
  description?: string;
  inputSchema: {
    type?: string;
    properties?: Record<string, unknown>;
    required?: string[];
    [key: string]: unknown;
  };
  annotations?: McpToolAnnotations;
  [key: string]: unknown;
}

export interface A2ASkillDefinition {
  id: string;
  name?: string;
  description?: string;
  tags?: string[];
  examples?: string[];
  [key: string]: unknown;
}

export interface DualHashResult {
  schema_sha256: string;
  descriptions_sha256: string;
  tool_count: number;
  calculated_at: string;
}

export type DriftSeverity = 'breaking' | 'security_warning' | 'non_breaking';

export type DriftChangeType =
  | 'tool_removed'
  | 'schema_modified'
  | 'description_mutated'
  | 'annotation_regressed'
  | 'tool_added';

export interface DriftChange {
  toolId: string;
  changeType: DriftChangeType;
  severity: DriftSeverity;
  message: string;
  details?: Record<string, unknown>;
}

export interface DriftDiffResult {
  hasDrift: boolean;
  severity: DriftSeverity | 'none';
  changes: DriftChange[];
  schemaChanged: boolean;
  descriptionsChanged: boolean;
}

export type LintStatus = 'pass' | 'warn' | 'fail';

export interface LintFinding {
  id: string;
  stage: 'identity' | 'transport' | 'schema' | 'security';
  title: string;
  status: LintStatus;
  message: string;
  details?: unknown;
}

export type ScoreGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface InspectionScore {
  numericalScore: number; // 0 - 100
  grade: ScoreGrade;
  passCount: number;
  warnCount: number;
  failCount: number;
}

export interface GeneratedArtifacts {
  mcpServerJson: string;
  a2aAgentCardJson: string;
  dnsAidRecords: string;
  actionguardJson: string;
  githubActionWorkflow: string;
}

export interface InspectionReport {
  id: string;
  targetUrl: string;
  targetDomain: string;
  inspectedAt: string;
  score: InspectionScore;
  hashes: DualHashResult;
  findings: LintFinding[];
  tools: McpToolDefinition[];
  tokenCostEstimate: number;
  generatedArtifacts: GeneratedArtifacts;
}

export const ActionGuardManifestSchema = z.object({
  $schema: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  version: z.string().regex(/^\d+\.\d+\.\d+/, 'Must follow semantic versioning (e.g. 1.0.0)'),
  domain: z.string().min(1, 'Domain is required'),
  repository: z
    .object({
      url: z.string().url(),
      source: z.string().default('github'),
    })
    .optional(),
  provider: z
    .object({
      organization: z.string().min(1),
      url: z.string().url().optional(),
      contact: z.string().email().optional(),
    })
    .optional(),
  endpoints: z.array(
    z.object({
      protocol: z.enum(['mcp', 'a2a']),
      transport: z.enum(['streamable-http', 'sse', 'stdio']).optional(),
      binding: z.enum(['JSONRPC', 'HTTP+JSON', 'GRPC']).optional(),
      url: z.string().url(),
      auth: z
        .object({
          type: z.enum(['none', 'oauth2', 'bearer', 'api_key']),
          authorizationServer: z.string().url().optional(),
          scopes: z.array(z.string()).optional(),
        })
        .optional(),
    })
  ),
  capabilities: z.object({
    tools: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().optional(),
        description: z.string().default(''),
        annotations: z
          .object({
            readOnlyHint: z.boolean().optional(),
            destructiveHint: z.boolean().optional(),
            idempotentHint: z.boolean().optional(),
            openWorldHint: z.boolean().optional(),
          })
          .optional(),
        inputSchema: z.record(z.unknown()).default({ type: 'object' }),
        compliance: z.array(z.string()).optional(),
        examples: z.array(z.string()).optional(),
      })
    ),
  }),
  dnsAid: z
    .object({
      enabled: z.boolean().default(true),
      agentPrefix: z.string().default('agent'),
      zone: z.string().min(1),
    })
    .optional(),
});

export type ActionGuardManifest = z.infer<typeof ActionGuardManifestSchema>;
