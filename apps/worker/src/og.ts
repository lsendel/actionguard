export function renderOgCardSvg(params: {
  title: string;
  domain: string;
  grade?: string;
  tier?: string;
  schemaHash?: string;
  latencyMs?: number | null;
  uptimeStr?: string;
  probeFrequency?: string;
}): string {
  const grade = params.grade || 'Pending';
  const tier = params.tier || 'Unverified (curated listing)';
  const domain = params.domain || 'actionguard.ai';
  const latencyDisplay =
    typeof params.latencyMs === 'number' && params.latencyMs > 0
      ? `${params.latencyMs}ms`
      : 'no data yet';
  const uptimeDisplay = params.uptimeStr || 'Collecting data';
  const probeFrequency = params.probeFrequency || 'Every 15 min';

  const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const hasHash = Boolean(
    params.schemaHash && params.schemaHash.trim() !== '' && params.schemaHash !== EMPTY_SHA256,
  );
  const hash = hasHash ? `${params.schemaHash?.substring(0, 24)}...` : 'Not yet pinned';

  let gradeColor = '#10b981';
  if (grade === 'B') gradeColor = '#3b82f6';
  else if (grade === 'C') gradeColor = '#f59e0b';
  else if (grade === 'D' || grade === 'F' || grade === 'Unreachable') gradeColor = '#ef4444';
  else if (grade === 'Pending') gradeColor = '#9ca3af';

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
      <rect width="220" height="32" rx="16" fill="${tierColor}" fill-opacity="0.15" stroke="${tierColor}" stroke-opacity="0.4"/>
      <text x="110" y="21" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="12" fill="${tierColor}" text-anchor="middle">${escapeHtml(tier)}</text>

      <!-- Server Name -->
      <text y="90" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="44" fill="#ffffff" letter-spacing="-1">${escapeHtml(params.title)}</text>
      
      <!-- Canonical Domain -->
      <text y="130" font-family="'JetBrains Mono',monospace" font-size="18" fill="#60a5fa">https://${escapeHtml(domain)}</text>

      <!-- Telemetry Stats Grid -->
      <g transform="translate(0, 180)">
        <g>
          <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="12" fill="#6b7280" text-transform="uppercase">LATENCY</text>
          <text y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="20" fill="#ffffff">${escapeHtml(latencyDisplay)}</text>
        </g>
        <g transform="translate(160, 0)">
          <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="12" fill="#6b7280" text-transform="uppercase">UPTIME</text>
          <text y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="20" fill="#34d399">${escapeHtml(uptimeDisplay)}</text>
        </g>
        <g transform="translate(350, 0)">
          <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="12" fill="#6b7280" text-transform="uppercase">PROBE FREQUENCY</text>
          <text y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="20" fill="#ffffff">${escapeHtml(probeFrequency)}</text>
        </g>
      </g>

      <!-- Pinned Hash Block -->
      <g transform="translate(0, 260)">
        <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="12" fill="#6b7280" text-transform="uppercase">PINNED CONTRACT HASH</text>
        <rect y="12" width="560" height="42" rx="8" fill="#020617" stroke="#1f2937"/>
        <text x="16" y="38" font-family="'JetBrains Mono',monospace" font-size="13" fill="#93c5fd">${escapeHtml(hash)}</text>
      </g>
    </g>

    <!-- Right Column: Big Circular Grade Badge -->
    <g transform="translate(800, 120)">
      <circle cx="90" cy="90" r="80" fill="${gradeColor}" fill-opacity="0.12" stroke="${gradeColor}" stroke-width="6"/>
      <text x="90" y="${grade.length > 2 ? '95' : '105'}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="900" font-size="${grade.length > 4 ? '26' : '54'}" fill="${gradeColor}" text-anchor="middle">${escapeHtml(grade)}</text>
      <text x="90" y="135" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="12" fill="${gradeColor}" text-anchor="middle" letter-spacing="1">STATUS</text>
    </g>
  </g>
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
