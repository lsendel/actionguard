import { describe, expect, it } from 'vitest';
import { renderBadgeSvg, renderShieldsJson } from '../src/badges.js';

describe('Dynamic Badges & Shields.io Support', () => {
  it('renders flat SVG badge by default', () => {
    const svg = renderBadgeSvg('ActionGuard', 'Grade A+', 'A+', 'unverified', 'flat');
    expect(svg).toContain('<svg');
    expect(svg).toContain('rx="3"');
    expect(svg).toContain('height="20"');
    expect(svg).toContain('#10b981');
    expect(svg).toContain('Grade A+');
  });

  it('renders flat-square SVG badge with rx="0"', () => {
    const svg = renderBadgeSvg('ActionGuard', 'Grade A', 'A', 'unverified', 'flat-square');
    expect(svg).toContain('<svg');
    expect(svg).toContain('rx="0"');
    expect(svg).toContain('height="20"');
  });

  it('renders for-the-badge SVG with uppercase style and height="28"', () => {
    const svg = renderBadgeSvg('ActionGuard', 'Grade B', 'B', 'unverified', 'for-the-badge');
    expect(svg).toContain('<svg');
    expect(svg).toContain('height="28"');
    expect(svg).toContain('ACTIONGUARD');
    expect(svg).toContain('GRADE B');
    expect(svg).toContain('#3b82f6'); // Blue for B
  });

  it('renders shields.io schema-compliant JSON endpoint data', () => {
    const jsonA = renderShieldsJson('ActionGuard', 'Grade A+', 'A+');
    expect(jsonA.schemaVersion).toBe(1);
    expect(jsonA.color).toBe('brightgreen');
    expect(jsonA.message).toBe('Grade A+');

    const jsonF = renderShieldsJson('ActionGuard', 'Unreachable', 'F');
    expect(jsonF.color).toBe('red');
    expect(jsonF.message).toBe('Unreachable');
  });
});
