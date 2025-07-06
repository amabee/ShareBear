import fp from "fastify-plugin";

async function requestTrackerPlugin(app) {
  const requestTracker = new Map();

  app.addHook("preHandler", async (req, reply) => {
    const clientId = req.ip;
    const now = Date.now();

    if (!requestTracker.has(clientId)) {
      requestTracker.set(clientId, { count: 1, firstRequest: now });
    } else {
      const data = requestTracker.get(clientId);

      data.count++;

      // Flag the user or client if there are too many request! like wtf bro chill down

      if (data.count > 50 && now - data.firstRequest < 60000) {
        app.log.warn(`Potential bot activity from ${clientId}`);
      }
    }
  });
}

export default fp(requestTrackerPlugin);
