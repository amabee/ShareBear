import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  createUser,
  findUserByEmail,
  findUserByEmailOrUsername,
  findSessionByToken,
  storeRefreshToken,
  rotateRefreshToken,
  logoutDeleteSession,
  updateLastUpdatedTimeStamp,
  deleteUserSession,
} from "../repositories/auth.repository.js";
import { generateUniqueUsername } from "../utils/username-generator.js";
import { logSecurityEvent, logUserAction } from "../utils/system-logger.js";

export async function registerUser(prisma, email, password, userInfo) {
  return await prisma.$transaction(async (tx) => {
    const existingUser = await findUserByEmail(tx, email);

    if (existingUser) {
      const error = new Error("Email already in use");
      error.code = "EMAIL_IN_USE";
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const uniqueUsername = await generateUniqueUsername(tx);

    return await createUser(
      tx,
      email,
      uniqueUsername,
      hashedPassword,
      userInfo
    );
  });
}

export async function loginUser(prisma, usercred, password, req) {
  // Input validation
  if (!usercred || !password) {
    await logSecurityEvent(
      prisma,
      "Login attempt with missing credentials",
      req,
      "WARN",
      {
        usercred: usercred ? "provided" : "missing",
        password: password ? "provided" : "missing",
      }
    );
    const error = new Error("Username/email and password are required");
    error.code = "MISSING_CREDENTIALS";
    throw error;
  }

  // Find user
  const user = await findUserByEmailOrUsername(prisma, usercred);

  if (!user) {
    await logSecurityEvent(
      prisma,
      "Failed login attempt - user not found",
      req,
      "WARN",
      {
        attemptedCredential: usercred.substring(0, 3) + "***",
        reason: "user_not_found",
      }
    );
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  // Check if user is active
  if (!user.isActive) {
    await logSecurityEvent(
      prisma,
      "Login attempt on inactive account",
      req,
      "WARN",
      {
        userId: user.id,
        username: user.username,
        reason: "account_inactive",
      }
    );
    const error = new Error("Account is inactive");
    error.code = "INACTIVE_ACCOUNT";
    throw error;
  }

  // Validate password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    await logSecurityEvent(
      prisma,
      "Failed login attempt - invalid password",
      req,
      "WARN",
      {
        userId: user.id,
        username: user.username,
        reason: "invalid_password",
      }
    );
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  return user;
}

export async function generateTokens(prisma, user, req) {
  // Generate secure random refresh token
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Store refresh token in UserSession
  await storeRefreshToken(
    prisma,
    user.id,
    req,
    refreshToken,
    refreshTokenExpiry
  );

  // Update last active timestamp
  await updateLastUpdatedTimeStamp(prisma, user.id);

  return {
    refreshToken,
    refreshTokenExpiry,
  };
}

export async function refreshUserToken(prisma, refreshToken, req) {
  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    error.code = "MISSING_REFRESH_TOKEN";
    throw error;
  }

  const session = await findSessionByToken(prisma, refreshToken);

  if (!session || !session.user) {
    const error = new Error("Invalid refresh token");
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }

  if (session.expiresAt < new Date()) {
    await deleteUserSession(prisma, session.id);
    const error = new Error("Refresh token expired");
    error.code = "EXPIRED_REFRESH_TOKEN";
    throw error;
  }

  // Generate new refresh token
  const newRefreshToken = crypto.randomBytes(48).toString("hex");
  const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await rotateRefreshToken(prisma, session, newRefreshToken, newExpiry, req);

  return {
    user: session.user,
    newRefreshToken,
    newExpiry,
  };
}

export async function logoutUser(prisma, refreshToken) {
  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    error.code = "MISSING_REFRESH_TOKEN";
    throw error;
  }

  const deleted = await logoutDeleteSession(prisma, refreshToken);

  if (deleted.count === 0) {
    const error = new Error("Invalid refresh token");
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }

  return true;
}
