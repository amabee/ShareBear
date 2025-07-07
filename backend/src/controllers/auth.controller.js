import bcrypt from "bcrypt";
import {
  findUserByEmail,
  findUserByEmailOrUsername,
} from "../repositories/auth.repository.js";
import { numericString } from "../utils/username-generator.js";
import {
  logAuthEvent,
  logError,
  logSecurityEvent,
  logUserAction,
} from "../utils/system-logger.js";
import crypto from "crypto";

export const register = async (req, reply) => {
  const { email, password, userInfo } = req.body;

  const existingUser = await findUserByEmail(req.server.prisma, email);
  if (existingUser) {
    return reply.status(409).send({ error: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await req.server.prisma.user.create({
      data: {
        email,
        username: numericString,
        passwordHash: hashedPassword,
        userInfo: {
          create: {
            firstName: userInfo?.firstName,
            middleName: userInfo.middleName,
            lastName: userInfo?.lastName,
            gender: userInfo?.gender,
            birthDate: userInfo?.birthDate,
            location: userInfo?.location,
          },
        },
      },
      include: {
        userInfo: true,
      },
    });

    return reply.status(201).send({
      message: "User registered",
      user,
    });
  } catch (error) {
    console.error("Registration failed:", error);
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
    await req.server.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken,
        deviceInfo: req.headers["user-agent"] || null,
        ipAddress: req.ip || null,
        expiresAt: refreshTokenExpiry,
      },
    });

    // Log successful login
    await logUserAction(req.server.prisma, user.id, "login", req, {
      username: user.username,
      loginMethod: "password",
      duration: Date.now() - startTime,
    });

    // Update last active timestamp
    await req.server.prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    return reply.send({
      message: "Login successful",
      token, // JWT access token
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    // Log the error
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

    // Find session by refresh token
    const session = await req.server.prisma.userSession.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return reply.status(401).send({ error: "Invalid refresh token" });
    }

    // Check expiry
    if (session.expiresAt < new Date()) {
      // Optionally, delete expired session
      await req.server.prisma.userSession.delete({ where: { id: session.id } });
      return reply.status(401).send({ error: "Refresh token expired" });
    }

    // Issue new JWT access token
    const token = await reply.jwtSign({
      userId: session.user.id,
      username: session.user.username,
    });

    // Optionally, rotate refresh token (generate new one and update session)
    const newRefreshToken = crypto.randomBytes(48).toString("hex");
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await req.server.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: newExpiry,
        deviceInfo: req.headers["user-agent"] || null,
        ipAddress: req.ip || null,
      },
    });

    return reply.send({
      token, // new JWT access token
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return reply.status(500).send({ error: "Internal server error" });
  }
};
