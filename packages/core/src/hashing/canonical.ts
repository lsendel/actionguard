/**
 * Deterministically sorts and canonicalizes a JSON value into a standardized string.
 * Ensures consistent hashing regardless of key ordering or whitespace.
 */
export function canonicalJsonStringify(val: unknown): string {
  if (val === null || typeof val !== 'object') {
    return JSON.stringify(val);
  }

  if (Array.isArray(val)) {
    return `[${val.map((item) => canonicalJsonStringify(item)).join(',')}]`;
  }

  const obj = val as Record<string, unknown>;
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map((key) => {
    return `${JSON.stringify(key)}:${canonicalJsonStringify(obj[key])}`;
  });

  return `{${pairs.join(',')}}`;
}

/**
 * Computes a SHA-256 hex digest using Web Cryptography API (crypto.subtle).
 * Works across Cloudflare Workers, Node 18+, Bun, and modern browsers.
 */
export async function sha256Hex(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  // Use globalThis.crypto.subtle (available in workerd, Node 18+, Bun)
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
