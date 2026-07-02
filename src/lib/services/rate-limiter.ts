// Simple in-memory rate limiter for API routes.
// For production, use Redis-based rate limiting.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

const defaults: RateLimitOptions = {
  limit: 100,     // 100 requests
  windowMs: 60000, // per minute
};

/**
 * Rate limit a request by a key (e.g., IP, user ID, or route).
 * Returns true if the request is allowed, false if rate-limited.
 */
export function checkRateLimit(
  key: string,
  options: Partial<RateLimitOptions> = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const { limit, windowMs } = { ...defaults, ...options };
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  entry.count++;

  if (entry.count > limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Create a rate limit check for specific API routes.
 * Use this in API route handlers.
 */
export function createRouteRateLimit(route: string, options?: Partial<RateLimitOptions>) {
  return (ip: string, userId?: string) => {
    const key = userId ? `${route}:${userId}` : `${route}:${ip}`;
    return checkRateLimit(key, options);
  };
}

/**
 * Rate limit configurations for different API routes.
 */
export const rateLimits = {
  chat: createRouteRateLimit("chat", { limit: 30, windowMs: 60000 }),
  auth: createRouteRateLimit("auth", { limit: 5, windowMs: 60000 }),
  checkout: createRouteRateLimit("checkout", { limit: 10, windowMs: 60000 }),
  api: createRouteRateLimit("api", { limit: 200, windowMs: 60000 }),
};
