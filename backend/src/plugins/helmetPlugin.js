import helmet from "@fastify/helmet";
import fp from "fastify-plugin";

async function helmetPlugin(app) {
  app.register(helmet, {
    global: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // useful for dev
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        mediaSrc: ["'self'", "http://localhost:3000"],
      },
    },
    // ⛔ Prevent clickjacking (deny iframe embedding)
    frameguard: {
      action: "deny",
    },
    // 🔐 Enforce HTTPS with HSTS
    hsts: {
      maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    hidePoweredBy: true,
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
    crossOriginEmbedderPolicy: false,
  });
}

export default fp(helmetPlugin);
