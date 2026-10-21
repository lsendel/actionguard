export function renderOgCardSvg(params: {
  title: string;
  domain: string;
  grade?: string;
  tier?: string;
  schemaHash?: string;
  latencyMs?: number;
}): string {
  const grade = params.grade || 'A+';
  const tier = params.tier || 'Community Verified';
  const domain = params.domain || 'actionguard.ai';
  const latency = params.latencyMs || 120;
  const hash = params.schemaHash ? `${params.schemaHash.substring(0, 24)}...` : 'Pinned Cryptographic Digest';

  let gradeColor = '#10b981';
  if (grade === 'B') gradeColor = '#3b82f6';
  else if (grade === 'C') gradeColor = '#f59e0b';
  else if (grade === 'D' || grade === 'F') gradeColor = '#ef4444';

  const tierColor = tier.includes('Domain') ? '#f59e0b' : '#38bdf8';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeHtml(params.title)}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0b1120"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#090d16" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Subtle Grid Lines -->
  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="630"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="500" y1="0" x2="500" y2="630"/>
    <line x1="700" y1="0" x2="700" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/>
    <line x1="1100" y1="0" x2="1100" y2="630"/>
    <line x1="0" y1="100" x2="1200" y2="100"/>
    <line x1="0" y1="250" x2="1200" y2="250"/>
    <line x1="0" y1="400" x2="1200" y2="400"/>
    <line x1="0" y1="550" x2="1200" y2="550"/>
  </g>

  <!-- Header -->
  <g transform="translate(80, 70)">
    <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="-0.5">Action<tspan fill="#3b82f6">Guard</tspan>.ai</text>
    <text x="210" y="-3" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="600" font-size="16" fill="#9ca3af">Protocol Conformance &amp; Schema Drift Gate</text>
  </g>

  <!-- Main Card -->
  <g transform="translate(80, 130)" filter="url(#shadow)">
    <rect width="1040" height="420" rx="20" fill="url(#cardBg)" stroke="#1f2937" stroke-width="2"/>
    
    <!-- Left Column: Title and Details -->
    <g transform="translate(60, 60)">
      <!-- Tier Pill -->
      <rect width="180" height="32" rx="16" fill="${tierColor}" fill-opacity="0.15" stroke="${tierColor}" stroke-opacity="0.4"/>
      <text x="90" y="21" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="13" fill="${tierColor}" text-anchor="middle">${escapeHtml(tier)}</text>

      <!-- Server Name -->
      <text y="90" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="44" fill="#ffffff" letter-spacing="-1">${escapeHtml(params.title)}</text>
      
      <!-- Canonical Domain -->
      <text y="130" font-family="'JetBrains Mono',monospace" font-size="18" fill="#60a5fa">https://${escapeHtml(domain)}</text>

      <!-- Telemetry Stats Grid -->
      <g transform="translate(0, 180)">
        <g>
          <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="12" fill="#6b7280" text-transform="uppercase">LATENCY</text>
          <text y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="22" fill="#ffffff">${latency}ms</text>
        </g>
        <g transform="translate(160, 0)">
          <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="12" fill="#6b7280" text-transform="uppercase">UPTIME</text>
          <text y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="22" fill="#34d399">99.98%</text>
        </g>
        <g transform="translate(320, 0)">
          <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="12" fill="#6b7280" text-transform="uppercase">CONTINUOUS PROBE</text>
          <text y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="22" fill="#ffffff">Every 15 min</text>
        </g>
      </g>

      <!-- Pinned Hash Block -->
      <g transform="translate(0, 260)">
        <rect width="600" height="42" rx="8" fill="#020617" stroke="#1f2937" stroke-width="1"/>
        <text x="14" y="26" font-family="'JetBrains Mono',monospace" font-size="13" fill="#93c5fd">🔒 SHA-256: ${escapeHtml(hash)}</text>
      </g>
    </g>

    <!-- Right Column: Massive Score Emblem -->
    <g transform="translate(800, 120)">
      <circle cx="100" cy="100" r="90" fill="${gradeColor}" fill-opacity="0.1" stroke="${gradeColor}" stroke-width="4"/>
      <text x="100" y="125" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="900" font-size="84" fill="${gradeColor}" text-anchor="middle">${grade}</text>
      <text x="100" y="165" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="14" fill="#9ca3af" text-anchor="middle" letter-spacing="1">AUDIT GRADE</text>
    </g>
  </g>

  <!-- Footer Tagline -->
  <text x="600" y="590" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">
    Verified by ActionGuard.ai &bull; Model Context Protocol &amp; Agent2Agent Reliability Telemetry
  </text>
</svg>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
