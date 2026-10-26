export type SupportedIde = 'claude' | 'cursor' | 'vscode' | 'zed' | 'windsurf';

export function generateIdeConfig(
  ide: SupportedIde,
  service: {
    slug: string;
    name: string;
    url: string;
    pinnedHash?: string | null;
  },
  useProxy = true,
): string {
  const targetUrl = useProxy
    ? `https://actionguard.ai/proxy/${service.slug}`
    : service.url || `https://${service.slug}.example.com/mcp`;

  const headers: Record<string, string> = {};
  if (useProxy && service.pinnedHash) {
    headers['x-actionguard-pin'] = service.pinnedHash;
  }

  switch (ide) {
    case 'claude':
      return JSON.stringify(
        {
          mcpServers: {
            [service.slug]: {
              url: targetUrl,
              ...(Object.keys(headers).length > 0 ? { headers } : {}),
            },
          },
        },
        null,
        2,
      );

    case 'cursor':
      return JSON.stringify(
        {
          mcpServers: {
            [service.slug]: {
              url: targetUrl,
              ...(Object.keys(headers).length > 0 ? { headers } : {}),
            },
          },
        },
        null,
        2,
      );

    case 'vscode':
      return JSON.stringify(
        {
          'mcp.servers': {
            [service.slug]: {
              url: targetUrl,
              ...(Object.keys(headers).length > 0 ? { headers } : {}),
            },
          },
        },
        null,
        2,
      );

    case 'zed':
      return JSON.stringify(
        {
          context_servers: {
            [service.slug]: {
              endpoint: targetUrl,
              ...(Object.keys(headers).length > 0 ? { headers } : {}),
            },
          },
        },
        null,
        2,
      );

    case 'windsurf':
      return JSON.stringify(
        {
          mcpServers: {
            [service.slug]: {
              serverUrl: targetUrl,
              ...(Object.keys(headers).length > 0 ? { headers } : {}),
            },
          },
        },
        null,
        2,
      );
  }
}

export function renderConnectHtml(service?: {
  slug: string;
  name: string;
  url: string;
  pinnedHash?: string | null;
}): string {
  const initialSlug = service?.slug || 'sequentialthinking-mcp';
  const initialName = service?.name || 'Sequential Thinking MCP';
  const initialUrl = service?.url || 'https://sequentialthinking.mcp.modelcontextprotocol.io/mcp';
  const initialPin =
    service?.pinnedHash || 'a332729b0c307c465918a755016755db9389cce8aa53b75c706cf690bf7d4988';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connect AI Agent Client | ActionGuard.ai</title>
  <meta name="description" content="Generate 1-click MCP configurations for Claude Desktop, Cursor, VS Code, Zed, and Windsurf with Zero-Trust firewall protection.">
  <link rel="canonical" href="https://actionguard.ai/connect" />
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
      max-width: 860px;
      margin: 0 auto;
      padding: 48px 24px 80px;
      width: 100%;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      margin-top: 24px;
    }
    .tab-btn {
      background: #1e293b;
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .tab-btn.active {
      background: #2563eb;
      color: #fff;
      border-color: #2563eb;
    }
    pre {
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #93c5fd;
      overflow-x: auto;
      margin-top: 16px;
    }
    .toggle-box {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 20px;
      padding: 12px 16px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 8px;
      font-size: 13px;
      color: #34d399;
    }
    footer { border-top: 1px solid var(--border); padding: 24px; text-align: center; font-size: 13px; color: var(--text-muted); }
  </style>
</head>
<body>
  <header>
    <a href="/" class="logo">Action<span>Guard</span>.ai</a>
    <div style="display:flex;gap:16px;align-items:center;">
      <a href="/index" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Reliability Index</a>
      <a href="/diff" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Diff Inspector</a>
      <a href="/status" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Status</a>
    </div>
  </header>

  <main>
    <h1 style="font-size:32px;font-weight:800;letter-spacing:-1px;margin-bottom:8px;">1-Click Agent Client Configurator</h1>
    <p style="color:var(--text-muted);font-size:15px;">Generate pre-configured connection files for Claude Desktop, Cursor, VS Code, Zed, and Windsurf with optional Zero-Trust firewall protection.</p>

    <div class="card">
      <div style="margin-bottom:20px;">
        <label style="display:block;font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:6px;text-transform:uppercase;">Selected MCP Server Service</label>
        <div style="font-size:16px;font-weight:700;color:#fff;">${initialName} (<code style="font-family:'JetBrains Mono',monospace;color:#60a5fa;font-size:14px;">${initialSlug}</code>)</div>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <button class="tab-btn active" onclick="selectTab('claude')">Claude Desktop</button>
        <button class="tab-btn" onclick="selectTab('cursor')">Cursor</button>
        <button class="tab-btn" onclick="selectTab('vscode')">VS Code</button>
        <button class="tab-btn" onclick="selectTab('zed')">Zed</button>
        <button class="tab-btn" onclick="selectTab('windsurf')">Windsurf</button>
      </div>

      <div class="toggle-box">
        <input type="checkbox" id="useProxyToggle" checked onchange="updateSnippet()" />
        <label for="useProxyToggle" style="cursor:pointer;font-weight:600;">
          Route via ActionGuard Zero-Trust Firewall (Protects against breaking drift &amp; adversarial prompt injection)
        </label>
      </div>

      <div style="position:relative;margin-top:16px;">
        <pre id="configCode"></pre>
        <button onclick="copySnippet()" style="position:absolute;top:12px;right:12px;background:#2563eb;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">
          Copy Config
        </button>
      </div>
      <div id="filePathInfo" style="font-size:12px;color:var(--text-muted);margin-top:8px;"></div>
    </div>
  </main>

  <footer>
    ActionGuard.ai &bull; Continuous Zero-Trust Security for AI Agents &bull; <a href="/sitemap.xml" style="color:var(--text-muted);">Sitemap</a>
  </footer>

  <script>
    const service = {
      slug: ${JSON.stringify(initialSlug)},
      name: ${JSON.stringify(initialName)},
      url: ${JSON.stringify(initialUrl)},
      pinnedHash: ${JSON.stringify(initialPin)}
    };

    let activeIde = 'claude';

    const pathMap = {
      claude: 'Paste into: ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)',
      cursor: 'Paste into: .cursor/mcp.json or Cursor MCP Settings',
      vscode: 'Paste into: .vscode/settings.json',
      zed: 'Paste into: ~/.config/zed/settings.json',
      windsurf: 'Paste into: ~/.codeium/windsurf/mcp_config.json'
    };

    function updateSnippet() {
      const useProxy = document.getElementById('useProxyToggle').checked;
      const targetUrl = useProxy ? ('https://actionguard.ai/proxy/' + service.slug) : service.url;
      const headers = (useProxy && service.pinnedHash) ? { 'x-actionguard-pin': service.pinnedHash } : undefined;

      let cfg = {};
      if (activeIde === 'claude' || activeIde === 'cursor') {
        cfg = { mcpServers: { [service.slug]: { url: targetUrl, ...(headers ? { headers } : {}) } } };
      } else if (activeIde === 'vscode') {
        cfg = { 'mcp.servers': { [service.slug]: { url: targetUrl, ...(headers ? { headers } : {}) } } };
      } else if (activeIde === 'zed') {
        cfg = { context_servers: { [service.slug]: { endpoint: targetUrl, ...(headers ? { headers } : {}) } } };
      } else if (activeIde === 'windsurf') {
        cfg = { mcpServers: { [service.slug]: { serverUrl: targetUrl, ...(headers ? { headers } : {}) } } };
      }

      document.getElementById('configCode').innerText = JSON.stringify(cfg, null, 2);
      document.getElementById('filePathInfo').innerText = pathMap[activeIde];
    }

    function selectTab(ide) {
      activeIde = ide;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      updateSnippet();
    }

    function copySnippet() {
      const code = document.getElementById('configCode').innerText;
      navigator.clipboard.writeText(code).then(() => {
        alert('Copied MCP configuration to clipboard!');
      });
    }

    updateSnippet();
  </script>
</body>
</html>`;
}
