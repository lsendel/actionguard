export function renderPricingHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pricing &amp; Developer API Plans | ActionGuard.ai</title>
  <meta name="description" content="Transparent, developer-first pricing for Model Context Protocol (MCP) verification, schema drift detection, and zero-trust runtime proxy security.">
  <link rel="canonical" href="https://actionguard.ai/pricing" />
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
      padding: 60px 24px 80px;
      width: 100%;
    }
    .hero { text-align: center; margin-bottom: 50px; }
    .hero h1 { font-size: 42px; font-weight: 800; letter-spacing: -1px; margin-bottom: 12px; }
    .hero p { font-size: 17px; color: var(--text-muted); max-width: 640px; margin: 0 auto; }
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 50px;
    }
    .plan-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .plan-card.featured {
      border-color: #3b82f6;
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.15);
    }
    .plan-pill {
      position: absolute;
      top: -12px;
      right: 24px;
      background: #2563eb;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .plan-name { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
    .plan-price { font-size: 38px; font-weight: 800; margin-bottom: 4px; }
    .plan-price span { font-size: 15px; color: var(--text-muted); font-weight: 500; }
    .plan-desc { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px; }
    .features-list { list-style: none; margin-bottom: 32px; flex: 1; }
    .features-list li { font-size: 14px; color: #d1d5db; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
    .features-list li::before { content: "✔"; color: #10b981; font-weight: 700; }
    .btn-plan {
      background: #1e293b;
      color: #fff;
      border: 1px solid var(--border);
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      transition: all 0.15s;
    }
    .btn-plan.primary {
      background: #2563eb;
      border-color: #2563eb;
    }
    .btn-plan:hover { opacity: 0.9; }

    .key-gen-box {
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      max-width: 680px;
      margin: 0 auto;
    }
    .key-gen-box h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
    .key-gen-box p { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; }
    .key-form { display: flex; gap: 10px; flex-wrap: wrap; }
    .key-input {
      flex: 1;
      min-width: 240px;
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 16px;
      color: #fff;
      font-size: 14px;
      outline: none;
    }
    .key-input:focus { border-color: var(--accent); }
    #keyResultBox { margin-top: 20px; padding: 16px; border-radius: 8px; display: none; }
    footer { border-top: 1px solid var(--border); padding: 24px; text-align: center; font-size: 13px; color: var(--text-muted); }
  </style>
</head>
<body>
  <header>
    <a href="/" class="logo">Action<span>Guard</span>.ai</a>
    <div style="display:flex;gap:16px;align-items:center;">
      <a href="/index" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Reliability Index</a>
      <a href="/verify" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Verify Domain</a>
      <a href="/docs/mcp-schema-drift" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Docs</a>
    </div>
  </header>

  <main>
    <div class="hero">
      <h1>Simple, Developer-First Pricing</h1>
      <p>Protect your AI agent pipelines against upstream schema drift, prompt injection, and downtime across 300+ Cloudflare edge locations.</p>
    </div>

    <div class="pricing-grid">
      <!-- Free Community Plan -->
      <div class="plan-card">
        <div class="plan-name">Community</div>
        <div class="plan-price">$0 <span>/ month</span></div>
        <div class="plan-desc">For open-source builders and developers testing agents locally.</div>
        <ul class="features-list">
          <li>15-Minute Continuous Edge Probing</li>
          <li>Public Reliability Index &amp; Profile Pages</li>
          <li>Dynamic SVG Badges for READMEs</li>
          <li>Self-Serve DNS-AID Verification</li>
          <li>5,000 Runtime Proxy Calls / month</li>
        </ul>
        <button class="btn-plan" onclick="document.getElementById('keyGenSection').scrollIntoView({behavior:'smooth'})">Get Free API Key</button>
      </div>

      <!-- Indie Developer Plan -->
      <div class="plan-card">
        <div class="plan-name">Indie</div>
        <div class="plan-price">$19 <span>/ month</span></div>
        <div class="plan-desc">For solo MCP developers, open-source maintainers, and indie agent builders.</div>
        <ul class="features-list">
          <li><strong>15-Minute Continuous Edge Probing</strong></li>
          <li>Up to 3 Monitored Endpoints</li>
          <li>Real-time Email Schema Drift Alerts</li>
          <li>15,000 Zero-Trust Proxy Calls / month</li>
          <li>Verified Profile &amp; Claimed README Badge</li>
        </ul>
        <a href="mailto:sales@where.care?subject=ActionGuard%20Indie%20Upgrade" class="btn-plan">Get Indie Plan &rarr;</a>
      </div>

      <!-- Pro Developer Plan -->
      <div class="plan-card featured">
        <div class="plan-pill">Most Popular</div>
        <div class="plan-name">Pro</div>
        <div class="plan-price">$49 <span>/ month</span></div>
        <div class="plan-desc">For production AI agents and startup engineering teams.</div>
        <ul class="features-list">
          <li><strong>Continuous 15-Minute Edge Probing</strong></li>
          <li>Up to 25 Monitored Endpoints</li>
          <li>Real-time Email &amp; Webhook Drift Alerts</li>
          <li>50,000 Zero-Trust Proxy Calls / month</li>
          <li>CI/CD GitHub Action Schema Pinning</li>
          <li>Priority Edge Routing</li>
        </ul>
        <a href="mailto:sales@where.care?subject=ActionGuard%20Pro%20Upgrade" class="btn-plan primary">Upgrade to Pro &rarr;</a>
      </div>

      <!-- Enterprise Gateway Plan -->
      <div class="plan-card">
        <div class="plan-name">Enterprise Gateway</div>
        <div class="plan-price">$299 <span>/ month</span></div>
        <div class="plan-desc">For high-throughput AI agent architectures and mission-critical workflows.</div>
        <ul class="features-list">
          <li><strong>15-Second Edge Telemetry &amp; Auditing</strong></li>
          <li>Unlimited Monitored Endpoints</li>
          <li>1,000,000+ Zero-Trust Proxy Calls / month</li>
          <li>99.99% Edge Gateway Uptime SLA</li>
          <li>Custom White-Label Domain (guard.yourco.com)</li>
          <li>Dedicated Slack / Teams Engineering Channel</li>
        </ul>
        <a href="mailto:sales@where.care?subject=ActionGuard%20Enterprise%20Inquiry" class="btn-plan">Contact Sales &rarr;</a>
      </div>
    </div>

    <!-- Instant API Key Generation Box -->
    <div id="keyGenSection" class="key-gen-box">
      <h3>⚡ Get an Instant Developer API Key</h3>
      <p>Use your key to authenticate against <code>/v1/proxy</code> and unlock 5,000 free proxy calls per month with elevated rate limits.</p>
      <div class="key-form">
        <input type="email" id="devEmail" class="key-input" placeholder="developer@yourcompany.com" required />
        <button onclick="generateKey()" class="btn-plan primary" style="padding:12px 24px;">Generate API Key &rarr;</button>
      </div>
      <div id="keyResultBox"></div>
    </div>
  </main>

  <footer>
    ActionGuard.ai &bull; Multi-Registry AI Agent Verification &bull; <a href="/sitemap.xml" style="color:var(--text-muted);text-decoration:none;">Sitemap</a>
  </footer>

  <script>
    async function generateKey() {
      const email = document.getElementById('devEmail').value.trim();
      const resultBox = document.getElementById('keyResultBox');

      if (!email || !email.includes('@')) {
        resultBox.style.display = 'block';
        resultBox.style.background = 'rgba(239, 68, 68, 0.15)';
        resultBox.style.border = '1px solid #ef4444';
        resultBox.style.color = '#f87171';
        resultBox.innerText = 'Please enter a valid email address.';
        return;
      }

      resultBox.style.display = 'block';
      resultBox.style.background = '#1e293b';
      resultBox.style.color = '#93c5fd';
      resultBox.innerText = 'Generating cryptographic API key...';

      try {
        const res = await fetch('/api/keys/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, name: 'Web Developer Key' })
        });

        const data = await res.json();
        if (res.ok && data.rawKey) {
          resultBox.style.background = 'rgba(16, 185, 129, 0.15)';
          resultBox.style.border = '1px solid #10b981';
          resultBox.style.color = '#34d399';
          resultBox.innerHTML = '<strong>✔ Developer Key Created!</strong> Store this key securely (it will not be shown again):<br>' +
            '<div style=\"background:#020617;padding:12px;margin:10px 0;border-radius:6px;font-family:monospace;color:#fff;word-break:break-all;\">' + data.rawKey + '</div>' +
            '<span style=\"font-size:12px;color:#94a3b8;\">Tier: Free (5,000 calls/month) &bull; Authenticate via header: <code>Authorization: Bearer ' + data.prefix + '</code></span>';
        } else {
          resultBox.style.background = 'rgba(239, 68, 68, 0.15)';
          resultBox.style.border = '1px solid #ef4444';
          resultBox.style.color = '#f87171';
          resultBox.innerText = data.error || 'Failed to generate key.';
        }
      } catch (err) {
        resultBox.style.background = 'rgba(239, 68, 68, 0.15)';
        resultBox.style.border = '1px solid #ef4444';
        resultBox.style.color = '#f87171';
        resultBox.innerText = 'Network error: ' + err.message;
      }
    }
  </script>
</body>
</html>`;
}
