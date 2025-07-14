import { createPost as createPostRepo } from "../repositories/posts.repository.js";

export const createPost = async (prisma, userId, postData) => {
  return await createPostRepo(prisma, userId, postData);
};
