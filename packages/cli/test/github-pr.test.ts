import type { InspectionReport } from '@actionguard/core';
import { describe, expect, it } from 'vitest';
import { generatePrCommentMarkdown } from '../src/github-pr.js';

describe('GitHub PR Commenter', () => {
  const mockReport: InspectionReport = {
    id: 'rep_123',
    targetUrl: 'https://example.com/mcp',
    targetDomain: 'example.com',
    inspectedAt: new Date().toISOString(),
    score: {
      numericalScore: 95,
      grade: 'A+',
      passCount: 4,
      warnCount: 0,
      failCount: 0,
    },
    hashes: {
      schema_sha256: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
      descriptions_sha256: 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5',
      tool_count: 3,
      calculated_at: new Date().toISOString(),
    },
    findings: [],
    tools: [
      {
        name: 'search_records',
        description: 'Searches patient records securely',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
    tokenCostEstimate: 120,
    generatedArtifacts: {
      mcpServerJson: '{}',
      a2aAgentCardJson: '{}',
      dnsAidRecords: '',
      actionguardJson: '{}',
      githubActionWorkflow: '',
    },
  };

  it('generates markdown report matching pinned schema hash', () => {
    const md = generatePrCommentMarkdown(
      mockReport,
      'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    );
    expect(md).toContain('## 🛡️ ActionGuard MCP Integrity Report');
    expect(md).toContain('MATCHES PINNED HASH');
    expect(md).toContain('Grade A+');
    expect(md).toContain('<!-- actionguard-ci-comment-signature -->');
    expect(md).toContain('uses: lsendel/actionguard@v1');
  });

  it('generates breaking drift warning when hash mismatches', () => {
    const md = generatePrCommentMarkdown(mockReport, 'differenthazh123');
    expect(md).toContain('BREAKING DRIFT DETECTED');
    expect(md).toContain('Expected Pin:');
    expect(md).toContain('differenthazh123');
    expect(md).toContain('Observed Hash:');
    expect(md).toContain('a1b2c3d4e5f6a1b2');
  });

  it('formats critical findings table when security issues are present', () => {
    const reportWithFail: InspectionReport = {
      ...mockReport,
      score: {
        ...mockReport.score,
        numericalScore: 50,
        grade: 'F',
        failCount: 1,
      },
      findings: [
        {
          id: 'prompt_injection_danger',
          stage: 'security',
          title: 'Direct Prompt Injection Pattern',
          status: 'fail',
          message: 'Tool description contains instruction override payload',
        },
      ],
    };

    const md = generatePrCommentMarkdown(reportWithFail);
    expect(md).toContain('Security & Schema Findings (1)');
    expect(md).toContain('Direct Prompt Injection Pattern');
    expect(md).toContain('instruction override payload');
  });
});
