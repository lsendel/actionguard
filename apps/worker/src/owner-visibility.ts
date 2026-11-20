// Exact owner domains grounded in the November20 owner removal decision.
// Do not infer ownership from a display name or hide unrelated catalog rows.
export const KNOWN_OWNER_DOMAINS = [
  'mcp.families.care',
  'analytics.where.care',
  'llmrank.app',
  'mcp.llmrank.app',
  'actionguard-worker.luis-diaz-s.workers.dev',
] as const;

export function newServiceVisibility(domain: string, ownerFleet: boolean) {
  const owned =
    ownerFleet || KNOWN_OWNER_DOMAINS.some((d) => d === domain.toLowerCase().replace(/\.+$/, ''));
  return { ownerFleet: owned ? 1 : 0, listed: owned ? 0 : 1 };
}

export function validateOwnerMarker(ownerFleet: unknown, visibility: unknown): boolean {
  if (ownerFleet === undefined || ownerFleet === false) {
    if (visibility !== undefined)
      throw new Error('visibility requires explicit owner_fleet marker');
    return false;
  }
  if (ownerFleet !== true || visibility !== 'unlisted') {
    throw new Error('owner_fleet requires true with explicit visibility:unlisted');
  }
  return true;
}
