import fs from 'node:fs';
import type { InspectionReport } from '@actionguard/core';

export function generatePrCommentMarkdown(report: InspectionReport, pinnedHash?: string): string {
  const hasDrift = pinnedHash ? report.hashes.schema_sha256 !== pinnedHash : false;
  const grade = report.score.grade;
  const scoreNum = report.score.numericalScore;

  let gradeEmoji = '🟢';
  if (grade === 'A+' || grade === 'A') gradeEmoji = '🛡️';
  else if (grade === 'B') gradeEmoji = '🔵';
  else if (grade === 'C') gradeEmoji = '🟡';
  else gradeEmoji = '🔴';

  const driftVerdict = !pinnedHash
    ? 'ℹ️ *No pin provided (inspection mode)*'
    : hasDrift
      ? '❌ **BREAKING DRIFT DETECTED**'
      : '✅ **MATCHES PINNED HASH**';

  const criticalIssues = report.findings.filter((f) => f.status === 'fail' || f.status === 'warn');

  let findingsSection = '';
  if (criticalIssues.length > 0) {
    findingsSection = `\n### ⚠️ Security & Schema Findings (${criticalIssues.length})\n\n| Level | Rule | Details |\n| :---: | :--- | :--- |\n`;
    for (const item of criticalIssues) {
      const badge = item.status === 'fail' ? '🔴 `FAIL`' : '🟡 `WARN`';
      findingsSection += `| ${badge} | **${item.title}** | ${item.message} |\n`;
    }
  } else {
    findingsSection = '\n> ✅ **Zero security vulnerabilities or protocol violations detected.**\n';
  }

  const comment = `## 🛡️ ActionGuard MCP Integrity Report

| Metric | Value | Status |
| :--- | :--- | :---: |
| **Security Score** | **Grade ${grade}** (${scoreNum}/100) | ${gradeEmoji} |
| **Integrity Gate** | ${driftVerdict} | ${hasDrift ? '🚨' : '✅'} |
| **Target URL** | \`${report.targetUrl}\` | 🌐 |
| **Tool Count** | **${report.tools.length}** tools declared | 🛠️ |
| **Schema SHA-256** | \`${report.hashes.schema_sha256.substring(0, 16)}...\` | 🔒 |
| **Prompt SHA-256** | \`${report.hashes.descriptions_sha256.substring(0, 16)}...\` | 📝 |

${findingsSection}

${
  hasDrift
    ? `### 🚨 Action Required: Schema Drift Detected
The remote MCP server returned tool definitions differing from your repository's pinned hash.
- **Expected Pin:** \`${pinnedHash}\`
- **Observed Hash:** \`${report.hashes.schema_sha256}\`

If this change was intentional, update your workflow configuration:
\`\`\`yaml
- uses: lsendel/actionguard@v1
  with:
    target_url: '${report.targetUrl}'
    pinned_hash: '${report.hashes.schema_sha256}'
\`\`\`
`
    : `### 📌 Workflow Pin Configuration
Lock this verified schema in your GitHub CI/CD pipeline:
\`\`\`yaml
- uses: lsendel/actionguard@v1
  with:
    target_url: '${report.targetUrl}'
    pinned_hash: '${report.hashes.schema_sha256}'
\`\`\`
`
}

---
*Inspect full diffs & telemetry at [ActionGuard.ai](https://actionguard.ai/diff) &bull; Continuous Zero-Trust Security for AI Agents*
<!-- actionguard-ci-comment-signature -->`;

  return comment;
}

export async function postOrUpdatePrComment(
  report: InspectionReport,
  options: {
    token?: string;
    repo?: string;
    prNumber?: number;
    eventPath?: string;
    pinnedHash?: string;
  } = {},
): Promise<boolean> {
  const token = options.token || process.env.GITHUB_TOKEN;
  if (!token) return false;

  let prNumber = options.prNumber;
  let repo = options.repo || process.env.GITHUB_REPOSITORY;

  // Attempt to parse PR number from event path if available
  const eventPath = options.eventPath || process.env.GITHUB_EVENT_PATH;
  if (eventPath && fs.existsSync(eventPath)) {
    try {
      const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
      if (eventData.pull_request?.number) {
        prNumber = eventData.pull_request.number;
      }
      if (!repo && eventData.repository?.full_name) {
        repo = eventData.repository.full_name;
      }
    } catch {
      // Ignore parse errors
    }
  }

  if (!repo || !prNumber) {
    return false;
  }

  const commentBody = generatePrCommentMarkdown(report, options.pinnedHash);
  const signature = '<!-- actionguard-ci-comment-signature -->';
  const apiUrl = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`;

  try {
    // 1. Search for existing ActionGuard comment to update in-place
    const listRes = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'ActionGuard-CI-Bot/1.0',
      },
    });

    if (listRes.ok) {
      const comments = (await listRes.json()) as Array<{ id: number; body: string }>;
      const existing = comments.find((c) => c.body?.includes(signature));

      if (existing) {
        const updateUrl = `https://api.github.com/repos/${repo}/issues/comments/${existing.id}`;
        const updateRes = await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'ActionGuard-CI-Bot/1.0',
          },
          body: JSON.stringify({ body: commentBody }),
        });
        return updateRes.ok;
      }
    }

    // 2. Otherwise post new comment
    const createRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'ActionGuard-CI-Bot/1.0',
      },
      body: JSON.stringify({ body: commentBody }),
    });

    return createRes.ok;
  } catch (err) {
    console.error('ActionGuard PR Commenter warning:', err instanceof Error ? err.message : err);
    return false;
  }
}
