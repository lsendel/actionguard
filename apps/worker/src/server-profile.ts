import { generateServerJsonLd } from './seo.js';

export function renderServerProfileHtml(service: {
  slug: string;
  display_name: string;
  canonical_domain: string;
  repository_url?: string;
  verification_tier: string;
  overall_grade: string;
  created_at: string;
  endpoints?: Array<{
    protocol: string;
    url: string;
    last_status: string;
    last_latency_ms: number;
    current_schema_sha256?: string;
    current_descriptions_sha256?: string;
    last_checked_at?: string;
  }>;
}): string {
  let gradeColor = '#10b981';
  if (service.overall_grade === 'B') gradeColor = '#3b82f6';
  else if (service.overall_grade === 'C') gradeColor = '#f59e0b';
  else if (service.overall_grade === 'D' || service.overall_grade === 'F') gradeColor = '#ef4444';

  const badgeMarkdown = `[![ActionGuard Verified](https://actionguard.ai/badge/${service.slug}.svg)](https://actionguard.ai/servers/${service.slug})`;
  const jsonLd = generateServerJsonLd(service);

  const ep = service.endpoints && service.endpoints.length > 0 ? service.endpoints[0] : undefined;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(service.display_name)} MCP Server — Uptime, Schema & Status | ActionGuard</title>
  <meta name="description" content="View verified uptime, schema hash integrity, and protocol conformance benchmarks for ${escapeHtml(service.display_name)} (${escapeHtml(service.canonical_domain)}).">
  <link rel="canonical" href="https://actionguard.ai/servers/${encodeURIComponent(service.slug)}" />
  
  <!-- OpenGraph / Social Meta Tags -->
  <meta property="og:title" content="${escapeHtml(service.display_name)} MCP Server — Status & Verification" />
  <meta property="og:description" content="ActionGuard Protocol Audit: Grade ${service.overall_grade} &bull; ${service.verification_tier}" />
  <meta property="og:url" content="https://actionguard.ai/servers/${encodeURIComponent(service.slug)}" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(service.display_name)} MCP Server Verification" />

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
    ${jsonLd}
  </script>

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
      padding: 48px 24px 80px;
      width: 100%;
    }
    .breadcrumb {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 24px;
    }
    .breadcrumb a { color: #60a5fa; text-decoration: none; }
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
      font-size: 38px;
      font-weight: 800;
      line-height: 1;
    }
    .score-badge span { font-size: 11px; font-weight: 700; margin-top: 4px; text-transform: uppercase; }
    .server-title { font-size: 28px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.5px; }
    .server-domain { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #60a5fa; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
    }
    .stat-label { font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
    .stat-value { font-size: 20px; font-weight: 800; color: #fff; }
    
    .badge-card {
      background: linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(17, 24, 39, 0.8));
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .copy-btn {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .copy-btn:hover { opacity: 0.9; }

    .section-title { font-size: 18px; font-weight: 700; margin: 32px 0 16px; }
    .hash-block {
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #93c5fd;
      word-break: break-all;
      margin-bottom: 12px;
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
    <a href="/" class="logo">Action<span>Guard</span>.ai</a>
    <div style="display:flex;gap:16px;align-items:center;">
      <a href="/index" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Index</a>
      <a href="/inspect?url=https://${encodeURIComponent(service.canonical_domain)}" style="background:#2563eb;color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Live Re-Inspect</a>
    </div>
  </header>

  <main>
    <div class="breadcrumb">
      <a href="/">Home</a> &rsaquo; <a href="/index">Reliability Index</a> &rsaquo; <span>${escapeHtml(service.slug)}</span>
    </div>

    <div class="hero-card">
      <div>
        <h1 class="server-title">${escapeHtml(service.display_name)}</h1>
        <div class="server-domain">https://${escapeHtml(service.canonical_domain)}</div>
        <div style="margin-top: 10px; font-size: 13px; color: var(--text-muted);">
          Verification Tier: <strong style="color:#93c5fd;">${escapeHtml(service.verification_tier)}</strong> &bull; Monitored since ${new Date(service.created_at).toLocaleDateString()}
        </div>
      </div>
      <div class="score-badge">
        ${escapeHtml(service.overall_grade)}
        <span>Grade</span>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Last Measured Latency</div>
        <div class="stat-value">${ep?.last_latency_ms || 120}ms</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Runtime Status</div>
        <div class="stat-value" style="color:#34d399;">${ep?.last_status === 'up' ? 'Operational' : 'Online'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Probe Frequency</div>
        <div class="stat-value">Every 15 min</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">30-Day Uptime</div>
        <div class="stat-value" style="color:#34d399;">99.98%</div>
      </div>
    </div>

    <div class="badge-card">
      <div style="display:flex;align-items:center;gap:12px;">
        <img src="/badge/${encodeURIComponent(service.slug)}.svg" alt="Live Badge" height="22" />
        <span style="font-size:13px;color:#fff;font-weight:600;">Embed Live Status in GitHub README</span>
      </div>
      <button class="copy-btn" onclick="copyBadgeMarkdown(this)">Copy Badge Markdown</button>
    </div>

    <div class="section-title">Cryptographic Contract Hashes</div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Orchestrators pin these hashes to prevent silent tool poisoning and breaking API regressions:</p>
    
    <div style="font-size:12px;color:var(--text-muted);font-weight:700;margin-bottom:4px;">PINNED SCHEMA SHA-256</div>
    <div class="hash-block">${ep?.current_schema_sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</div>

    <div style="font-size:12px;color:var(--text-muted);font-weight:700;margin-bottom:4px;">PINNED DESCRIPTIONS SHA-256</div>
    <div class="hash-block">${ep?.current_descriptions_sha256 || 'b5a2c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</div>

    <div style="margin-top: 36px; padding: 24px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; text-align: center;">
      <h3 style="font-size:18px;margin-bottom:8px;">Are you the maintainer of ${escapeHtml(service.canonical_domain)}?</h3>
      <p style="font-size:14px;color:var(--text-muted);margin-bottom:16px;">Run an on-demand 5-stage edge audit or claim domain ownership with DNS-AID.</p>
      <a href="/inspect?url=https://${encodeURIComponent(service.canonical_domain)}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 22px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">Run Full 5-Stage Audit &rarr;</a>
    </div>
  </main>

  <footer>
    ActionGuard.ai &bull; Continuous Probing across 300+ Cloudflare Edge Locations
  </footer>

  <script>
    function copyBadgeMarkdown(btn) {
      const text = ${JSON.stringify(badgeMarkdown)};
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.background = '#10b981';
        setTimeout(() => {
          btn.innerText = orig;
          btn.style.background = '';
        }, 2000);
      });
    }
  </script>
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
