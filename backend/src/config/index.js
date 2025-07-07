import dotenv from "dotenv";
import path from "path";

// Load .env files based on NODE_ENV
const envPath = path.resolve(
  process.cwd(),
  `.env.${process.env.NODE_ENV || "development"}`
);

dotenv.config({ path: envPath, debug: false });

export const config = {
  isProd: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT || "9001", 10),
  host: process.env.HOST || "0.0.0.0",
  baseUrl: process.env.BASE_URL || "http://localhost:9001",
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || "").split(",").filter(origin => origin.trim() !== ""),
  },
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || "10485760"),
    allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || "").split(","),
    dir: process.env.UPLOAD_DIR || "./uploads",
  },
};
