import { login, register } from "../controllers/auth.controller.js";

export default async function authRoutes(fastify, opts) {
  fastify.post("/register", register);
  fastify.post("/login", login);
}
