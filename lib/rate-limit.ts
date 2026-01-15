import type { NextApiRequest, NextApiResponse } from "next";

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  limit: number; // Max requests per interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Note: This resets on server restart and doesn't work across multiple instances
// For production with multiple instances, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }
  return req.socket?.remoteAddress || "unknown";
}

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<boolean> {
    const ip = getClientIp(req);
    const key = `${ip}:${req.url}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.interval,
      });
      return true;
    }

    if (entry.count >= config.limit) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      res.status(429).json({
        success: false,
        error: "Too many requests. Please try again later.",
      });
      return false;
    }

    // Increment counter
    entry.count++;
    return true;
  };
}

// Pre-configured rate limiters
export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  limit: 10, // 10 requests per minute
});

export const strictRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  limit: 5, // 5 requests per minute
});
