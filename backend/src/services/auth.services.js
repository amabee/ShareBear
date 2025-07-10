import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
} from "../repositories/auth.repository.js";
import { generateUniqueUsername } from "../utils/username-generator.js";

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
