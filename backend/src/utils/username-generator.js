import { customAlphabet } from "nanoid";
import { findUserByUsername } from "../repositories/auth.repository.js";

const nanoid = customAlphabet("0123456789", 10);

export const generateUniqueUsername = async (prisma) => {
  let username;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    username = nanoid();
    attempts++;

    const existingUser = await findUserByUsername(prisma, username);

    if (!existingUser) {
      return username;
    }
  } while (attempts < maxAttempts);

  throw new Error("Unable to generate unique username after multiple attempts");
};

export const numericString = nanoid();
