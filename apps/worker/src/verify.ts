export function renderVerifyHtml(domain?: string, token?: string): string {
  const defaultDomain = domain || '';
  const defaultToken =
    token ||
    `ag_verify_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Domain Ownership Verification | ActionGuard.ai</title>
  <meta name="description" content="Verify ownership of your MCP server or AI agent domain to unlock the Gold Verified Badge on ActionGuard.">
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
      --gold: #f59e0b;
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
      max-width: 800px;
      margin: 0 auto;
      padding: 50px 24px 80px;
      width: 100%;
    }
    h1 { font-size: 36px; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px; }
    p { font-size: 16px; color: var(--text-muted); line-height: 1.6; margin-bottom: 32px; }
    .verify-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 32px;
    }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; }
    input[type="text"], input[type="url"] {
      width: 100%;
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #fff;
      outline: none;
    }
    input:focus { border-color: var(--accent); }
    .step-card {
      background: #020617;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .step-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px; }
    .code-snippet {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #93c5fd;
      background: rgba(255,255,255,0.03);
      padding: 8px 12px;
      border-radius: 6px;
      word-break: break-all;
    }
    .btn-verify {
      background: linear-gradient(135deg, #d97706, #f59e0b);
      color: #fff;
      border: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
    }
    .btn-verify:hover { opacity: 0.95; transform: translateY(-1px); }
    #resultBox { margin-top: 20px; padding: 16px; border-radius: 8px; display: none; }
  </style>
</head>
<body>
  <header>
    <a href="/" class="logo">Action<span>Guard</span>.ai</a>
    <a href="/index" style="color:var(--text-muted);text-decoration:none;font-size:14px;font-weight:600;">Reliability Index</a>
  </header>

  <main>
    <h1>Claim &amp; Verify Domain Ownership</h1>
    <p>Prove cryptographic control over your agent or MCP server domain to unlock the prestigious <strong>Gold Domain Verified Badge</strong> and prevent profile squatting.</p>

    <div class="verify-box">
      <div class="form-group">
        <label>Your Agent Domain</label>
        <input type="text" id="targetDomain" value="${defaultDomain}" placeholder="e.g. analytics.where.care or mycompany.com" required />
      </div>

      <div class="step-card">
        <div class="step-title">Option A: Add a DNS TXT Record (Recommended)</div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">Add the following TXT record to your domain's DNS zone:</p>
        <div class="code-snippet">
          <strong>Type:</strong> TXT &nbsp;|&nbsp; <strong>Name:</strong> @ (or root) &nbsp;|&nbsp; <strong>Value:</strong> actionguard-verification=${defaultToken}
        </div>
      </div>

      <div class="step-card">
        <div class="step-title">Option B: Host Well-Known Verification File</div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">Host a public plain text file at:</p>
        <div class="code-snippet">
          https://&lt;your-domain&gt;/.well-known/actionguard-verification.txt &nbsp;&rarr;&nbsp; Content: <code>${defaultToken}</code>
        </div>
      </div>

      <input type="hidden" id="verifyToken" value="${defaultToken}" />
      <button class="btn-verify" onclick="checkVerification()">Verify Domain Ownership &rarr;</button>

      <div id="resultBox"></div>
    </div>
  </main>

  <script>
    async function checkVerification() {
      const domain = document.getElementById('targetDomain').value.trim();
      const token = document.getElementById('verifyToken').value.trim();
      const resultBox = document.getElementById('resultBox');

      if (!domain) {
        alert('Please enter your domain');
        return;
      }

      resultBox.style.display = 'block';
      resultBox.style.background = '#1e293b';
      resultBox.style.color = '#93c5fd';
      resultBox.innerText = 'Checking DNS TXT records and .well-known endpoint...';

      try {
        const res = await fetch('/api/verify/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, token })
        });

        const data = await res.json();
        if (data.verified) {
          resultBox.style.background = 'rgba(16, 185, 129, 0.15)';
          resultBox.style.border = '1px solid #10b981';
          resultBox.style.color = '#34d399';
          resultBox.innerHTML = '<strong>✔ Domain Ownership Verified!</strong> Your service has been upgraded to Gold Domain Verified status.<br><a href="/servers/' + encodeURIComponent(data.slug) + '" style="color:#fff;font-weight:700;margin-top:8px;display:inline-block;">View Verified Profile &rarr;</a>';
        } else {
          resultBox.style.background = 'rgba(239, 68, 68, 0.15)';
          resultBox.style.border = '1px solid #ef4444';
          resultBox.style.color = '#f87171';
          resultBox.innerHTML = '<strong>Verification Incomplete:</strong> ' + (data.message || 'TXT record not detected yet. DNS propagation can take 1-2 minutes.');
        }
      } catch (err) {
        resultBox.style.background = 'rgba(239, 68, 68, 0.15)';
        resultBox.style.color = '#f87171';
        resultBox.innerText = 'Verification request failed: ' + err.message;
      }
    }
  </script>
</body>
</html>`;
}
