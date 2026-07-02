import { describe, it, expect } from "vitest";
import { checkRateLimit, createRouteRateLimit, rateLimits } from "../rate-limiter";

describe("checkRateLimit", () => {
  it("allows the first request", () => {
    const result = checkRateLimit("test-key", { limit: 10, windowMs: 60000 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("allows requests within the limit", () => {
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit("burst-key", { limit: 5, windowMs: 60000 });
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks requests exceeding the limit", () => {
    const key = `block-key-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      checkRateLimit(key, { limit: 3, windowMs: 60000 });
    }
    const result = checkRateLimit(key, { limit: 3, windowMs: 60000 });
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("uses default options when not provided", () => {
    const result = checkRateLimit("default-key");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(99);
  });

  it("resets after window expires", () => {
    const key = `reset-key-${Date.now()}`;
    const result1 = checkRateLimit(key, { limit: 1, windowMs: 50 });
    expect(result1.allowed).toBe(true);

    // Blocked within window
    const result2 = checkRateLimit(key, { limit: 1, windowMs: 50 });
    expect(result2.allowed).toBe(false);

    // Wait for window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const result3 = checkRateLimit(key, { limit: 1, windowMs: 50 });
        expect(result3.allowed).toBe(true);
        resolve();
      }, 60);
    });
  });
});

describe("createRouteRateLimit", () => {
  it("creates a rate limiter for a specific route", () => {
    const limiter = createRouteRateLimit("test-route", { limit: 2, windowMs: 60000 });
    const result1 = limiter("127.0.0.1");
    expect(result1.allowed).toBe(true);

    const result2 = limiter("127.0.0.1");
    expect(result2.allowed).toBe(true);

    const result3 = limiter("127.0.0.1");
    expect(result3.allowed).toBe(false);
  });

  it("differentiates by IP", () => {
    const limiter = createRouteRateLimit("multi-ip", { limit: 1, windowMs: 60000 });
    expect(limiter("ip-1").allowed).toBe(true);
    expect(limiter("ip-1").allowed).toBe(false);
    expect(limiter("ip-2").allowed).toBe(true);
  });

  it("differentiates by user ID when provided", () => {
    const limiter = createRouteRateLimit("user-route", { limit: 1, windowMs: 60000 });
    // If userId is provided, it's used as part of the key
    expect(limiter("ip-1", "user-1").allowed).toBe(true);
    expect(limiter("ip-1", "user-1").allowed).toBe(false);
    // Different user gets a fresh window
    expect(limiter("ip-1", "user-2").allowed).toBe(true);
  });
});

describe("rateLimits", () => {
  it("has pre-configured rate limiters", () => {
    expect(rateLimits.chat).toBeDefined();
    expect(rateLimits.auth).toBeDefined();
    expect(rateLimits.checkout).toBeDefined();
    expect(rateLimits.api).toBeDefined();
  });

  it("allows chat requests within limit", () => {
    const result = rateLimits.chat("127.0.0.1");
    expect(result.allowed).toBe(true);
  });
});
