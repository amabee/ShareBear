import {
  updatePost as updatePostRepo,
  softDeletePost as softDeletePostRepo,
  restorePost as restorePostRepo,
  getPosts as getPostsRepo,
  getPost as getPostRepo,
  getPostsByHashtag as getPostsByHashtagRepo,
  getTrendingHashtags as getTrendingHashtagsRepo,
  createPost as createPostRepo,
  likePost as likePostRepo,
  unlikePost as unlikePostRepo,
  createComment as createCommentRepo,
  updateComment as updateCommentRepo,
  deleteComment as deleteCommentRepo,
  getComments as getCommentsRepo,
  sharePost as sharePostRepo,
  unsharePost as unsharePostRepo,
  getShares as getSharesRepo,
} from "../repositories/posts.repository.js";

export const createPost = async (prisma, userId, postData) => {
  return await prisma.$transaction(async (tx) => {
    return await createPostRepo(tx, userId, postData);
  });
};

export const updatePost = async (prisma, postId, userId, updateData) => {
  return await prisma.$transaction(async (tx) => {
    return await updatePostRepo(tx, postId, userId, updateData);
  });
};

export const softDeletePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await softDeletePostRepo(tx, postId, userId);
  });
};

export const restorePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await restorePostRepo(tx, postId, userId);
  });
};

export const getPosts = async (prisma, userId, paginationOptions = {}) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostsRepo(tx, userId, paginationOptions);
  });
};

export const getPost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostRepo(tx, postId, userId);
  });
};

export const getPostsByHashtag = async (
  prisma,
  hashtagName,
  userId,
  paginationOptions = {}
) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostsByHashtagRepo(
      tx,
      hashtagName,
      userId,
      paginationOptions
    );
  });
};

export const getTrendingHashtags = async (prisma, limit) => {
  return await prisma.$transaction(async (tx) => {
    return await getTrendingHashtagsRepo(tx, limit);
  });
};

// Like functionality
export const likePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await likePostRepo(tx, postId, userId);
  });
};

export const unlikePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await unlikePostRepo(tx, postId, userId);
  });
};

// Comment functionality
export const createComment = async (prisma, postId, userId, commentData) => {
  return await prisma.$transaction(async (tx) => {
    return await createCommentRepo(tx, postId, userId, commentData);
  });
};

export const updateComment = async (prisma, commentId, userId, updateData) => {
  return await prisma.$transaction(async (tx) => {
    return await updateCommentRepo(tx, commentId, userId, updateData);
  });
};

export const deleteComment = async (prisma, commentId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await deleteCommentRepo(tx, commentId, userId);
  });
};

export const getComments = async (prisma, postId, paginationOptions = {}) => {
  return await prisma.$transaction(async (tx) => {
    return await getCommentsRepo(tx, postId, paginationOptions);
  });
};

// Share functionality
export const sharePost = async (prisma, postId, userId, shareData = {}) => {
  return await prisma.$transaction(async (tx) => {
    return await sharePostRepo(tx, postId, userId, shareData);
  });
};

export const unsharePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await unsharePostRepo(tx, postId, userId);
  });
};

export const getShares = async (prisma, postId, paginationOptions = {}) => {
  return await prisma.$transaction(async (tx) => {
    return await getSharesRepo(tx, postId, paginationOptions);
  });
};
