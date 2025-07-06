import bcrypt from "bcrypt";
import { findUserByEmail } from "../repositories/auth.repository.js";
import { numericString } from "../utils/username-generator.js";

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
  const { email, password } = req.body;

  const user = await findUserByEmail(req.server.prisma, email);

  if (!user) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }

  const token = await reply.jwtSign({
    userId: user.id,
    username: user.username,
  });

  return reply.send({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
};
