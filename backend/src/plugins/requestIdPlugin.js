import fp from "fastify-plugin";
import { randomUUID } from "crypto";
async function requestIdPlugin(app, options) {
  const {
    headerName = "x-request-id",
    logLabel = "reqId",
    addToResponse = true,
    generator = randomUUID,
  } = options;

  app.addHook("onRequest", async (request, reply) => {
    request.id = request.headers[headerName.toLowerCase()] || generator();

    if (addToResponse) {
      reply.header(headerName, request.id);
    }
    request.log = request.log.child({ [logLabel]: request.id });
  });
}

export default fp(requestIdPlugin, {
  fastify: "5.x",
  name: "request-id-plugin"
});
