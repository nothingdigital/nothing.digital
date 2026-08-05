import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { env } from "@/lib/env";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimiter {
  limit(identifier: string): Promise<RateLimitResult>;
}

function createUpstashRateLimiter(): RateLimiter | null {
  const url = env.private.UPSTASH_REDIS_REST_URL;
  const token = env.private.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: false,
  });

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const result = await ratelimit.limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    },
  };
}

// ponytail: in-memory fallback per process; resets on deploy/restart.
// Upgrade to Redis when running multi-instance or long-lived production traffic.
function createMemoryRateLimiter(): RateLimiter {
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 5;
  const buckets = new Map<string, number[]>();

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const now = Date.now();
      const reset = now + windowMs;
      const timestamps = buckets.get(identifier) ?? [];
      const withinWindow = timestamps.filter((ts) => now - ts < windowMs);

      const remaining = Math.max(0, maxRequests - withinWindow.length - 1);
      const success = withinWindow.length < maxRequests;

      if (success) withinWindow.push(now);
      buckets.set(identifier, withinWindow);

      return { success, limit: maxRequests, remaining, reset };
    },
  };
}

export function getRateLimiter(): RateLimiter {
  return createUpstashRateLimiter() ?? createMemoryRateLimiter();
}
