export function renderBadgeSvg(
  label: string,
  value: string,
  grade: string = 'A+',
  tier: string = 'unverified'
): string {
  let color = '#10b981'; // Green for A/A+
  if (tier === 'Domain Verified' || tier.includes('Domain')) {
    color = '#f59e0b'; // Gold for Domain Verified
  } else if (grade === 'B') {
    color = '#3b82f6'; // Blue
  } else if (grade === 'C') {
    color = '#f59e0b'; // Amber
  } else if (grade === 'D' || grade === 'F') {
    color = '#ef4444'; // Red
  }

  const displayVal = tier === 'Domain Verified' ? `⭐ ${value}` : value;
  const leftWidth = 84;
  const rightWidth = Math.max(90, displayVal.length * 8 + 14);
  const totalWidth = leftWidth + rightWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${displayVal}">
  <title>${label}: ${displayVal}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="20" fill="#1e293b"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${(leftWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(leftWidth - 14) * 10}">${label}</text>
    <text x="${(leftWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(leftWidth - 14) * 10}">${label}</text>
    <text aria-hidden="true" x="${(leftWidth + rightWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(rightWidth - 14) * 10}">${displayVal}</text>
    <text x="${(leftWidth + rightWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(rightWidth - 14) * 10}">${displayVal}</text>
  </g>
</svg>`;
}
