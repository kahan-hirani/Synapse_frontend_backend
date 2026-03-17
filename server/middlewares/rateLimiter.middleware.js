const redis = require("../db/redis");

// rateLimit(maxRequests, windowInSeconds)
const rateLimiter = (maxRequests, windowInSeconds) => {
  return async (req, res, next) => {
    try {
      const userId = req.user ? req.user.id : req.ip; // prefer userId, fallback to IP
      const key = `rate:${userId}`;

      // increment request count
      const current = await redis.incr(key);

      if (current === 1) {
        // set TTL for first request
        await redis.expire(key, windowInSeconds);
      }

      if (current > maxRequests) {
        return res.status(429).json({
          success: false,
          message: `Too many requests. Limit is ${maxRequests} per ${windowInSeconds} seconds.`,
        });
      }

      next();
    } catch (err) {
      console.error("RateLimiter Error:", err);
      next(); // fail-open (don’t block request if Redis fails)
    }
  };
};

module.exports = rateLimiter;
