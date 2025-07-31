import cors from "@fastify/cors";
import fp from "fastify-plugin";
import { config } from "../config/index.js";

async function corsPlugin(app) {
  const origins = config.cors?.origin || ["http://192.168.1.3:3000"];

  app.register(cors, {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (origins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Range",
      "Accept-Ranges",
      "Content-Range",
    ],
    exposedHeaders: [
      "X-Total-Count",
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
      "Accept-Ranges",
      "Content-Range",
      "Content-Length",
    ],
  });
}

export default fp(corsPlugin);
