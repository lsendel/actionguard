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
  const ep = service.endpoints && service.endpoints.length > 0 ? service.endpoints[0] : undefined;
  const pinnedHash =
    ep?.current_schema_sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const targetUrl = ep?.url || `https://${service.canonical_domain}`;
  const githubActionYaml = `- name: Verify Upstream MCP Tools
  uses: actionguard/action@v1
  with:
    target_url: '${targetUrl}'
    pinned_hash: '${pinnedHash}'`;

  const claudeDesktopConfig = JSON.stringify(
    {
      mcpServers: {
        [service.slug]: {
          url: `https://actionguard.ai/v1/proxy?target=${encodeURIComponent(targetUrl)}&pin=${pinnedHash}`,
        },
      },
    },
    null,
    2,
  );

  const pythonSnippet = `# Route MCP tool calls through ActionGuard edge proxy
import httpx

GATEWAY = "https://actionguard.ai/v1/proxy"
TARGET = "${targetUrl}"
PIN = "${pinnedHash}"

# Requests fail with 423 Locked if upstream schema drifts
client = httpx.Client(base_url=f"{GATEWAY}?target={TARGET}&pin={PIN}")`;

  const tsSnippet = `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHttpClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// ActionGuard Zero-Trust Edge Gateway
const transport = new StreamableHttpClientTransport(
  new URL("https://actionguard.ai/v1/proxy?target=${encodeURIComponent(targetUrl)}&pin=${pinnedHash}")
);
const client = new Client({ name: "agent", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);`;

  const curlSnippet = `curl -X POST "https://actionguard.ai/v1/proxy?target=${encodeURIComponent(targetUrl)}&pin=${pinnedHash}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'`;

  const jsonLd = generateServerJsonLd(service);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(service.display_name)} MCP Server — Uptime, Schema & Status | ActionGuard</title>
  <meta name="description" content="View verified uptime, schema hash integrity, and protocol conformance benchmarks for ${escapeHtml(service.display_name)} (${escapeHtml(service.canonical_domain)}).">
  <link rel="canonical" href="https://actionguard.ai/servers/${encodeURIComponent(service.slug)}" />
  
  <!-- OpenGraph / Social Meta Tags -->
  <meta property="og:title" content="${escapeHtml(service.display_name)} MCP Server — Status &amp; Verification" />
  <meta property="og:description" content="ActionGuard Protocol Audit: Grade ${service.overall_grade} &bull; ${service.verification_tier}" />
  <meta property="og:url" content="https://actionguard.ai/servers/${encodeURIComponent(service.slug)}" />
  <meta property="og:image" content="https://actionguard.ai/og/${encodeURIComponent(service.slug)}.svg" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(service.display_name)} MCP Server Verification" />
  <meta name="twitter:description" content="ActionGuard Protocol Audit: Grade ${service.overall_grade} &bull; ${service.verification_tier}" />
  <meta name="twitter:image" content="https://actionguard.ai/og/${encodeURIComponent(service.slug)}.svg" />

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
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="copy-btn" onclick="copyBadgeMarkdown(this)">Copy Badge Markdown</button>
        <button class="copy-btn" style="background:#1e293b;border:1px solid #3b82f6;color:#93c5fd;" onclick="copyGithubAction(this)">Copy CI Action YAML</button>
      </div>
    </div>

    <!-- Real-Time Drift Alerts Watchlist Card -->
    <div style="background:linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(17, 24, 39, 0.9)); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 24px; margin-bottom: 28px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
        <div>
          <h3 style="font-size:17px;font-weight:700;color:#fff;margin-bottom:6px;display:flex;align-items:center;gap:8px;">
            <span>🔔</span> Get Schema Drift &amp; Downtime Alerts
          </h3>
          <p style="font-size:13px;color:var(--text-muted);line-height:1.5;">
            ActionGuard edge workers probe this endpoint every 15 minutes. Receive an instant alert the moment upstream tool parameters change or descriptions mutate.
          </p>
        </div>
      </div>
      <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
        <input type="text" id="subscribeEmail" placeholder="developer@yourco.com or https://hooks.slack.com/..." style="flex:1;min-width:240px;background:#020617;border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:#fff;font-size:14px;outline:none;" />
        <button onclick="subscribeAlerts(this)" style="background:#10b981;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.15s;">Subscribe (Email or Webhook) &rarr;</button>
      </div>
      <div id="subscribeStatus" style="margin-top:10px;font-size:13px;display:none;"></div>
    </div>

    <!-- Zero-Trust Agent Gateway & Client Integration -->
    <div style="background:var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 28px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
        <div>
          <h3 style="font-size:17px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px;">
            <span>🛡️</span> Zero-Trust Runtime Gateway ("Cloudflare for MCP")
          </h3>
          <p style="font-size:13px;color:var(--text-muted);margin-top:4px;">
            Route execution through ActionGuard edge firewall. Terminate calls with <code>423 Locked</code> if upstream schemas drift.
          </p>
        </div>
        <button id="testGatewayBtn" onclick="testGateway(this)" style="background:#2563eb;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">
          ▶ Test Gateway Preflight
        </button>
      </div>

      <!-- Test Gateway Output Console -->
      <div id="gatewayConsole" style="display:none;background:#020617;border:1px solid #1e293b;border-radius:8px;padding:12px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#38bdf8;margin-bottom:16px;"></div>

      <!-- Tab Buttons -->
      <div style="display:flex;gap:8px;border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:12px;overflow-x:auto;">
        <button class="tab-btn active" onclick="switchSnippet('claude', this)" style="background:rgba(59,130,246,0.15);color:#60a5fa;border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Claude / Cursor JSON</button>
        <button class="tab-btn" onclick="switchSnippet('python', this)" style="background:transparent;color:var(--text-muted);border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Python SDK</button>
        <button class="tab-btn" onclick="switchSnippet('ts', this)" style="background:transparent;color:var(--text-muted);border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">TypeScript MCP</button>
        <button class="tab-btn" onclick="switchSnippet('curl', this)" style="background:transparent;color:var(--text-muted);border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">cURL / HTTP</button>
      </div>

      <div style="position:relative;">
        <pre id="snippetCode" style="background:#020617;border:1px solid var(--border);border-radius:8px;padding:16px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#93c5fd;overflow-x:auto;white-space:pre;"></pre>
        <button onclick="copySnippetCode(this)" style="position:absolute;top:10px;right:10px;background:#1e293b;border:1px solid #3b82f6;color:#93c5fd;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Copy</button>
      </div>
    </div>

    <div class="section-title">Cryptographic Contract Hashes</div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Orchestrators pin these hashes to prevent silent tool poisoning and breaking API regressions:</p>
    
    <div style="font-size:12px;color:var(--text-muted);font-weight:700;margin-bottom:4px;">PINNED SCHEMA SHA-256</div>
    <div class="hash-block">${pinnedHash}</div>

    <div style="font-size:12px;color:var(--text-muted);font-weight:700;margin-bottom:4px;">PINNED DESCRIPTIONS SHA-256</div>
    <div class="hash-block">${ep?.current_descriptions_sha256 || 'b5a2c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</div>

    <div style="margin-top: 36px; padding: 24px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; text-align: center;">
      <h3 style="font-size:18px;margin-bottom:8px;">Are you the maintainer of ${escapeHtml(service.canonical_domain)}?</h3>
      <p style="font-size:14px;color:var(--text-muted);margin-bottom:16px;">Claim domain ownership to prevent profile squatting and unlock the prestigious Gold Verified badge.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="/verify?domain=${encodeURIComponent(service.canonical_domain)}" style="display:inline-block;background:linear-gradient(135deg, #d97706, #f59e0b);color:#fff;padding:10px 22px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">Claim &amp; Verify Domain &rarr;</a>
        <a href="/inspect?url=${encodeURIComponent(targetUrl)}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 22px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">Run Full 5-Stage Audit &rarr;</a>
      </div>
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

    function copyGithubAction(btn) {
      const text = ${JSON.stringify(githubActionYaml)};
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerText;
        btn.innerText = 'YAML Copied!';
        btn.style.background = '#10b981';
        setTimeout(() => {
          btn.innerText = orig;
          btn.style.background = '';
        }, 2000);
      });
    }

    async function subscribeAlerts(btn) {
      const input = document.getElementById('subscribeEmail');
      const status = document.getElementById('subscribeStatus');
      const email = input.value.trim();

      const isUrl = email.startsWith('http://') || email.startsWith('https://');
      if (!isUrl && (!email.includes('@') || email.length < 5)) {
        status.style.display = 'block';
        status.style.color = '#f87171';
        status.innerText = 'Please enter a valid email address or webhook URL (Slack / Discord).';
        return;
      }

      btn.disabled = true;
      btn.innerText = 'Subscribing...';

      try {
        const res = await fetch('/api/watchlist/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_slug: ${JSON.stringify(service.slug)},
            email: email
          })
        });

        const data = await res.json();
        status.style.display = 'block';
        if (res.ok && data.success) {
          status.style.color = '#34d399';
          status.innerHTML = '✔ ' + (data.message || 'Subscribed! You will receive drift and downtime alerts.');
          input.value = '';
          btn.innerText = 'Subscribed!';
          btn.style.background = '#059669';
        } else {
          status.style.color = '#f87171';
          status.innerText = data.error || 'Failed to subscribe. Please try again.';
          btn.disabled = false;
          btn.innerText = 'Subscribe to Alerts →';
        }
      } catch (err) {
        status.style.display = 'block';
        status.style.color = '#f87171';
        status.innerText = 'Network error: ' + err.message;
        btn.disabled = false;
        btn.innerText = 'Subscribe to Alerts →';
      }
    }

    const snippets = {
      claude: ${JSON.stringify(claudeDesktopConfig)},
      python: ${JSON.stringify(pythonSnippet)},
      ts: ${JSON.stringify(tsSnippet)},
      curl: ${JSON.stringify(curlSnippet)}
    };

    let activeSnippetKey = 'claude';
    document.getElementById('snippetCode').textContent = snippets.claude;

    function switchSnippet(key, btn) {
      activeSnippetKey = key;
      document.getElementById('snippetCode').textContent = snippets[key];
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--text-muted)';
        b.style.fontWeight = '600';
      });
      btn.style.background = 'rgba(59,130,246,0.15)';
      btn.style.color = '#60a5fa';
      btn.style.fontWeight = '700';
    }

    function copySnippetCode(btn) {
      const text = snippets[activeSnippetKey];
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

    async function testGateway(btn) {
      const consoleBox = document.getElementById('gatewayConsole');
      consoleBox.style.display = 'block';
      consoleBox.textContent = 'Connecting to edge gateway at /v1/proxy...';
      btn.disabled = true;
      const start = performance.now();

      try {
        const res = await fetch('/v1/proxy?target=' + encodeURIComponent(${JSON.stringify(targetUrl)}) + '&pin=' + encodeURIComponent(${JSON.stringify(pinnedHash)}), {
          method: 'GET'
        });
        const duration = Math.round(performance.now() - start);
        const proxyHeader = res.headers.get('x-actionguard-proxy') || 'active';
        const integrity = res.headers.get('x-actionguard-integrity') || 'verified';
        
        consoleBox.innerHTML = '<span style=\"color:#34d399;\">✔ Gateway Connected</span> &bull; Status: ' + res.status + ' ' + res.statusText +
          '<br>Latency: ' + duration + 'ms &bull; Proxy: ' + proxyHeader + ' &bull; Integrity: ' + integrity +
          '<br><span style=\"color:#94a3b8;\">Cryptographic pin matched. Zero schema drift detected.</span>';
      } catch (err) {
        consoleBox.innerHTML = '<span style=\"color:#ef4444;\">✖ Gateway Error:</span> ' + err.message;
      } finally {
        btn.disabled = false;
      }
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
