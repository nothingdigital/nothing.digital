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

async function limit(identifier: string): Promise<RateLimitResult> {
  const now = Date.now();
  const reset = now + windowMs;
  const timestamps = buckets.get(identifier) ?? [];
  const withinWindow = timestamps.filter((ts) => now - ts < windowMs);

  const remaining = Math.max(0, maxRequests - withinWindow.length - 1);
  const success = withinWindow.length < maxRequests;

  if (success) withinWindow.push(now);
  buckets.set(identifier, withinWindow);

  return { success, limit: maxRequests, remaining, reset };
}

export function getRateLimiter() {
  return { limit };
}
