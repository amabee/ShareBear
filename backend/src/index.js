import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma.js";
import jwtPlugin from "./plugins/jwtPlugin.js";
import { config } from "./config/index.js";
import helloRoutes from "./routes/hello.routes.js";
import authRoutes from "./routes/auth.routes.js";
import helmetPlugin from "./plugins/helmetPlugin.js";
import rateLimitPlugin from "./plugins/ratelimitPlugin.js";
import corsPlugin from "./plugins/corsPlugin.js";
import antiBotPlugin from "./plugins/antiBotPlugin.js";
import requestPatternPlugin from "./plugins/requestPatternPlugin.js";

const app = Fastify({
  trustProxy: true,
  logger: {
    level: "warn",
    prettyPrint: false,
  },
});

// PLUGINS

app.register(prismaPlugin);
app.register(jwtPlugin);
app.register(helmetPlugin);
app.register(rateLimitPlugin);
app.register(corsPlugin);
app.register(antiBotPlugin);
app.register(requestPatternPlugin);

// ROUTES
app.register(helloRoutes, { prefix: "/api" });
app.register(authRoutes, { prefix: "/api/auth" });

app.listen({ port: config.port, host: config.host }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  console.log(`🚀 Server running at port: ${address}`);
});
