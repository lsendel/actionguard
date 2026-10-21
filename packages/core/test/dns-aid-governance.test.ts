import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');

describe('DNS-AID Governance Claims Audit', () => {
  it('ensures "Linux Foundation" is never associated with DNS-AID in guides, README, or docs', () => {
    const filesToCheck = [
      path.join(repoRoot, 'apps/worker/src/guides.ts'),
      path.join(repoRoot, 'README.md'),
      path.join(repoRoot, 'docs/REQUIREMENTS.md'),
      path.join(repoRoot, 'docs/SPECIFICATIONS.md'),
      path.join(repoRoot, 'packages/cli/README.md'),
    ];

    for (const filePath of filesToCheck) {
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for Linux Foundation
      expect(content).not.toMatch(/Linux\s+Foundation.*DNS-AID/i);
      expect(content).not.toMatch(/DNS-AID.*Linux\s+Foundation/i);

      // Check for "governed under"
      expect(content).not.toMatch(/governed\s+under.*IETF/i);
      expect(content).not.toMatch(/governed\s+under.*Linux\s+Foundation/i);
      expect(content).not.toMatch(/DNS-AID.*governed\s+under/i);
    }
  });

  it('verifies that the DNS-AID setup guide accurately identifies DNS-AID as an experimental individual Internet-Draft', () => {
    const guidesPath = path.join(repoRoot, 'apps/worker/src/guides.ts');
    const content = fs.readFileSync(guidesPath, 'utf8');

    // Title must not conflate RFC 8552 / RFC 9460 as DNS-AID itself
    expect(content).not.toContain('DNS-AID (RFC 8552 / RFC 9460)');
    // Must clearly state it is an individual Internet-Draft and experimental
    expect(content).toContain('draft-mozleywilliams-dnsop-dnsaid');
    expect(content).toContain('individual Internet-Draft');
    expect(content).toContain('experimental');
  });
});
