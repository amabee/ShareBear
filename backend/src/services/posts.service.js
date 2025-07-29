import {
  createPost as createPostRepo,
  updatePost as updatePostRepo,
  softDeletePost as softDeletePostRepo,
  restorePost as restorePostRepo,
  getPosts as getPostsRepo,
  getPost as getPostRepo,
  getPostsByHashtag as getPostsByHashtagRepo,
  getTrendingHashtags as getTrendingHashtagsRepo,
} from "../repositories/posts.repository.js";

export const createPost = async (prisma, userId, postData) => {
  return await prisma.$transaction(async (tx) => {
    // Create the post first
    const post = await tx.post.create({
      data: {
        userId,
        contentType: postData.contentType,
        caption: postData.caption,
        contentUrl: postData.contentUrl,
        thumbnailUrl: postData.thumbnailUrl,
        location: postData.location,
        taggedUsers: postData.taggedUsers,
        privacyLevel: postData.privacyLevel,
        allowsComments: postData.allowsComments,
        allowsShares: postData.allowsShares,
        expiresAt: postData.expiresAt,
      },
    });

    // Extract and process hashtags from caption
    if (postData.caption) {
      const { extractHashtags, processHashtags } = await import("../utils/hashtag-utils.js");
      const hashtags = extractHashtags(postData.caption);
      if (hashtags.length > 0) {
        await processHashtags(tx, post.id, hashtags);
      }
    }

    return post;
  });
};

export const updatePost = async (prisma, postId, userId, updateData) => {
  return await prisma.$transaction(async (tx) => {
    // Update the post
    const result = await tx.post.updateMany({
      where: { id: postId, userId, isDeleted: false },
      data: updateData,
    });

    if (result.count === 0) return null;

    // If caption was updated, process hashtags
    if (updateData.caption !== undefined) {
      const { extractHashtags, processHashtags, removePostHashtags } = await import("../utils/hashtag-utils.js");
      
      // Remove existing hashtag relationships
      await removePostHashtags(tx, postId);
      
      // Extract and process new hashtags
      const hashtags = extractHashtags(updateData.caption);
      if (hashtags.length > 0) {
        await processHashtags(tx, postId, hashtags);
      }
    }

    return await tx.post.findUnique({ where: { id: postId } });
  });
};

export const softDeletePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    // Soft delete the post
    const result = await tx.post.updateMany({
      where: { id: postId, userId, isDeleted: false },
      data: { isDeleted: true },
    });

    // If post was found and updated, remove hashtag relationships
    if (result.count > 0) {
      const { removePostHashtags } = await import("../utils/hashtag-utils.js");
      await removePostHashtags(tx, postId);
    }

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

export const getPostsByHashtag = async (prisma, hashtagName, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostsByHashtagRepo(tx, hashtagName, userId);
  });
};

export const getTrendingHashtags = async (prisma, limit) => {
  return await prisma.$transaction(async (tx) => {
    return await getTrendingHashtagsRepo(tx, limit);
  });
};
