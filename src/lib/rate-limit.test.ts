import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getRateLimiter } from "./rate-limit";

describe("rate limiter (in-memory)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-08T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows up to 5 requests per hour per identifier", async () => {
    const { limit } = getRateLimiter();
    const id = `test:allow:${Math.random()}`;

    for (let i = 0; i < 5; i++) {
      const result = await limit(id);
      expect(result.success).toBe(true);
    }

    const sixth = await limit(id);
    expect(sixth.success).toBe(false);
    expect(sixth.remaining).toBe(0);
  });

  it("tracks identifiers independently", async () => {
    const { limit } = getRateLimiter();
    const a = `test:a:${Math.random()}`;
    const b = `test:b:${Math.random()}`;

    for (let i = 0; i < 5; i++) await limit(a);

    expect((await limit(a)).success).toBe(false);
    expect((await limit(b)).success).toBe(true);
  });

  it("resets after the window elapses", async () => {
    const { limit } = getRateLimiter();
    const id = `test:window:${Math.random()}`;

    for (let i = 0; i < 5; i++) await limit(id);
    expect((await limit(id)).success).toBe(false);

    vi.setSystemTime(new Date("2026-08-08T01:00:01Z"));

    expect((await limit(id)).success).toBe(true);
  });

  it("rejects without consuming budget when limited", async () => {
    const { limit } = getRateLimiter();
    const id = `test:reject:${Math.random()}`;

    for (let i = 0; i < 5; i++) await limit(id);

    // Repeated rejections must not extend the penalty window.
    for (let i = 0; i < 10; i++) {
      expect((await limit(id)).success).toBe(false);
    }

    vi.setSystemTime(new Date("2026-08-08T01:00:01Z"));
    expect((await limit(id)).success).toBe(true);
  });
});
