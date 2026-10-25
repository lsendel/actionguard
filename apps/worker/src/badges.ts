export type BadgeStyle = 'flat' | 'flat-square' | 'for-the-badge';

export function getBadgeColor(grade: string, value: string, tier: string): string {
  if (grade === 'Unreachable' || value === 'Unreachable' || grade === 'F' || grade === 'D') {
    return '#ef4444'; // Red for failures
  }
  if (tier === 'Domain Verified') {
    return '#f59e0b'; // Gold for Domain Verified
  }
  if (grade === 'B') {
    return '#3b82f6'; // Blue
  }
  if (grade === 'C') {
    return '#f59e0b'; // Amber
  }
  if (grade === 'Pending' || value === 'Pending') {
    return '#9ca3af'; // Grey for pending
  }
  return '#10b981'; // Green for A/A+
}

export function renderShieldsJson(
  label: string,
  value: string,
  grade = 'Pending',
  tier = 'unverified',
): { schemaVersion: number; label: string; message: string; color: string } {
  const color = getBadgeColor(grade, value, tier);
  const colorName =
    color === '#10b981'
      ? 'brightgreen'
      : color === '#3b82f6'
        ? 'blue'
        : color === '#f59e0b'
          ? 'yellow'
          : color === '#ef4444'
            ? 'red'
            : 'lightgrey';

  const displayVal = tier === 'Domain Verified' ? `⭐ ${value}` : value;

  return {
    schemaVersion: 1,
    label,
    message: displayVal,
    color: colorName,
  };
}

export function renderBadgeSvg(
  label: string,
  value: string,
  grade = 'Pending',
  tier = 'unverified',
  style: BadgeStyle = 'flat',
): string {
  const color = getBadgeColor(grade, value, tier);
  const isForTheBadge = style === 'for-the-badge';
  const isFlatSquare = style === 'flat-square';

  const displayVal = tier === 'Domain Verified' ? `⭐ ${value}` : value;
  const labelText = isForTheBadge ? label.toUpperCase() : label;
  const valText = isForTheBadge ? displayVal.toUpperCase() : displayVal;

  const height = isForTheBadge ? 28 : 20;
  const rx = isForTheBadge || isFlatSquare ? 0 : 3;

  const leftWidth = isForTheBadge
    ? Math.max(90, labelText.length * 9 + 20)
    : Math.max(84, labelText.length * 7 + 14);
  const rightWidth = isForTheBadge
    ? Math.max(100, valText.length * 9 + 24)
    : Math.max(90, valText.length * 8 + 14);
  const totalWidth = leftWidth + rightWidth;

  const fontSize = isForTheBadge ? 100 : 110;
  const yPos = isForTheBadge ? 180 : 140;
  const shadowY = isForTheBadge ? 190 : 150;
  const letterSpacing = isForTheBadge ? 'letter-spacing="1"' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="${label}: ${displayVal}">
  <title>${label}: ${displayVal}</title>
  ${
    !isFlatSquare && !isForTheBadge
      ? `<linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>`
      : ''
  }
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="${rx}" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="${height}" fill="#1e293b"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${color}"/>
    ${
      !isFlatSquare && !isForTheBadge
        ? `<rect width="${totalWidth}" height="${height}" fill="url(#s)"/>`
        : ''
    }
  </g>
  <g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" text-rendering="geometricPrecision" font-size="${fontSize}" ${letterSpacing}>
    <text aria-hidden="true" x="${(leftWidth / 2) * 10}" y="${shadowY}" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(leftWidth - 14) * 10}">${labelText}</text>
    <text x="${(leftWidth / 2) * 10}" y="${yPos}" transform="scale(.1)" fill="#fff" textLength="${(leftWidth - 14) * 10}">${labelText}</text>
    <text aria-hidden="true" x="${(leftWidth + rightWidth / 2) * 10}" y="${shadowY}" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(rightWidth - 14) * 10}">${valText}</text>
    <text x="${(leftWidth + rightWidth / 2) * 10}" y="${yPos}" transform="scale(.1)" fill="#fff" textLength="${(rightWidth - 14) * 10}">${valText}</text>
  </g>
</svg>`;
}
