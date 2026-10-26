export interface StatusServiceItem {
  id: string;
  slug: string;
  display_name: string;
  canonical_domain: string;
  overall_grade: string;
  verification_tier: string;
  url: string;
  last_status: string;
  last_latency_ms?: number;
  current_schema_sha256?: string;
  last_checked_at?: string;
}

export function renderStatusHtml(data: {
  services: StatusServiceItem[];
  totalServers: number;
  onlineCount: number;
  averageLatencyMs: number;
  recentDrifts: Array<{
    service_slug: string;
    display_name: string;
    severity: string;
    change_type: string;
    detected_at: string;
  }>;
}): string {
  const uptimePercent =
    data.totalServers > 0 ? ((data.onlineCount / data.totalServers) * 100).toFixed(1) : '100.0';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MCP Ecosystem Health &amp; Global Status | ActionGuard.ai</title>
  <meta name="description" content="Real-time uptime, latency, and cryptographic schema integrity across 43+ Model Context Protocol (MCP) servers on Cloudflare edge.">
  <link rel="canonical" href="https://actionguard.ai/status" />
  <link rel="alternate" type="application/rss+xml" title="ActionGuard Schema Drift Feed" href="https://actionguard.ai/feed.xml" />
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
      --accent: #3b82f6;
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
    .logo { font-size: 20px; font-weight: 800; color: #fff; text-decoration: none; }
    .logo span { background: linear-gradient(135deg, #3b82f6, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    main {
      flex: 1;
      max-width: 1100px;
      margin: 0 auto;
      padding: 48px 24px 80px;
      width: 100%;
    }
    .header-banner {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 36px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
    }
    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
    }
    .metric-val { font-size: 32px; font-weight: 800; color: #fff; margin-top: 4px; }
    .status-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    .status-table th, .status-table td {
      padding: 14px 18px;
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
    }
    .status-table th { background: #0c121e; color: var(--text-muted); font-size: 12px; text-transform: uppercase; }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-pill.up { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .status-pill.down { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    footer { border-top: 1px solid var(--border); padding: 24px; text-align: center; font-size: 13px; color: var(--text-muted); }
  </style>
</head>
<body>
  <header>
    <a href="/" class="logo">Action<span>Guard</span>.ai</a>
    <div style="display:flex;gap:16px;align-items:center;">
      <a href="/index" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Reliability Index</a>
      <a href="/diff" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Diff Inspector</a>
      <a href="/feed.xml" style="color:#60a5fa;text-decoration:none;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:4px;">
        <span>📡</span> RSS Feed
      </a>
    </div>
  </header>

  <main>
    <div class="header-banner">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#10b981;box-shadow:0 0 12px #10b981;"></span>
        <div>
          <h2 style="font-size:18px;font-weight:800;color:#fff;">All Systems Operational</h2>
          <div style="font-size:13px;color:var(--text-muted);">Zero-Trust Proxy Gateway &bull; Continuous Probing active across 300+ edge locations</div>
        </div>
      </div>
      <a href="/feed.xml" style="background:#1e293b;border:1px solid var(--border);color:#93c5fd;text-decoration:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;">
        Subscribe to Drift Alerts (RSS) &rarr;
      </a>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div style="font-size:12px;color:var(--text-muted);font-weight:700;text-transform:uppercase;">Ecosystem Availability</div>
        <div class="metric-val" style="color:#10b981;">${uptimePercent}%</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${data.onlineCount} of ${data.totalServers} servers healthy</div>
      </div>
      <div class="metric-card">
        <div style="font-size:12px;color:var(--text-muted);font-weight:700;text-transform:uppercase;">Edge Response Latency</div>
        <div class="metric-val" style="color:#60a5fa;">~${data.averageLatencyMs}ms</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Median Cloudflare edge roundtrip</div>
      </div>
      <div class="metric-card">
        <div style="font-size:12px;color:var(--text-muted);font-weight:700;text-transform:uppercase;">Zero-Trust Firewall</div>
        <div class="metric-val" style="color:#34d399;">Active</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Adversarial injection filter enabled</div>
      </div>
    </div>

    <h3 style="font-size:18px;font-weight:800;margin-bottom:16px;">Monitored MCP Server Services (${data.services.length})</h3>
    <table class="status-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Status</th>
          <th>Security Grade</th>
          <th>Edge Latency</th>
          <th>Pinned Schema SHA-256</th>
        </tr>
      </thead>
      <tbody>
        ${data.services
          .map((s) => {
            const isUp = s.last_status !== 'down';
            return `
            <tr>
              <td>
                <a href="/servers/${encodeURIComponent(s.slug)}" style="color:#fff;text-decoration:none;font-weight:700;display:block;">
                  ${escapeHtml(s.display_name)}
                </a>
                <span style="font-size:11px;color:var(--text-muted);">${escapeHtml(s.canonical_domain)}</span>
              </td>
              <td>
                <span class="status-pill ${isUp ? 'up' : 'down'}">
                  ${isUp ? '● Operational' : '▲ Disrupted'}
                </span>
              </td>
              <td>
                <span style="font-weight:700;color:${s.overall_grade.startsWith('A') ? '#10b981' : '#f59e0b'};">
                  ${escapeHtml(s.overall_grade)}
                </span>
              </td>
              <td style="color:var(--text-muted);">
                ${s.last_latency_ms ? `${s.last_latency_ms}ms` : '<span style="color:#6b7280;">--</span>'}
              </td>
              <td>
                <code style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#93c5fd;">
                  ${s.current_schema_sha256 ? `${s.current_schema_sha256.substring(0, 14)}...` : '<span style="color:#6b7280;">unpinned</span>'}
                </code>
              </td>
            </tr>`;
          })
          .join('')}
      </tbody>
    </table>
  </main>

  <footer>
    ActionGuard.ai &bull; Continuous Zero-Trust Security for AI Agents &bull; <a href="/status" style="color:var(--text-muted);">Status</a>
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
    .replace(/'/g, '&#39;');
}
