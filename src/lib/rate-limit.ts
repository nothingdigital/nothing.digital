interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// ponytail: in-memory limiter per process; resets on deploy/restart.
// Upgrade to Redis when running multi-instance or long-lived production traffic.
const windowMs = 60 * 60 * 1000;
const maxRequests = 5;
const buckets = new Map<string, number[]>();

// ponytail: bound memory — prune stale identifiers and cap the bucket count so a
// flood of unique keys cannot grow the map without limit on long-lived instances.
const maxBuckets = 10_000;

function pruneExpired(now: number): void {
  for (const [identifier, timestamps] of buckets) {
    const withinWindow = timestamps.filter((ts) => now - ts < windowMs);
    if (withinWindow.length === 0) {
      buckets.delete(identifier);
    } else {
      buckets.set(identifier, withinWindow);
    }
  }
}

function evictOldestIfFull(): void {
  if (buckets.size < maxBuckets) return;
  pruneExpired(Date.now());
  // Map iteration order is insertion order; drop the oldest entries if still full.
  while (buckets.size >= maxBuckets) {
    const oldest = buckets.keys().next();
    if (oldest.done) break;
    buckets.delete(oldest.value);
  }
}

async function limit(identifier: string): Promise<RateLimitResult> {
  const now = Date.now();
  const reset = now + windowMs;
  const timestamps = buckets.get(identifier) ?? [];
  const withinWindow = timestamps.filter((ts) => now - ts < windowMs);

  const remaining = Math.max(0, maxRequests - withinWindow.length - 1);
  const success = withinWindow.length < maxRequests;

  if (success) {
    withinWindow.push(now);
    // Refresh insertion order so eviction drops the least-recently-seen keys.
    buckets.delete(identifier);
    buckets.set(identifier, withinWindow);
    evictOldestIfFull();
  }

  return { success, limit: maxRequests, remaining, reset };
}

export function getRateLimiter() {
  return { limit };
}
