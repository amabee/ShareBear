import fp from "fastify-plugin";

async function antiBotPlugin(app) {
  const suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /python/i,
    // /curl/i, // Disabled: curl is commonly used for legitimate API testing and automation
    /wget/i,
    /gpt/i,
    /openai/i,
    /claude/i,
    /bard/i,
  ];

  app.addHook("preHandler", async (request, reply) => {
    const userAgent = request.headers["user-agent"] || "";

    if (suspiciousUserAgents.some((pattern) => pattern.test(userAgent))) {
      app.log.warn(`Suspicious user agent: ${userAgent}`);

      return reply.code(403).send({ error: "Access denied" });
    }
  });
}

export default fp(antiBotPlugin);
