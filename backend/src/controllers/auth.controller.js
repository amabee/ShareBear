import bcrypt from "bcrypt";
import {
  deleteUserSession,
  findSessionByToken,
  findUserByEmailOrUsername,
  logoutDeleteSession,
  rotateRefreshToken,
  storeRefreshToken,
  updateLastUpdatedTimeStamp,
} from "../repositories/auth.repository.js";
import {
  logAuthEvent,
  logError,
  logSecurityEvent,
  logUserAction,
} from "../utils/system-logger.js";
import crypto from "crypto";
import { registerUser } from "../services/auth.services.js";

export const register = async (req, reply) => {
  const { email, password, userInfo } = req.body;

  try {
    const user = await registerUser(
      req.server.prisma,
      email,
      password,
      userInfo
    );

    await logAuthEvent(
      req.server.prisma,
      `User ${email} successfully registered`,
      req
    );

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

    // if (error.code === "P2002") {
    //   const field = error.meta?.target?.[0];
    //   if (field === "username") {
    //     return reply
    //       .status(409)
    //       .send({ error: "Username already taken. Please try again." });
    //   }
    //   if (field === "email") {
    //     return reply.status(409).send({ error: "Email already in use" });
    //   }
    // }

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

    // Input validation
    if (!usercred || !password) {
      await logSecurityEvent(
        req.server.prisma,
        "Login attempt with missing credentials",
        req,
        "WARN",
        {
          usercred: usercred ? "provided" : "missing",
          password: password ? "provided" : "missing",
        }
      );
      return reply
        .status(400)
        .send({ error: "Username/email and password are required" });
    }

    // Find user
    const user = await findUserByEmailOrUsername(req.server.prisma, usercred);

    if (!user) {
      await logSecurityEvent(
        req.server.prisma,
        "Failed login attempt - user not found",
        req,
        "WARN",
        {
          attemptedCredential: usercred.substring(0, 3) + "***", // Partial masking
          reason: "user_not_found",
        }
      );
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      await logSecurityEvent(
        req.server.prisma,
        "Login attempt on inactive account",
        req,
        "WARN",
        {
          userId: user.id,
          username: user.username,
          reason: "account_inactive",
        }
      );
      return reply.status(401).send({ error: "Account is inactive" });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      await logSecurityEvent(
        req.server.prisma,
        "Failed login attempt - invalid password",
        req,
        "WARN",
        {
          userId: user.id,
          username: user.username,
          reason: "invalid_password",
        }
      );
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    // Generate JWT access token
    const token = await reply.jwtSign({
      userId: user.id,
      username: user.username,
    });

    // Generate secure random refresh token
    const refreshToken = crypto.randomBytes(48).toString("hex");
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store refresh token in UserSession
    await storeRefreshToken(
      req.server.prisma,
      user.id,
      req,
      refreshToken,
      refreshTokenExpiry
    );

    // Log successful login
    await logUserAction(req.server.prisma, user.id, "login", req, {
      username: user.username,
      loginMethod: "password",
      duration: Date.now() - startTime,
    });

    // Update last active timestamp

    await updateLastUpdatedTimeStamp(req.server.prisma, user.id);

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

    if (!refreshToken) {
      return reply.status(400).send({ error: "Refresh token is required" });
    }

    const session = await findSessionByToken(req.server.prisma, refreshToken);

    if (!session || !session.user) {
      return reply.status(401).send({ error: "Invalid refresh token" });
    }

    if (session.expiresAt < new Date()) {
      await deleteUserSession(req.server.prisma, session.id);
      return reply.status(401).send({ error: "Refresh token expired" });
    }

    const token = await reply.jwtSign({
      userId: session.user.id,
      username: session.user.username,
    });

    const newRefreshToken = crypto.randomBytes(48).toString("hex");
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await rotateRefreshToken(
      req.server.prisma,
      session,
      newRefreshToken,
      newExpiry,
      req
    );

    return reply.send({
      token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return reply.status(500).send({ error: "Internal server error" });
  }
};

export const logout = async (req, reply) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return reply.status(400).send({ error: "Refresh token is required" });
    }

    const deleted = await logoutDeleteSession(req.server.prisma, refreshToken);

    if (deleted.count === 0) {
      return reply.status(401).send({ error: "Invalid refresh token" });
    }

    return reply.send({ message: "Logged out successfully" });
  } catch (error) {
    return reply.status(500).send({ error: "Internal server error" });
  }
};
