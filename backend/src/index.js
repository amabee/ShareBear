import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma.js";
import { config } from "./config/index.js";
import helloRoutes from "./routes/hello.routes.js";
import authRoutes from "./routes/auth.routes.js";
import jwtPlugin from "./plugins/jwtPlugin.js";

const app = Fastify({
  logger: {
    level: "warn",
    prettyPrint: false,
  },
});

// PLUGINS
app.register(prismaPlugin);
app.register(jwtPlugin);

// ROUTES
app.register(helloRoutes, { prefix: "/api" });
app.register(authRoutes, { prefix: "/api/auth" });

app.listen({ port: config.port }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  console.log(`🚀 Server running at port: ${address}`);
});
