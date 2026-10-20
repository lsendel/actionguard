import type { InspectionReport } from '@actionguard/core';

export function renderHomepageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ActionGuard.ai — SSL Labs for AI Agents & MCP Servers</title>
  <meta name="description" content="Evidence-first verification, reliability monitoring, and schema drift detection for Model Context Protocol and Agent2Agent services.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --border: #1f2937;
      --accent: #3b82f6;
      --accent-glow: rgba(59, 130, 246, 0.25);
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --green: #10b981;
      --amber: #f59e0b;
      --red: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }
    .logo {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      text-decoration: none;
    }
    .logo span {
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .shield-badge {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    main {
      flex: 1;
      max-width: 960px;
      margin: 0 auto;
      padding: 60px 24px 80px;
      width: 100%;
    }
    .hero {
      text-align: center;
      margin-bottom: 48px;
    }
    .hero h1 {
      font-size: 48px;
      font-weight: 800;
      letter-spacing: -1.5px;
      line-height: 1.15;
      margin-bottom: 16px;
    }
    .hero p {
      font-size: 18px;
      color: var(--text-muted);
      max-width: 640px;
      margin: 0 auto 32px;
      line-height: 1.6;
    }
    .inspect-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 10px;
      display: flex;
      gap: 10px;
      box-shadow: 0 20px 40px -15px var(--accent-glow);
      max-width: 720px;
      margin: 0 auto 40px;
    }
    .inspect-box input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text);
      font-size: 16px;
      padding: 12px 18px;
      font-family: inherit;
    }
    .inspect-box button {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border: none;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .inspect-box button:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 48px;
    }
    .feature-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }
    .feature-card h3 {
      font-size: 16px;
      margin-bottom: 8px;
      color: #fff;
    }
    .feature-card p {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.5;
    }
    footer {
      border-top: 1px solid var(--border);
      padding: 24px 32px;
      text-align: center;
      font-size: 13px;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <header>
    <a href="/" class="logo">
      Action<span>Guard</span>.ai
    </a>
    <span class="shield-badge">SSL Labs for Agents</span>
  </header>

  <main>
    <div class="hero">
      <h1>Verification, Reliability &amp; Drift Detection for AI Agents</h1>
      <p>Instantly probe any remote MCP server or A2A endpoint. Detect silent schema mutations, audit OAuth 2.1 handshakes, and generate verified manifests in seconds.</p>

      <form action="/inspect" method="GET" class="inspect-box">
        <input type="url" name="url" placeholder="https://example.com/mcp or https://agent.domain.com" required autocomplete="off" />
        <button type="submit">Inspect Protocol</button>
      </form>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <h3>⚡ 5-Stage Edge Probe</h3>
        <p>Probes DNS-AID records, tests MCP Streamable HTTP, measures TTFB latency, and audits OAuth 2.1 discovery.</p>
      </div>
      <div class="feature-card">
        <h3>🛡️ Dual-Hash Fingerprinting</h3>
        <p>Separates structural JSON Schemas from natural-language descriptions to catch prompt-poisoning attacks.</p>
      </div>
      <div class="feature-card">
        <h3>📦 Universal Manifest Compiler</h3>
        <p>Auto-generates official MCP Registry server.json, A2A agent-card.json, and DNS-AID zone records.</p>
      </div>
    </div>
  </main>

  <footer>
    ActionGuard.ai &bull; The Evidence Layer for Machine-Discoverable Services
  </footer>
</body>
</html>`;
}

export function renderReportHtml(report: InspectionReport): string {
  let gradeColor = '#10b981';
  if (report.score.grade === 'B') gradeColor = '#3b82f6';
  else if (report.score.grade === 'C') gradeColor = '#f59e0b';
  else if (report.score.grade === 'D' || report.score.grade === 'F') gradeColor = '#ef4444';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ActionGuard Report: ${report.targetDomain} — Grade ${report.score.grade}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --border: #1f2937;
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --green: #10b981;
      --amber: #f59e0b;
      --red: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 32px 20px 80px;
    }
    .container { max-width: 960px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .back-link { color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 600; }
    .hero-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .score-badge {
      width: 96px;
      height: 96px;
      border-radius: 16px;
      background: ${gradeColor}1a;
      border: 2px solid ${gradeColor};
      color: ${gradeColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: 800;
      line-height: 1;
    }
    .score-badge span { font-size: 13px; font-weight: 600; margin-top: 4px; opacity: 0.9; }
    .target-title { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    .target-url { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-muted); }
    .section-title { font-size: 18px; font-weight: 700; margin: 32px 0 16px; }
    .hashes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .hash-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
    }
    .hash-label { font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 6px; }
    .hash-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; word-break: break-all; color: #60a5fa; }
    .finding-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 12px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .status-pill {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .status-pass { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .status-warn { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .status-fail { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    .finding-content h4 { font-size: 15px; margin-bottom: 4px; }
    .finding-content p { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
    .artifact-block {
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      overflow-x: auto;
      margin-top: 12px;
      color: #e2e8f0;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <a href="/" class="back-link">&larr; Back to Inspector</a>
      <span style="font-size: 13px; color: var(--text-muted);">Report ID: ${report.id}</span>
    </header>

    <div class="hero-card">
      <div>
        <h1 class="target-title">${report.targetDomain}</h1>
        <div class="target-url">${report.targetUrl}</div>
        <div style="margin-top: 12px; font-size: 13px; color: var(--text-muted);">
          Inspected on ${new Date(report.inspectedAt).toUTCString()} &bull; ${report.tools.length} tool(s) &bull; ~${report.tokenCostEstimate} tokens/turn
        </div>
      </div>
      <div class="score-badge">
        ${report.score.grade}
        <span>${report.score.numericalScore}/100</span>
      </div>
    </div>

    <div class="section-title">Cryptographic Dual-Hash Fingerprint</div>
    <div class="hashes-grid">
      <div class="hash-card">
        <div class="hash-label">SCHEMA SHA-256 (Structural Contract)</div>
        <div class="hash-val">${report.hashes.schema_sha256}</div>
      </div>
      <div class="hash-card">
        <div class="hash-label">DESCRIPTIONS SHA-256 (Natural Language &amp; Prompts)</div>
        <div class="hash-val">${report.hashes.descriptions_sha256}</div>
      </div>
    </div>

    <div class="section-title">Inspection Findings (${report.findings.length})</div>
    ${report.findings
      .map(
        (f) => `
      <div class="finding-card">
        <span class="status-pill status-${f.status}">${f.status}</span>
        <div class="finding-content">
          <h4>${f.title}</h4>
          <p>${f.message}</p>
        </div>
      </div>
    `
      )
      .join('')}

    <div class="section-title">Generated Protocol Artifacts</div>
    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">ActionGuard automatically synthesized these compliant manifests from your live endpoint:</p>
    
    <h4 style="margin-top: 20px; font-size: 14px;">1. Official MCP Registry (server.json)</h4>
    <pre class="artifact-block"><code>${escapeHtml(report.generatedArtifacts.mcpServerJson)}</code></pre>

    <h4 style="margin-top: 20px; font-size: 14px;">2. A2A Protocol v1.0 (agent-card.json)</h4>
    <pre class="artifact-block"><code>${escapeHtml(report.generatedArtifacts.a2aAgentCardJson)}</code></pre>

    <h4 style="margin-top: 20px; font-size: 14px;">3. DNS-AID Zone Records (RFC 8552)</h4>
    <pre class="artifact-block"><code>${escapeHtml(report.generatedArtifacts.dnsAidRecords)}</code></pre>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
