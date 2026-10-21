import { describe, expect, it } from 'vitest';
import {
  type ProbeRecord,
  calculateMedianLatency,
  calculateUptimeStats,
} from '../src/telemetry/uptime.js';

describe('Telemetry & Uptime Math', () => {
  it('calculates median latency correctly with odd and even measurement counts', () => {
    // Odd count: [10, 20, 30] -> median 20
    const oddProbes: ProbeRecord[] = [
      { probed_at: '2026-10-20T00:00:00Z', status: 'up', latency_ms: 30 },
      { probed_at: '2026-10-20T01:00:00Z', status: 'up', latency_ms: 10 },
      { probed_at: '2026-10-20T02:00:00Z', status: 'up', latency_ms: 20 },
    ];
    expect(calculateMedianLatency(oddProbes)).toBe(20);

    // Even count: [10, 20, 30, 40] -> median (20+30)/2 = 25
    const evenProbes: ProbeRecord[] = [
      ...oddProbes,
      { probed_at: '2026-10-20T03:00:00Z', status: 'up', latency_ms: 40 },
    ];
    expect(calculateMedianLatency(evenProbes)).toBe(25);

    // Filters out null / undefined / negative latencies from failed probes
    const mixedProbes: ProbeRecord[] = [
      { probed_at: '2026-10-20T00:00:00Z', status: 'down', latency_ms: null },
      { probed_at: '2026-10-20T01:00:00Z', status: 'up', latency_ms: 50 },
      { probed_at: '2026-10-20T02:00:00Z', status: 'down', latency_ms: undefined },
      { probed_at: '2026-10-20T03:00:00Z', status: 'up', latency_ms: 70 },
    ];
    expect(calculateMedianLatency(mixedProbes)).toBe(60);

    // Empty list returns null
    expect(calculateMedianLatency([])).toBeNull();
  });

  it('enforces the "Collecting data" threshold when fewer than 20 probes exist', () => {
    const probes: ProbeRecord[] = [];
    const baseDate = new Date('2026-10-20T12:00:00Z');

    for (let i = 0; i < 15; i++) {
      probes.push({
        probed_at: new Date(baseDate.getTime() + i * 15 * 60 * 1000).toISOString(),
        status: 'up',
        latency_ms: 50,
      });
    }

    const stats = calculateUptimeStats(probes, { now: new Date('2026-10-20T16:00:00Z') });
    expect(stats.totalProbes).toBe(15);
    expect(stats.hasMinimumProbes).toBe(false);
    expect(stats.uptimePercent).toBeNull();
    expect(stats.displayUptime).toContain('Collecting data (15 probes since');
  });

  it('calculates accurate uptime percentage with >= 20 probes including failures and time gaps', () => {
    const probes: ProbeRecord[] = [];
    const baseDate = new Date('2026-09-20T00:00:00Z'); // 30 days ago

    // 95 successful probes, 5 failed probes = 95% uptime
    for (let i = 0; i < 100; i++) {
      // Simulate random interval gaps (between 15 min and 3 hours)
      const timestamp = new Date(baseDate.getTime() + i * 7.2 * 60 * 60 * 1000);
      probes.push({
        probed_at: timestamp.toISOString(),
        status: i < 5 ? 'down' : 'up',
        latency_ms: i < 5 ? null : 40 + (i % 20),
      });
    }

    const stats = calculateUptimeStats(probes, {
      now: new Date('2026-10-20T12:00:00Z'),
      targetWindowDays: 30,
    });

    expect(stats.hasMinimumProbes).toBe(true);
    expect(stats.totalProbes).toBe(100);
    expect(stats.successfulProbes).toBe(95);
    expect(stats.uptimePercent).toBe(95.0);
    expect(stats.displayUptime).toBe('95.00%');
    expect(stats.windowLabel).toBe('30-Day Uptime');
  });

  it('adjusts window label when history is shorter than 30 days', () => {
    const probes: ProbeRecord[] = [];
    const baseDate = new Date('2026-10-18T00:00:00Z'); // 2 days of history

    for (let i = 0; i < 30; i++) {
      probes.push({
        probed_at: new Date(baseDate.getTime() + i * 60 * 60 * 1000).toISOString(),
        status: 'up',
        latency_ms: 30,
      });
    }

    const stats = calculateUptimeStats(probes, {
      now: new Date('2026-10-20T06:00:00Z'),
      targetWindowDays: 30,
    });

    expect(stats.hasMinimumProbes).toBe(true);
    expect(stats.uptimePercent).toBe(100);
    // History is ~2.25 days: should be 24-Hour Uptime or probe-based rather than claiming 30-Day Uptime
    expect(stats.windowLabel).toBe('24-Hour Uptime');
  });
});
