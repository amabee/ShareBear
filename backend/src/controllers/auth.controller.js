import {
  logAuthEvent,
  logError,
  logUserAction,
} from "../utils/system-logger.js";
import {
  registerUser,
  loginUser,
  generateTokens,
  refreshUserToken,
  logoutUser,
} from "../services/auth.service.js";
import { sanitizeInput, encodeOutput } from "../utils/sanitize.js";
import { v4 as uuidv4 } from "uuid";
import redis from "../plugins/redisClient.js";

export const register = async (req, reply) => {
  // Sanitize userInfo fields
  const { email, password, userInfo } = req.body;
  const sanitizedUserInfo = userInfo
    ? {
        ...userInfo,
        firstName: sanitizeInput(userInfo.firstName),
        lastName: sanitizeInput(userInfo.lastName),
        location: sanitizeInput(userInfo.location),
        gender: sanitizeInput(userInfo.gender),
      }
    : userInfo;

  try {
    const user = await registerUser(
      req.server.prisma,
      email,
      password,
      sanitizedUserInfo
    );

    await logAuthEvent(
      req.server.prisma,
      `User ${email} successfully registered`,
      req
    );

    // Encode output fields before sending
    if (user && user.userInfo) {
      user.userInfo.firstName = encodeOutput(user.userInfo.firstName);
      user.userInfo.lastName = encodeOutput(user.userInfo.lastName);
      user.userInfo.location = encodeOutput(user.userInfo.location);
      user.userInfo.gender = encodeOutput(user.userInfo.gender);
    }

    return reply.status(201).send({ message: "User registered", user });
  } catch (error) {
    if (error.code === "EMAIL_IN_USE") {
      return reply.status(409).send({ error: "Email already in use" });
    }

    if (
      error.message ===
      "Unable to generate unique username after multiple attempts"
    ) {
      return reply
        .status(500)
        .send({ error: "Unable to create account. Please try again." });
    }

    // Handle Prisma unique constraint violations
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "username") {
        return reply
          .status(409)
          .send({ error: "Username already taken. Please try again." });
      }
      if (field === "email") {
        return reply.status(409).send({ error: "Email already in use" });
      }
    }

    await logError(req.server.prisma, error, "auth-service", req, {
      operation: "register",
      context: { email: req.body?.email?.substring(0, 3) + "***" },
    });

    console.log(`Error Message: ${error}`);

    return reply.status(500).send({ error: "Registration failed" });
  }
};

export const login = async (req, reply) => {
  const startTime = Date.now();

  try {
    const { usercred, password } = req.body;

    // Authenticate user
    const user = await loginUser(req.server.prisma, usercred, password, req);

    // Generate JWT access token
    const token = await reply.jwtSign({
      userId: user.id,
      username: user.username,
      jti: uuidv4(),
    });

    // Generate refresh token and store session
    const { refreshToken } = await generateTokens(req.server.prisma, user, req);

    // Log successful login
    await logUserAction(req.server.prisma, user.id, "login", req, {
      username: user.username,
      loginMethod: "password",
      duration: Date.now() - startTime,
    });

    return reply.send({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    // Handle specific error codes
    if (error.code === "MISSING_CREDENTIALS") {
      return reply.status(400).send({ error: error.message });
    }

    if (error.code === "INVALID_CREDENTIALS") {
      return reply.status(401).send({ error: error.message });
    }

    if (error.code === "INACTIVE_ACCOUNT") {
      return reply.status(401).send({ error: error.message });
    }

    await logError(req.server.prisma, error, "auth-service", req, {
      operation: "login",
      duration: Date.now() - startTime,
      context: { usercred: req.body?.usercred?.substring(0, 3) + "***" },
    });

    return reply.status(500).send({ error: "Internal server error" });
  }
};

export const refreshToken = async (req, reply) => {
  try {
    const { refreshToken } = req.body;

    // Refresh the token
    const { user, newRefreshToken } = await refreshUserToken(
      req.server.prisma,
      refreshToken,
      req
    );

    // Generate new JWT access token
    const token = await reply.jwtSign({
      userId: user.id,
      username: user.username,
      jti: uuidv4(),
    });

    return reply.send({
      token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.code === "MISSING_REFRESH_TOKEN") {
      return reply.status(400).send({ error: error.message });
    }

    if (error.code === "INVALID_REFRESH_TOKEN") {
      return reply.status(401).send({ error: error.message });
    }

    if (error.code === "EXPIRED_REFRESH_TOKEN") {
      return reply.status(401).send({ error: error.message });
    }

    await logError(req.server.prisma, error, "auth-service", req, {
      operation: "refresh_token",
    });

    return reply.status(500).send({ error: "Internal server error" });
  }
};

export const logout = async (req, reply) => {
  try {
    const { refreshToken } = req.body;

    // Blacklist the current JWT's jti
    const jti = req.user?.jti;
    if (jti) {
      // Get token expiry in seconds
      const exp = req.user?.exp;
      const now = Math.floor(Date.now() / 1000);
      const ttl = exp && exp > now ? exp - now : 900; // fallback 15m
      await redis.set(`blacklist:jti:${jti}`, "1", "EX", ttl);
    }

    await logoutUser(req.server.prisma, refreshToken);

    return reply.send({ message: "Logged out successfully" });
  } catch (error) {
    if (error.code === "MISSING_REFRESH_TOKEN") {
      return reply.status(400).send({ error: error.message });
    }

    if (error.code === "INVALID_REFRESH_TOKEN") {
      return reply.status(401).send({ error: error.message });
    }

    await logError(req.server.prisma, error, "auth-service", req, {
      operation: "logout",
    });

    return reply.status(500).send({ error: "Internal server error" });
  }
};
