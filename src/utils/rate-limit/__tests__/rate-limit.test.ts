import { createRateLimiter } from '../rate-limit';

describe('createRateLimiter', () => {
  it('should allow up to the limit per key and window', () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 });

    expect(allow('a', 0)).toBe(true);
    expect(allow('a', 10)).toBe(true);
    expect(allow('a', 20)).toBe(false);
    expect(allow('b', 20)).toBe(true);
  });

  it('should let hits through again once the window passes', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });

    expect(allow('a', 0)).toBe(true);
    expect(allow('a', 999)).toBe(false);
    expect(allow('a', 1000)).toBe(true);
  });

  it('should use the current time by default', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 60_000 });

    expect(allow('a')).toBe(true);
    expect(allow('a')).toBe(false);
  });
});
