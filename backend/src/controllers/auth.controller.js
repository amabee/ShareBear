import bcrypt from "bcrypt";
import {
  findUserByEmail,
  findUserByEmailOrUsername,
} from "../repositories/auth.repository.js";
import { numericString } from "../utils/username-generator.js";
import { logEvent } from "../utils/system-logger.js";

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
  const { usercred, password } = req.body;

  const user = await findUserByEmailOrUsername(req.server.prisma, usercred);

  if (!user) {
    await logEvent(
      req.server.prisma,
      "INFO",
      "auth-service",
      "Failed Login Attempt. username or email not found on database.",
      req.ip,
      req.headers["user-agent"]
    );

    return reply.status(401).send({ error: "Invalid credentials" });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    await logEvent(
      req.server.prisma,
      "INFO",
      "auth-service",
      "Failed Login Attempt. Invalid password.",
      req.ip,
      req.headers["user-agent"]
    );
    return reply.status(401).send({ error: "Invalid credentials" });
  }

  const token = await reply.jwtSign({
    userId: user.id,
    username: user.username,
  });

  await logEvent(
    req.server.prisma,
    "INFO",
    "auth-service",
    `Successful Login Attempt for user ${user.username}`,
    req.ip,
    req.headers["user-agent"]
  );

  return reply.send({
    message: "Login successful",
    token,
    user: {
      email: user.email,
      username: user.username,
    },
  });
};
