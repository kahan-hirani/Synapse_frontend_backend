const Redis = require("ioredis");

const shouldUseTls = String(process.env.REDIS_TLS || "false").toLowerCase() === "true";

const redisOptions = process.env.REDIS_URL
  ? {
      // Prefer URL mode for managed providers (e.g. Upstash).
      lazyConnect: false,
      tls: shouldUseTls ? {} : undefined,
    }
  : {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      tls: shouldUseTls ? {} : undefined,
    };

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, redisOptions)
  : new Redis(redisOptions);

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redis;
