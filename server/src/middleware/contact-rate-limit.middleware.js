const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const clients = new Map();

const cleanupExpiredEntries = () => {
  const now = Date.now();

  for (const [ip, entry] of clients.entries()) {
    if (now - entry.windowStart >= WINDOW_MS) {
      clients.delete(ip);
    }
  }
};

const contactRateLimit = (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  const existing = clients.get(ip);

  if (!existing || now - existing.windowStart >= WINDOW_MS) {
    clients.set(ip, {
      count: 1,
      windowStart: now,
    });

    return next();
  }

  if (existing.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil(
      (WINDOW_MS - (now - existing.windowStart)) / 1000
    );

    res.setHeader("Retry-After", retryAfterSeconds);

    return res.status(429).json({
      success: false,
      message:
        "Too many contact requests. Please try again later.",
    });
  }

  existing.count += 1;

  return next();
};

const cleanupInterval = setInterval(
  cleanupExpiredEntries,
  WINDOW_MS
);

cleanupInterval.unref();

export default contactRateLimit;