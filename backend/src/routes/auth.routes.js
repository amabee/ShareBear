import { login, register } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../schema/authSchemas.js";

export default async function authRoutes(fastify, opts) {
  fastify.post("/register", { schema: registerSchema }, register);
  fastify.post("/login", { schema: loginSchema }, login);
}
