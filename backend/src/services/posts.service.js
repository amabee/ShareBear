import {
  createPost as createPostRepo,
  updatePost as updatePostRepo,
  softDeletePost as softDeletePostRepo,
  restorePost as restorePostRepo,
  getPosts as getPostsRepo,
  getPost as getPostRepo,
} from "../repositories/posts.repository.js";

export const createPost = async (prisma, userId, postData) => {
  return await prisma.$transaction(async (tx) => {
    return await createPostRepo(tx, userId, postData);
  });
};

export const updatePost = async (prisma, postId, userId, updateData) => {
  return await prisma.$transaction(async (tx) => {
    const result = await updatePostRepo(tx, postId, userId, updateData);
    if (result.count === 0) return null;
    return await tx.post.findUnique({ where: { id: postId } });
  });
};

export const softDeletePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    const result = await softDeletePostRepo(tx, postId, userId);
    return result.count > 0;
  });
};

export const restorePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    const result = await restorePostRepo(tx, postId, userId);
    if (result.count === 0) return null;
    return await tx.post.findUnique({ where: { id: postId } });
  });
};

export const getPosts = async (prisma, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostsRepo(tx, userId);
  });
};

export const getPost = async (prisma, postId) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostRepo(tx, postId);
  });
};
