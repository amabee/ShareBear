import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma.js";
import jwtPlugin from "./plugins/jwtPlugin.js";
import { config } from "./config/index.js";
import helloRoutes from "./routes/hello.routes.js";
import authRoutes from "./routes/auth.routes.js";
import followRoutes from "./routes/follow.routes.js";
import helmetPlugin from "./plugins/helmetPlugin.js";
import rateLimitPlugin from "./plugins/ratelimitPlugin.js";
import corsPlugin from "./plugins/corsPlugin.js";
import antiBotPlugin from "./plugins/antiBotPlugin.js";
import requestPatternPlugin from "./plugins/requestPatternPlugin.js";
import requestIdPlugin from "./plugins/requestIdPlugin.js";
import ajvValidatorPlugin from "./plugins/ajvValidatorPlugin.js";
import postRoutes from "./routes/posts.routes.js";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";

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
app.register(requestIdPlugin);
app.register(ajvValidatorPlugin);

// Serve static files from uploads directory
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/media/",
  acceptRanges: true,
  lastModified: true,
  etag: true,
  maxAge: "1h",
  immutable: false,
  decorateReply: false,
  setHeaders: (res, path) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Range, Accept-Ranges, Content-Range"
    );
    res.setHeader(
      "Access-Control-Expose-Headers",
      "Accept-Ranges, Content-Range, Content-Length"
    );

    // Security headers
    res.setHeader("X-Content-Type-Options", "nosniff"); // Prevent MIME-type sniffing
    res.setHeader("X-Frame-Options", "DENY"); // Block embedding in iframes
    res.setHeader("Referrer-Policy", "no-referrer"); // Don’t leak referrer URLs
    res.setHeader("Permissions-Policy", "fullscreen=(), picture-in-picture=()"); // Disable fullscreen & PiP
  },
});

app.register(fastifyMultipart, {
  addToBody: true,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 10,
  },
});

// Custom Error Message Handler. fucking fastify and AJV! 😡😡😡😡

app.setErrorHandler((error, request, reply) => {
  console.log("Error details:", JSON.stringify(error, null, 2));

  if (error.validation && error.validation[0] && error.validation[0].message) {
    return reply.status(400).send({ error: error.validation[0].message });
  }

  if (error.validation) {
    return reply.status(400).send({
      error: "Validation error",
      details: error.validation,
    });
  }

  reply.send(error);
});

// ROUTES
app.register(helloRoutes, { prefix: "/api" });
app.register(authRoutes, { prefix: "/api/auth" });
app.register(followRoutes, { prefix: "/api/follow" });
app.register(postRoutes, { prefix: "/api/posts" });

app.listen({ port: config.port, host: config.host }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  console.log(`🚀 Server running at port: ${address}`);
});
