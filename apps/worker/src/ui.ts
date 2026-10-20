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
      padding: 20px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      background: rgba(9, 13, 22, 0.8);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 50;
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
    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-link {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: color 0.2s;
    }
    .nav-link:hover { color: #fff; }
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
      max-width: 980px;
      margin: 0 auto;
      padding: 60px 24px 80px;
      width: 100%;
    }
    .hero {
      text-align: center;
      margin-bottom: 40px;
    }
    .hero-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 24px;
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
      padding: 8px;
      display: flex;
      gap: 10px;
      box-shadow: 0 20px 40px -15px var(--accent-glow);
      max-width: 720px;
      margin: 0 auto 20px;
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
    .sample-triggers {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 48px;
      font-size: 13px;
      color: var(--text-muted);
    }
    .sample-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: #93c5fd;
      padding: 5px 12px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.15s;
    }
    .sample-btn:hover {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.4);
      color: #fff;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 24px;
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
    <div class="nav-links">
      <a href="/index" class="nav-link">Reliability Index</a>
      <a href="/verify" class="nav-link">Verify Domain</a>
      <a href="/docs/mcp-schema-drift" class="nav-link">Protocol Docs</a>
      <span class="shield-badge">SSL Labs for Agents</span>
    </div>
  </header>

  <main>
    <div class="hero">
      <div class="hero-pill">
        <span>●</span> Continuous Edge Probing &bull; 15-Minute Monitoring Active
      </div>
      <h1>Verification, Reliability &amp; Drift Detection for AI Agents</h1>
      <p>Instantly probe any remote MCP server or A2A endpoint. Detect silent schema mutations, audit OAuth 2.1 handshakes, and generate verified manifests in seconds.</p>

      <form action="/inspect" method="GET" class="inspect-box">
        <input type="url" name="url" placeholder="https://example.com/mcp or https://agent.domain.com" required autocomplete="off" />
        <button type="submit">Inspect Protocol</button>
      </form>

      <div class="sample-triggers">
        <span>Quick Samples:</span>
        <a href="/inspect?url=https%3A%2F%2Fapi.github.com%2Fmcp" class="sample-btn">GitHub MCP</a>
        <a href="/inspect?url=https%3A%2F%2Fanalytics.where.care%2Fmcp" class="sample-btn">Where.Care MCP</a>
        <a href="/inspect?url=https%3A%2F%2Fdemo.actionguard.ai%2Fmcp" class="sample-btn">ActionGuard Demo</a>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <h3>⚡ 5-Stage Edge Probe</h3>
        <p>Probes DNS-AID records, tests MCP Streamable HTTP, measures TTFB latency, and audits OAuth 2.1 challenge headers.</p>
      </div>
      <div class="feature-card">
        <h3>🛡️ Dual-Hash Fingerprinting</h3>
        <p>Separates structural JSON Schemas from natural-language descriptions to catch silent prompt-injection and poisoning attacks.</p>
      </div>
      <div class="feature-card">
        <h3>📦 Universal Manifest Compiler</h3>
        <p>Auto-generates official MCP Registry server.json, A2A agent-card.json, and DNS-AID zone records.</p>
      </div>
    </div>
  </main>

  <footer>
    <div style="display:flex;justify-content:center;gap:20px;margin-bottom:12px;flex-wrap:wrap;">
      <a href="/index" style="color:var(--text-muted);text-decoration:none;">Reliability Index</a>
      <a href="/verify" style="color:var(--text-muted);text-decoration:none;">Claim &amp; Verify Domain</a>
      <a href="/docs/mcp-schema-drift" style="color:var(--text-muted);text-decoration:none;">Schema Drift Guide</a>
      <a href="/docs/a2a-agent-card-generator" style="color:var(--text-muted);text-decoration:none;">A2A Protocol Guide</a>
      <a href="/docs/dns-aid-setup" style="color:var(--text-muted);text-decoration:none;">DNS-AID Setup</a>
      <a href="/sitemap.xml" style="color:var(--text-muted);text-decoration:none;">Sitemap</a>
    </div>
    <div>ActionGuard.ai &bull; Multi-Registry AI Agent Verification &amp; Drift Intelligence</div>
  </footer>
</body>
</html>`;
}

export function renderReportHtml(report: InspectionReport): string {
  let gradeColor = '#10b981';
  if (report.score.grade === 'B') gradeColor = '#3b82f6';
  else if (report.score.grade === 'C') gradeColor = '#f59e0b';
  else if (report.score.grade === 'D' || report.score.grade === 'F') gradeColor = '#ef4444';

  const badgeMarkdown = `[![ActionGuard Verified](https://actionguard.ai/badge/${report.targetDomain}.svg)](https://actionguard.ai/reports/${report.id})`;

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
      --blue: #3b82f6;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 32px 20px 80px;
    }
    .container { max-width: 980px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .nav-left { display: flex; align-items: center; gap: 16px; }
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
      flex-wrap: wrap;
      gap: 20px;
    }
    .score-badge {
      width: 104px;
      height: 104px;
      border-radius: 16px;
      background: ${gradeColor}1a;
      border: 2px solid ${gradeColor};
      color: ${gradeColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 42px;
      font-weight: 800;
      line-height: 1;
    }
    .score-badge span { font-size: 13px; font-weight: 600; margin-top: 4px; opacity: 0.9; }
    .target-title { font-size: 26px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.5px; }
    .target-url { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-muted); word-break: break-all; }
    
    /* Embed Badge Block */
    .badge-card {
      background: linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(17, 24, 39, 0.8));
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .badge-preview {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .badge-code-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #93c5fd;
      max-width: 500px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .copy-btn {
      background: rgba(59, 130, 246, 0.2);
      border: 1px solid rgba(59, 130, 246, 0.4);
      color: #93c5fd;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .copy-btn:hover {
      background: #2563eb;
      color: #fff;
    }

    .section-title { font-size: 18px; font-weight: 700; margin: 32px 0 16px; display: flex; align-items: center; gap: 8px; }
    .hashes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .hash-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
    }
    .hash-label { font-size: 11px; color: var(--text-muted); font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px; }
    .hash-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; word-break: break-all; color: #60a5fa; line-height: 1.4; }
    
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
      letter-spacing: 0.5px;
    }
    .status-pass { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .status-warn { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .status-fail { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    .finding-content h4 { font-size: 15px; margin-bottom: 4px; }
    .finding-content p { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

    /* Tabs Component */
    .tabs-header {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 16px;
      overflow-x: auto;
    }
    .tab-btn {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-muted);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      padding: 10px 16px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    .tab-btn.active {
      color: #60a5fa;
      border-bottom-color: #3b82f6;
    }
    .tab-pane { display: none; }
    .tab-pane.active { display: block; }
    
    .artifact-block-wrap {
      position: relative;
    }
    .artifact-block {
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      overflow-x: auto;
      color: #e2e8f0;
      line-height: 1.6;
    }
    .artifact-copy-btn {
      position: absolute;
      top: 12px;
      right: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="nav-left">
        <a href="/" class="back-link">&larr; New Inspection</a>
        <span style="color: var(--border);">|</span>
        <a href="/index" class="back-link" style="color: var(--text-muted);">View Index</a>
      </div>
      <span style="font-size: 13px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">ID: ${report.id}</span>
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

    <!-- Embed Badge in README Section -->
    <div class="badge-card">
      <div class="badge-preview">
        <img src="/badge/${report.targetDomain}.svg" alt="Live Badge" height="22" />
        <span style="font-size: 13px; font-weight: 600; color: #fff;">Embed in your GitHub README</span>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <div class="badge-code-wrap" id="badgeMarkdownText">${escapeHtml(badgeMarkdown)}</div>
        <button class="copy-btn" onclick="copySnippet('badgeMarkdownText', this)">Copy Markdown</button>
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

    <div class="section-title">Turnkey Generated Protocol Artifacts</div>
    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">ActionGuard automatically compiled these ready-to-commit manifests from your live endpoint:</p>

    <!-- Manifest Tabs -->
    <div class="tabs-header">
      <button class="tab-btn active" onclick="switchTab(0)">server.json (MCP)</button>
      <button class="tab-btn" onclick="switchTab(1)">agent-card.json (A2A)</button>
      <button class="tab-btn" onclick="switchTab(2)">dns-aid.zone (DNS-AID)</button>
      <button class="tab-btn" onclick="switchTab(3)">actionguard.yml (CI Gate)</button>
    </div>

    <div class="tab-pane active" id="tab-0">
      <div class="artifact-block-wrap">
        <button class="copy-btn artifact-copy-btn" onclick="copySnippet('code-mcp', this)">Copy server.json</button>
        <pre class="artifact-block"><code id="code-mcp">${escapeHtml(report.generatedArtifacts.mcpServerJson)}</code></pre>
      </div>
    </div>

    <div class="tab-pane" id="tab-1">
      <div class="artifact-block-wrap">
        <button class="copy-btn artifact-copy-btn" onclick="copySnippet('code-a2a', this)">Copy agent-card.json</button>
        <pre class="artifact-block"><code id="code-a2a">${escapeHtml(report.generatedArtifacts.a2aAgentCardJson)}</code></pre>
      </div>
    </div>

    <div class="tab-pane" id="tab-2">
      <div class="artifact-block-wrap">
        <button class="copy-btn artifact-copy-btn" onclick="copySnippet('code-dns', this)">Copy DNS Records</button>
        <pre class="artifact-block"><code id="code-dns">${escapeHtml(report.generatedArtifacts.dnsAidRecords)}</code></pre>
      </div>
    </div>

    <div class="tab-pane" id="tab-3">
      <div class="artifact-block-wrap">
        <button class="copy-btn artifact-copy-btn" onclick="copySnippet('code-ci', this)">Copy CI Workflow</button>
        <pre class="artifact-block"><code id="code-ci">${escapeHtml(report.generatedArtifacts.githubActionWorkflow)}</code></pre>
      </div>
    </div>

  </div>

  <script>
    function switchTab(index) {
      document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === index);
      });
      document.querySelectorAll('.tab-pane').forEach((pane, idx) => {
        pane.classList.toggle('active', idx === index);
      });
    }

    function copySnippet(elementId, btn) {
      const el = document.getElementById(elementId);
      if (!el) return;
      const text = el.innerText || el.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.background = '#10b981';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.innerText = orig;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      });
    }
  </script>
</body>
</html>`;
}

export function renderIndexHtml(services: Array<{
  slug: string;
  display_name: string;
  canonical_domain: string;
  overall_grade: string;
  verification_tier: string;
  created_at: string;
}>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ActionGuard.ai — Agent Reliability Index</title>
  <meta name="description" content="Public leaderboard of verified, monitored Model Context Protocol (MCP) servers and Agent2Agent endpoints.">
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
      --blue: #3b82f6;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      padding: 20px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }
    .logo {
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      text-decoration: none;
    }
    .logo span {
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    main {
      flex: 1;
      max-width: 980px;
      margin: 0 auto;
      padding: 50px 24px 80px;
      width: 100%;
    }
    .hero { margin-bottom: 36px; }
    .hero h1 { font-size: 36px; font-weight: 800; margin-bottom: 8px; letter-spacing: -1px; }
    .hero p { font-size: 16px; color: var(--text-muted); }
    .table-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    th {
      background: #0f172a;
      padding: 14px 20px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }
    .service-name { font-weight: 700; color: #fff; text-decoration: none; }
    .service-domain { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted); }
    .grade-pill {
      display: inline-block;
      font-size: 13px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      text-align: center;
    }
    .grade-A, .grade-Ap { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .grade-B { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .grade-C { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .grade-D, .grade-F { background: rgba(239, 68, 68, 0.15); color: #f87171; }
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
    <a href="/" class="logo">Action<span>Guard</span>.ai</a>
    <div style="display:flex;gap:16px;align-items:center;">
      <a href="/verify" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Verify Domain</a>
      <a href="/docs/mcp-schema-drift" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Protocol Docs</a>
      <a href="/" style="background:#2563eb;color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Inspect Your Server</a>
    </div>
  </header>

  <main>
    <div class="hero">
      <h1>Agent Reliability Index</h1>
      <p>Verified public registry of Model Context Protocol (MCP) and Agent2Agent endpoints continuously monitored by ActionGuard.</p>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>Service &amp; Domain</th>
            <th>Grade</th>
            <th>Verification</th>
            <th>Live Badge</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${
            services.length === 0
              ? `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:40px;">No verified services indexed yet. <a href="/" style="color:#60a5fa;">Inspect the first one &rarr;</a></td></tr>`
              : services
                  .map((s) => {
                    const gradeClass =
                      s.overall_grade === 'A+' ? 'grade-Ap' : `grade-${s.overall_grade}`;
                    return `
            <tr>
              <td>
                <a href="/servers/${encodeURIComponent(s.slug)}" class="service-name">${escapeHtml(s.display_name)}</a>
                <div class="service-domain">${escapeHtml(s.canonical_domain)}</div>
              </td>
              <td>
                <span class="grade-pill ${gradeClass}">${escapeHtml(s.overall_grade)}</span>
              </td>
              <td>
                <span style="font-size:12px;color:#93c5fd;">${escapeHtml(s.verification_tier)}</span>
              </td>
              <td>
                <a href="/servers/${encodeURIComponent(s.slug)}">
                  <img src="/badge/${encodeURIComponent(s.slug)}.svg" alt="Badge" height="20" />
                </a>
              </td>
              <td>
                <a href="/servers/${encodeURIComponent(s.slug)}" style="color:#60a5fa;text-decoration:none;font-size:13px;font-weight:600;">View Profile &rarr;</a>
              </td>
            </tr>
          `;
                  })
                  .join('')
          }
        </tbody>
      </table>
    </div>
  </main>

  <footer>
    <div style="margin-bottom:8px;">
      <a href="/docs/mcp-schema-drift" style="color:var(--text-muted);text-decoration:none;margin:0 8px;">MCP Schema Drift</a> &bull;
      <a href="/docs/a2a-agent-card-generator" style="color:var(--text-muted);text-decoration:none;margin:0 8px;">A2A Agent Card Guide</a> &bull;
      <a href="/docs/dns-aid-setup" style="color:var(--text-muted);text-decoration:none;margin:0 8px;">DNS-AID Setup</a> &bull;
      <a href="/sitemap.xml" style="color:var(--text-muted);text-decoration:none;margin:0 8px;">Sitemap</a>
    </div>
    ActionGuard.ai &bull; Continuous Probing across 300+ Cloudflare Edge Locations
  </footer>
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
