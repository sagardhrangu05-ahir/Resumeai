const requests = new Map();

function evictExpired() {
  const now = Date.now();
  for (const [ip, entry] of requests) {
    if (now > entry.resetAt) requests.delete(ip);
  }
}

export function rateLimit(ip, { windowMs = 60_000, max = 10 } = {}) {
  const now = Date.now();

  // Evict stale entries periodically (every ~100 calls)
  if (requests.size > 0 && Math.random() < 0.01) evictExpired();

  const entry = requests.get(ip) || { count: 0, resetAt: now + windowMs };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }

  entry.count += 1;
  requests.set(ip, entry);

  return entry.count <= max;
}
