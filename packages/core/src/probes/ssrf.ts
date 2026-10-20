/**
 * Validates a target URL to ensure it is not pointing to private networks, loopback addresses,
 * or cloud metadata IP endpoints (SSRF Defense).
 */
export function isSafeTargetUrl(rawUrl: string): { isSafe: boolean; reason?: string; url?: URL } {
  let urlObj: URL;
  try {
    urlObj = new URL(rawUrl);
  } catch {
    return { isSafe: false, reason: 'Invalid URL format' };
  }

  // Must be https or http (for local testing)
  if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
    return { isSafe: false, reason: 'Target protocol must be HTTP or HTTPS' };
  }

  const hostname = urlObj.hostname.toLowerCase();

  // Block localhost and standard loopback
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.localhost')
  ) {
    return { isSafe: false, reason: 'Localhost and loopback targets are prohibited' };
  }

  // Block AWS/GCP/Azure link-local metadata endpoints
  if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
    return { isSafe: false, reason: 'Cloud metadata IP endpoints are prohibited' };
  }

  // Simple IPv4 private range checks
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [_, o1, o2] = ipv4Match.map(Number);
    // 10.0.0.0/8
    if (o1 === 10) return { isSafe: false, reason: 'Private IP space (10.0.0.0/8) is prohibited' };
    // 172.16.0.0/12
    if (o1 === 172 && o2 >= 16 && o2 <= 31) {
      return { isSafe: false, reason: 'Private IP space (172.16.0.0/12) is prohibited' };
    }
    // 192.168.0.0/16
    if (o1 === 192 && o2 === 168) {
      return { isSafe: false, reason: 'Private IP space (192.168.0.0/16) is prohibited' };
    }
    // 0.0.0.0/8
    if (o1 === 0) return { isSafe: false, reason: 'Zero IP space is prohibited' };
  }

  return { isSafe: true, url: urlObj };
}
