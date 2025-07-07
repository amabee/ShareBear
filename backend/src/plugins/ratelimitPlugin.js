import rateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";

async function rateLimitPlugin(app) {
  app.register(rateLimit, {
    max: 20,
    timeWindow: "1 minute",
    keyGenerator: (req) => {
      return (
        req.headers["x-forwarded-for"] ||
        req.headers["x-real-ip"] ||
        req.ip ||
        req.connection.remoteAddress
      );
    },
    addHeaders: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
      "x-ratelimit-reset": true,
    },
    errorResponseBuilder: (req, context) => ({
      code: 429,
      error: "Too many requests",
      message:
        process.env.NODE_ENV === "production"
          ? `Rate limit exceeded, retry in ${context.ttl}ms`
          : `Too many requests bitch! 🤬🤬 (retry in ${context.ttl}ms)`,
    }),
  });
}

export default fp(rateLimitPlugin);
