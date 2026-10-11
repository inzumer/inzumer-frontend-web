/** Sliding-window limiter kept in memory (per server instance): at most `limit` hits per window. */
export const createRateLimiter = ({ limit, windowMs }: { limit: number; windowMs: number }) => {
  const hits = new Map<string, number[]>();

  return (key: string, now: number = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

    if (recent.length >= limit) {
      hits.set(key, recent);

      return false;
    }

    hits.set(key, [...recent, now]);

    return true;
  };
};
