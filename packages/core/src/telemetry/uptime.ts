export interface ProbeRecord {
  probed_at: string | Date;
  status: 'up' | 'down' | 'degraded';
  latency_ms?: number | null;
  grade?: string | null;
}

export interface UptimeStats {
  totalProbes: number;
  successfulProbes: number;
  hasMinimumProbes: boolean;
  uptimePercent: number | null;
  medianLatencyMs: number | null;
  firstProbeAt: string | null;
  lastProbeAt: string | null;
  displayUptime: string;
  windowLabel: string;
}

/**
 * Calculates the median latency from an array of probe records.
 * Returns null if no valid latency measurements exist.
 */
export function calculateMedianLatency(probes: ProbeRecord[]): number | null {
  const latencies = probes
    .map((p) => p.latency_ms)
    .filter((ms): ms is number => typeof ms === 'number' && !Number.isNaN(ms) && ms >= 0)
    .sort((a, b) => a - b);

  if (latencies.length === 0) return null;

  const mid = Math.floor(latencies.length / 2);
  if (latencies.length % 2 !== 0) {
    return latencies[mid];
  }
  return Math.round((latencies[mid - 1] + latencies[mid]) / 2);
}

/**
 * Computes uptime metrics following the ActionGuard trust specification:
 * - Uptime = successful probes / total probes in window.
 * - Requires at least 20 probes to display a percentage.
 * - Shows "Collecting data (N probes since <date>)" when probes < 20 or history is insufficient.
 */
export function calculateUptimeStats(
  probes: ProbeRecord[],
  options: { now?: Date; targetWindowDays?: number } = {},
): UptimeStats {
  const now = options.now || new Date();
  const targetWindowDays = options.targetWindowDays || 30;

  if (!probes || probes.length === 0) {
    return {
      totalProbes: 0,
      successfulProbes: 0,
      hasMinimumProbes: false,
      uptimePercent: null,
      medianLatencyMs: null,
      firstProbeAt: null,
      lastProbeAt: null,
      displayUptime: 'Collecting data (0 probes)',
      windowLabel: 'Uptime',
    };
  }

  // Sort chronologically ascending
  const sorted = [...probes].sort((a, b) => {
    const tA = new Date(a.probed_at).getTime();
    const tB = new Date(b.probed_at).getTime();
    return tA - tB;
  });

  const firstDate = new Date(sorted[0].probed_at);
  const lastDate = new Date(sorted[sorted.length - 1].probed_at);
  const totalProbes = sorted.length;
  const successfulProbes = sorted.filter((p) => p.status === 'up').length;
  const medianLatencyMs = calculateMedianLatency(sorted);

  const firstIso = firstDate.toISOString();
  const lastIso = lastDate.toISOString();
  const formattedFirstDate = firstDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const historyMs = Math.max(0, now.getTime() - firstDate.getTime());
  const historyDays = historyMs / (1000 * 60 * 60 * 24);

  // Require at least 20 probes to show a percentage
  if (totalProbes < 20) {
    return {
      totalProbes,
      successfulProbes,
      hasMinimumProbes: false,
      uptimePercent: null,
      medianLatencyMs,
      firstProbeAt: firstIso,
      lastProbeAt: lastIso,
      displayUptime: `Collecting data (${totalProbes} probe${totalProbes === 1 ? '' : 's'} since ${formattedFirstDate})`,
      windowLabel: 'Uptime',
    };
  }

  const rawPercent = (successfulProbes / totalProbes) * 100;
  // Round to 2 decimal places
  const uptimePercent = Math.round(rawPercent * 100) / 100;
  const displayUptime = `${uptimePercent.toFixed(2)}%`;

  let windowLabel = 'Uptime';
  if (historyDays >= 30 && targetWindowDays >= 30) {
    windowLabel = '30-Day Uptime';
  } else if (historyDays >= 7 && targetWindowDays >= 7) {
    windowLabel = '7-Day Uptime';
  } else if (historyDays >= 1) {
    windowLabel = '24-Hour Uptime';
  } else {
    windowLabel = `Uptime (${totalProbes} probes)`;
  }

  return {
    totalProbes,
    successfulProbes,
    hasMinimumProbes: true,
    uptimePercent,
    medianLatencyMs,
    firstProbeAt: firstIso,
    lastProbeAt: lastIso,
    displayUptime,
    windowLabel,
  };
}
