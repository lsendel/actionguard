import type { Env } from './types.js';

export interface SendEmailParams {
  apiKey: string;
  from?: string;
  to: string;
  subject: string;
  html: string;
}

export async function sendEmailViaResend(params: SendEmailParams): Promise<boolean> {
  const from = params.from || 'ActionGuard Drift Monitor <alerts@where.care>';
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Resend API failed (${res.status}):`, err);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error sending email via Resend:', err);
    return false;
  }
}

export function renderWelcomeEmailHtml(params: {
  serviceName: string;
  domain: string;
  slug: string;
  pinnedHash?: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #f9fafb; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; }
    .header { border-bottom: 1px solid #1f2937; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 22px; font-weight: 800; color: #3b82f6; text-decoration: none; }
    .title { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 12px; }
    p { font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 16px; }
    .badge { display: inline-block; background: #064e3b; color: #34d399; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 6px; margin-bottom: 20px; }
    .card { background: #020617; border: 1px solid #1f2937; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-family: monospace; font-size: 13px; color: #93c5fd; word-break: break-all; }
    .btn { display: inline-block; background: #2563eb; color: #fff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; }
    .footer { margin-top: 32px; border-top: 1px solid #1f2937; padding-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="logo">ActionGuard.ai</span>
    </div>
    <div class="badge">MONITORING ACTIVE</div>
    <h1 class="title">You are now monitoring ${escapeHtml(params.serviceName)}</h1>
    <p>You have successfully subscribed to real-time schema drift, downtime, and prompt poisoning alerts for <strong>https://${escapeHtml(params.domain)}</strong>.</p>
    
    <div class="card">
      <div style="color:#6b7280;font-size:11px;margin-bottom:4px;">CURRENT PINNED SCHEMA HASH</div>
      ${escapeHtml(params.pinnedHash || 'Automatic baseline registered')}
    </div>

    <p>ActionGuard edge nodes probe this endpoint continuously every 15 minutes. If breaking parameters or tool description modifications are detected, you will receive an immediate alert.</p>

    <div style="margin-top: 24px;">
      <a href="https://actionguard.ai/servers/${encodeURIComponent(params.slug)}" class="btn">View Live Server Profile &rarr;</a>
    </div>

    <div class="footer">
      ActionGuard.ai &bull; Multi-Registry AI Agent Verification & Drift Intelligence
    </div>
  </div>
</body>
</html>`;
}

export function renderDriftAlertEmailHtml(params: {
  serviceName: string;
  domain: string;
  slug: string;
  changeType: string;
  severity: string;
  oldHash: string;
  newHash: string;
  reportUrl: string;
}): string {
  const isBreaking = params.severity === 'breaking';
  const alertColor = isBreaking ? '#ef4444' : '#f59e0b';
  const alertBg = isBreaking ? '#450a0a' : '#451a03';
  const badgeText = isBreaking ? 'CRITICAL SCHEMA DRIFT' : 'DESCRIPTION MUTATION DETECTED';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #f9fafb; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; }
    .header { border-bottom: 1px solid #1f2937; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 22px; font-weight: 800; color: #3b82f6; text-decoration: none; }
    .badge { display: inline-block; background: ${alertBg}; color: ${alertColor}; font-weight: 800; font-size: 11px; padding: 5px 12px; border-radius: 6px; border: 1px solid ${alertColor}; margin-bottom: 16px; letter-spacing: 0.5px; }
    .title { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 12px; }
    p { font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 16px; }
    .hash-comparison { background: #020617; border: 1px solid #1f2937; border-radius: 8px; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 12px; }
    .hash-label { font-size: 11px; color: #6b7280; font-weight: 700; margin-bottom: 4px; }
    .hash-old { color: #f87171; word-break: break-all; margin-bottom: 12px; }
    .hash-new { color: #34d399; word-break: break-all; }
    .btn { display: inline-block; background: #2563eb; color: #fff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 8px; }
    .footer { margin-top: 32px; border-top: 1px solid #1f2937; padding-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="logo">ActionGuard.ai</span>
    </div>
    <div class="badge">${badgeText}</div>
    <h1 class="title">${escapeHtml(params.serviceName)} Contract Drift</h1>
    <p>ActionGuard continuous edge probing detected contract modifications on <strong>https://${escapeHtml(params.domain)}</strong>.</p>
    
    <div class="hash-comparison">
      <div class="hash-label">&minus; PREVIOUS PINNED DIGEST</div>
      <div class="hash-old">${escapeHtml(params.oldHash)}</div>
      <div class="hash-label">&plus; DETECTED RUNTIME DIGEST</div>
      <div class="hash-new">${escapeHtml(params.newHash)}</div>
    </div>

    <p style="color:#d1d5db;">Upstream tool contracts have changed. If your agent pipelines rely on this MCP server or A2A agent, function calling may produce schema mismatch errors.</p>

    <div style="margin-top: 24px;">
      <a href="${escapeHtml(params.reportUrl)}" class="btn">Inspect Breaking Changes &rarr;</a>
    </div>

    <div class="footer">
      ActionGuard.ai &bull; Automated Edge Drift Alert
    </div>
  </div>
</body>
</html>`;
}

export async function dispatchDriftAlerts(
  env: Env,
  serviceId: string,
  serviceName: string,
  domain: string,
  slug: string,
  changeType: string,
  severity: string,
  oldHash: string,
  newHash: string,
  reportUrl: string,
): Promise<void> {
  if (!env.actionguard_db || !env.RESEND_API_KEY) return;

  try {
    const subscribers = await env.actionguard_db
      .prepare('SELECT notify_email, alert_webhook_url FROM watchlist_items WHERE service_id = ?')
      .bind(serviceId)
      .all<{ notify_email?: string; alert_webhook_url?: string }>();

    if (!subscribers.results || subscribers.results.length === 0) return;

    const emailSubject =
      severity === 'breaking'
        ? `[ActionGuard] ⚠️ Breaking Schema Drift: ${serviceName}`
        : `[ActionGuard] ℹ️ Description Mutation: ${serviceName}`;

    const html = renderDriftAlertEmailHtml({
      serviceName,
      domain,
      slug,
      changeType,
      severity,
      oldHash,
      newHash,
      reportUrl,
    });

    for (const sub of subscribers.results) {
      if (sub.notify_email) {
        await sendEmailViaResend({
          apiKey: env.RESEND_API_KEY,
          from: env.ALERT_FROM_EMAIL || 'ActionGuard Drift Monitor <alerts@where.care>',
          to: sub.notify_email,
          subject: emailSubject,
          html,
        });
      }

      if (sub.alert_webhook_url) {
        try {
          const formatted = buildWebhookPayload(sub.alert_webhook_url, {
            severity,
            changeType,
            serviceName,
            domain,
            slug,
            oldHash,
            newHash,
            reportUrl,
          });

          await fetch(sub.alert_webhook_url, {
            method: 'POST',
            headers: formatted.headers,
            body: formatted.body,
            signal: AbortSignal.timeout(4000),
          });
        } catch (err) {
          console.error('Webhook notification failed:', err);
        }
      }
    }
  } catch (err) {
    console.error('Error dispatching drift alerts:', err);
  }
}

export function buildWebhookPayload(
  url: string,
  data: {
    severity: string;
    changeType: string;
    serviceName: string;
    domain: string;
    slug: string;
    oldHash: string;
    newHash: string;
    reportUrl: string;
  },
): { body: string; headers: Record<string, string> } {
  const isBreaking = data.severity === 'breaking';

  // 1. Slack Incoming Webhook (Block Kit)
  if (url.includes('hooks.slack.com')) {
    return {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${isBreaking ? '🚨 *Breaking Schema Drift*' : '⚠️ *Description Mutation*'} detected on <${data.reportUrl}|${data.serviceName}>`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: isBreaking ? '🚨 Breaking Schema Drift Detected' : '⚠️ Tool Description Mutated',
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Service:* <${data.reportUrl}|${data.serviceName}>\n*Domain:* \`${data.domain}\`\n*Severity:* \`${isBreaking ? 'CRITICAL (BREAKING)' : 'SECURITY WARNING'}\``,
            },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Previous Hash:*\n\`${data.oldHash.substring(0, 16)}...\`` },
              { type: 'mrkdwn', text: `*Detected Hash:*\n\`${data.newHash.substring(0, 16)}...\`` },
            ],
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'Inspect Drift & Upstream Diff', emoji: true },
                url: data.reportUrl,
                style: isBreaking ? 'danger' : 'primary',
              },
            ],
          },
        ],
      }),
    };
  }

  // 2. Discord Webhook (Rich Embed)
  if (url.includes('discord.com') || url.includes('discordapp.com')) {
    return {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [
          {
            title: `${isBreaking ? '🚨 BREAKING SCHEMA DRIFT' : '⚠️ DESCRIPTION MUTATION'}: ${data.serviceName}`,
            url: data.reportUrl,
            color: isBreaking ? 15548997 : 16753920,
            description: `ActionGuard continuous edge probing detected contract modifications on \`${data.domain}\`.`,
            fields: [
              { name: 'Severity', value: isBreaking ? 'Critical' : 'Warning', inline: true },
              { name: 'Change Type', value: data.changeType, inline: true },
              { name: 'Previous Hash', value: `\`${data.oldHash}\`` },
              { name: 'Detected Hash', value: `\`${data.newHash}\`` },
            ],
            footer: { text: 'ActionGuard.ai Edge Monitor' },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    };
  }

  // 3. Generic JSON Webhook
  return {
    headers: {
      'Content-Type': 'application/json',
      'X-ActionGuard-Event': 'schema_drift',
      'X-ActionGuard-Severity': data.severity,
    },
    body: JSON.stringify({
      event: 'schema_drift',
      ...data,
      timestamp: new Date().toISOString(),
    }),
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
