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
      },
    },
    // ⛔ Prevent clickjacking (deny iframe embedding)
    frameguard: {
      action: "deny",
    },
    // 🔐 Enforce HTTPS with HSTS
    // hsts: {
    //   maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    //   includeSubDomains: true,
    //   preload: true,
    // },
    // Optional: hide `X-Powered-By: Fastify` header
    hidePoweredBy: true,
  });
}

export default fp(helmetPlugin);
