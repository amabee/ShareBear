// Helper function to get post creation date for cursor-based pagination
const getPostCreatedAt = async (prisma, postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { createdAt: true },
  });
  return post ? post.createdAt : new Date();
};

export const createPost = async (tx, userId, postData) => {
  // Create the post first
  const post = await tx.post.create({
    data: {
      userId,
      contentType: postData.contentType,
      caption: postData.caption,
      thumbnailUrl: postData.thumbnailUrl,
      location: postData.location,
      taggedUsers: postData.taggedUsers,
      privacyLevel: postData.privacyLevel,
      allowsComments: postData.allowsComments,
      allowsShares: postData.allowsShares,
      expiresAt: postData.expiresAt,
    },
  });

  // Handle image uploads if present
  if (postData.images && postData.images.length > 0) {
    const imageData = postData.images.map((image, index) => ({
      postId: post.id,
      imageUrl: image.url,
      altText: image.altText || null,
      displayOrder: index,
      width: image.width || null,
      height: image.height || null,
      fileSize: image.fileSize || null,
    }));

    await tx.postImage.createMany({
      data: imageData,
    });
  }

  // Extract and process hashtags from caption
  if (postData.caption) {
    const { extractHashtags, processHashtags } = await import(
      "../utils/hashtag-utils.js"
    );
    const hashtags = extractHashtags(postData.caption);
    if (hashtags.length > 0) {
      await processHashtags(tx, post.id, hashtags);
    }
  }

  return post;
};

export const updatePost = async (tx, postId, userId, updateData) => {
  // Update the post
  const result = await tx.post.updateMany({
    where: { id: postId, userId, isDeleted: false },
    data: updateData,
  });

  if (result.count === 0) return null;

  // Handle image updates if present
  if (updateData.images !== undefined) {
    // Delete existing images
    await tx.postImage.deleteMany({
      where: { postId },
    });

    // Create new images if provided
    if (updateData.images && updateData.images.length > 0) {
      const imageData = updateData.images.map((image, index) => ({
        postId,
        imageUrl: image.url,
        altText: image.altText || null,
        displayOrder: index,
        width: image.width || null,
        height: image.height || null,
        fileSize: image.fileSize || null,
      }));

      await tx.postImage.createMany({
        data: imageData,
      });
    }
  }

  // If caption was updated, process hashtags
  if (updateData.caption !== undefined) {
    const { extractHashtags, processHashtags, removePostHashtags } =
      await import("../utils/hashtag-utils.js");

    // Remove existing hashtag relationships
    await removePostHashtags(tx, postId);

    // Extract and process new hashtags
    const hashtags = extractHashtags(updateData.caption);
    if (hashtags.length > 0) {
      await processHashtags(tx, postId, hashtags);
    }
  }

  return await tx.post.findUnique({ where: { id: postId } });
};

export const softDeletePost = async (tx, postId, userId) => {
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
};

export const restorePost = async (tx, postId, userId) => {
  const result = await tx.post.updateMany({
    where: { id: postId, userId, isDeleted: true },
    data: { isDeleted: false },
  });

  if (result.count === 0) return null;
  return await tx.post.findUnique({ where: { id: postId } });
};

export const getPosts = async (tx, userId, paginationOptions = {}) => {
  const { page = 1, limit = 10, cursor } = paginationOptions;

  const following = await tx.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });

  // get the ids of users that the current user is following eg: john doe -> sam clarke, john doe -> Abby Cowin
  const followingIds = following.map((follow) => follow.followingId);

  // Include the own post of the current user here....
  const userIds = [...followingIds, userId];

  // Build the where clause
  const whereClause = {
    userId: { in: userIds },
    isDeleted: false,
  };

  // Add cursor-based pagination if cursor is provided
  if (cursor) {
    whereClause.createdAt = {
      lt: await getPostCreatedAt(tx, cursor),
    };
  }

  // Get total count for pagination metadata
  const totalPosts = await tx.post.count({
    where: {
      userId: { in: userIds },
      isDeleted: false,
    },
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalPosts / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Get posts with pagination
  const posts = await tx.post.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: cursor ? 0 : (page - 1) * limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
              displayName: true,
              profilePictureUrl: true,
              coverPhotoUrl: true,
              bio: true,
              location: true,
            },
          },
        },
      },
      images: {
        orderBy: {
          displayOrder: "asc",
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          shares: true,
        },
      },
      // Add this to check if current user liked the post
      likes: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
      hashtags: {
        include: {
          hashtag: {
            select: {
              id: true,
              name: true,
              usageCount: true,
            },
          },
        },
      },
    },
  });

  // Transform posts to include liked boolean
  const postsWithLikedStatus = posts.map((post) => ({
    ...post,
    liked: post.likes.length > 0, // true if user has liked this post
    likes: undefined, // Remove the likes array since we only needed it for checking
  }));

  // Get cursors for next and previous pages
  let nextCursor = null;
  let previousCursor = null;

  if (posts.length > 0) {
    const lastPost = posts[posts.length - 1];
    const firstPost = posts[0];

    // Check if there are more posts after the last one
    const hasMoreAfterLast = await tx.post.findFirst({
      where: {
        userId: { in: userIds },
        isDeleted: false,
        createdAt: {
          lt: lastPost.createdAt,
        },
      },
    });

    if (hasMoreAfterLast) {
      nextCursor = lastPost.id;
    }

    // Check if there are posts before the first one
    const hasMoreBeforeFirst = await tx.post.findFirst({
      where: {
        userId: { in: userIds },
        isDeleted: false,
        createdAt: {
          gt: firstPost.createdAt,
        },
      },
    });

    if (hasMoreBeforeFirst) {
      previousCursor = firstPost.id;
    }
  }

  return {
    posts: postsWithLikedStatus,
    pagination: {
      page,
      limit,
      totalPosts,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextCursor,
      previousCursor,
    },
  };
};

export const getPost = async (tx, postId, userId) => {
  const post = await tx.post.findUnique({
    where: {
      id: postId,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
              displayName: true,
              profilePictureUrl: true,
              coverPhotoUrl: true,
            },
          },
        },
      },
      images: {
        orderBy: {
          displayOrder: "asc",
        },
      },
      likes: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              userInfo: {
                select: {
                  profilePictureUrl: true,
                },
              },
            },
          },
        },
      },
      comments: {
        where: { isDeleted: false },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              userInfo: {
                select: {
                  profilePictureUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          shares: true,
        },
      },
      hashtags: {
        include: {
          hashtag: {
            select: {
              id: true,
              name: true,
              usageCount: true,
            },
          },
        },
      },
    },
  });

  if (!post) return null;

  // Add liked status for single post
  const userLike = post.likes.find((like) => like.user.id === userId);

  return {
    ...post,
    liked: !!userLike,
  };
};

export const getPostsByHashtag = async (
  tx,
  hashtagName,
  userId,
  paginationOptions = {}
) => {
  const { page = 1, limit = 10, cursor } = paginationOptions;

  // Build the where clause
  const whereClause = {
    isDeleted: false,
    hashtags: {
      some: {
        hashtag: {
          name: hashtagName.toLowerCase(),
        },
      },
    },
  };

  // Add cursor-based pagination if cursor is provided
  if (cursor) {
    whereClause.createdAt = {
      lt: await getPostCreatedAt(tx, cursor),
    };
  }

  // Get total count for pagination metadata
  const totalPosts = await tx.post.count({
    where: {
      isDeleted: false,
      hashtags: {
        some: {
          hashtag: {
            name: hashtagName.toLowerCase(),
          },
        },
      },
    },
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalPosts / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Get posts with pagination
  const posts = await tx.post.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: cursor ? 0 : (page - 1) * limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
              displayName: true,
              profilePictureUrl: true,
              coverPhotoUrl: true,
              bio: true,
              location: true,
            },
          },
        },
      },
      images: {
        orderBy: {
          displayOrder: "asc",
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          shares: true,
        },
      },
      // Add this to check if current user liked the post
      likes: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
      hashtags: {
        include: {
          hashtag: {
            select: {
              id: true,
              name: true,
              usageCount: true,
            },
          },
        },
      },
    },
  });

  // Transform posts to include liked boolean
  const postsWithLikedStatus = posts.map((post) => ({
    ...post,
    liked: post.likes.length > 0, // true if user has liked this post
    likes: undefined, // Remove the likes array since we only needed it for checking
  }));

  // Get cursors for next and previous pages
  let nextCursor = null;
  let previousCursor = null;

  if (posts.length > 0) {
    const lastPost = posts[posts.length - 1];
    const firstPost = posts[0];

    // Check if there are more posts after the last one
    const hasMoreAfterLast = await tx.post.findFirst({
      where: {
        isDeleted: false,
        hashtags: {
          some: {
            hashtag: {
              name: hashtagName.toLowerCase(),
            },
          },
        },
        createdAt: {
          lt: lastPost.createdAt,
        },
      },
    });

    if (hasMoreAfterLast) {
      nextCursor = lastPost.id;
    }

    // Check if there are posts before the first one
    const hasMoreBeforeFirst = await tx.post.findFirst({
      where: {
        isDeleted: false,
        hashtags: {
          some: {
            hashtag: {
              name: hashtagName.toLowerCase(),
            },
          },
        },
        createdAt: {
          gt: firstPost.createdAt,
        },
      },
    });

    if (hasMoreBeforeFirst) {
      previousCursor = firstPost.id;
    }
  }

  return {
    posts: postsWithLikedStatus,
    pagination: {
      page,
      limit,
      totalPosts,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextCursor,
      previousCursor,
    },
  };
};

export const getTrendingHashtags = async (tx, limit = 10) => {
  return await tx.hashtag.findMany({
    where: {
      isActive: true,
      usageCount: {
        gt: 0,
      },
    },
    orderBy: {
      usageCount: "desc",
    },
    take: limit,
    select: {
      id: true,
      name: true,
      usageCount: true,
      createdAt: true,
    },
  });
};

// Like functionality
export const likePost = async (tx, postId, userId) => {
  // Check if post exists and is not deleted
  const post = await tx.post.findFirst({
    where: { id: postId, isDeleted: false },
  });

  if (!post) {
    throw new Error("Post not found or has been deleted");
  }

  // Check if user already liked this post
  const existingLike = await tx.like.findFirst({
    where: { postId, userId },
  });

  if (existingLike) {
    throw new Error("Post already liked by user");
  }

  // Create the like
  const like = await tx.like.create({
    data: {
      postId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              displayName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
    },
  });

  return like;
};

export const unlikePost = async (tx, postId, userId) => {
  // Find and delete the like
  const result = await tx.like.deleteMany({
    where: { postId, userId },
  });

  if (result.count === 0) {
    throw new Error("Like not found");
  }

  return { success: true, message: "Post unliked successfully" };
};

// Comment functionality
export const createComment = async (tx, postId, userId, commentData) => {
  // Check if post exists and allows comments
  const post = await tx.post.findFirst({
    where: { id: postId, isDeleted: false },
  });

  if (!post) {
    throw new Error("Post not found or has been deleted");
  }

  if (!post.allowsComments) {
    throw new Error("Comments are not allowed on this post");
  }

  // Create the comment
  const comment = await tx.comment.create({
    data: {
      postId,
      userId,
      content: commentData.content,
      parentCommentId: commentData.parentCommentId || null, // Fixed field name
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              displayName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  return comment;
};

export const updateComment = async (tx, commentId, userId, updateData) => {
  // Update the comment (only if user owns it)
  const result = await tx.comment.updateMany({
    where: {
      id: commentId,
      userId,
      isDeleted: false,
    },
    data: {
      content: updateData.content,
      updatedAt: new Date(),
    },
  });

  if (result.count === 0) {
    throw new Error(
      "Comment not found or you don't have permission to update it"
    );
  }

  // Return the updated comment
  return await tx.comment.findUnique({
    where: { id: commentId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              displayName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });
};

export const deleteComment = async (tx, commentId, userId) => {
  // Soft delete the comment (only if user owns it)
  const result = await tx.comment.updateMany({
    where: {
      id: commentId,
      userId,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(), // Update the updatedAt field
    },
  });

  if (result.count === 0) {
    throw new Error(
      "Comment not found or you don't have permission to delete it"
    );
  }

  return { success: true, message: "Comment deleted successfully" };
};

export const getComments = async (tx, postId, paginationOptions = {}) => {
  const { page = 1, limit = 20, cursor } = paginationOptions;

  // Build the where clause
  const whereClause = {
    postId,
    isDeleted: false,
    parentCommentId: null, // Fixed field name - Only get top-level comments, not replies
  };

  // Add cursor-based pagination if cursor is provided
  if (cursor) {
    whereClause.createdAt = {
      lt: await getCommentCreatedAt(tx, cursor),
    };
  }

  // Get total count for pagination metadata
  const totalComments = await tx.comment.count({
    where: {
      postId,
      isDeleted: false,
      parentCommentId: null, // Fixed field name
    },
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalComments / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Get comments with pagination
  const comments = await tx.comment.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: cursor ? 0 : (page - 1) * limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              displayName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
      replies: {
        where: { isDeleted: false },
        take: 3, // Show first 3 replies
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              userInfo: {
                select: {
                  displayName: true,
                  profilePictureUrl: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  // Get cursors for next and previous pages
  let nextCursor = null;
  let previousCursor = null;

  if (comments.length > 0) {
    const lastComment = comments[comments.length - 1];
    const firstComment = comments[0];

    // Check if there are more comments after the last one
    const hasMoreAfterLast = await tx.comment.findFirst({
      where: {
        postId,
        isDeleted: false,
        parentCommentId: null, // Fixed field name
        createdAt: {
          lt: lastComment.createdAt,
        },
      },
    });

    if (hasMoreAfterLast) {
      nextCursor = lastComment.id;
    }

    // Check if there are comments before the first one
    const hasMoreBeforeFirst = await tx.comment.findFirst({
      where: {
        postId,
        isDeleted: false,
        parentCommentId: null, // Fixed field name
        createdAt: {
          gt: firstComment.createdAt,
        },
      },
    });

    if (hasMoreBeforeFirst) {
      previousCursor = firstComment.id;
    }
  }

  return {
    comments,
    pagination: {
      page,
      limit,
      totalComments,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextCursor,
      previousCursor,
    },
  };
};

// Helper function for comment pagination
const getCommentCreatedAt = async (tx, commentId) => {
  const comment = await tx.comment.findUnique({
    where: { id: commentId },
    select: { createdAt: true },
  });
  return comment ? comment.createdAt : new Date();
};
// Share functionality
export const sharePost = async (tx, postId, userId, shareData = {}) => {
  // Check if post exists and allows shares
  const post = await tx.post.findFirst({
    where: { id: postId, isDeleted: false },
  });

  if (!post) {
    throw new Error("Post not found or has been deleted");
  }

  if (!post.allowsShares) {
    throw new Error("Shares are not allowed on this post");
  }

  // Check if user already shared this post
  const existingShare = await tx.share.findFirst({
    where: { postId, userId },
  });

  if (existingShare) {
    throw new Error("Post already shared by user");
  }

  // Create the share
  const share = await tx.share.create({
    data: {
      postId,
      userId,
      caption: shareData.caption || null,
      privacyLevel: shareData.privacyLevel || "PUBLIC",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              displayName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
      post: {
        select: {
          id: true,
          caption: true,
          contentType: true,
          user: {
            select: {
              username: true,
              userInfo: {
                select: {
                  displayName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return share;
};

export const unsharePost = async (tx, postId, userId) => {
  // Find and delete the share
  const result = await tx.share.deleteMany({
    where: { postId, userId },
  });

  if (result.count === 0) {
    throw new Error("Share not found");
  }

  return { success: true, message: "Post unshared successfully" };
};

export const getShares = async (tx, postId, paginationOptions = {}) => {
  const { page = 1, limit = 20, cursor } = paginationOptions;

  // Build the where clause
  const whereClause = {
    postId,
  };

  // Add cursor-based pagination if cursor is provided
  if (cursor) {
    whereClause.createdAt = {
      lt: await getShareCreatedAt(tx, cursor),
    };
  }

  // Get total count for pagination metadata
  const totalShares = await tx.share.count({
    where: { postId },
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalShares / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Get shares with pagination
  const shares = await tx.share.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: cursor ? 0 : (page - 1) * limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              displayName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
    },
  });

  // Get cursors for next and previous pages
  let nextCursor = null;
  let previousCursor = null;

  if (shares.length > 0) {
    const lastShare = shares[shares.length - 1];
    const firstShare = shares[0];

    // Check if there are more shares after the last one
    const hasMoreAfterLast = await tx.share.findFirst({
      where: {
        postId,
        createdAt: {
          lt: lastShare.createdAt,
        },
      },
    });

    if (hasMoreAfterLast) {
      nextCursor = lastShare.id;
    }

    // Check if there are shares before the first one
    const hasMoreBeforeFirst = await tx.share.findFirst({
      where: {
        postId,
        createdAt: {
          gt: firstShare.createdAt,
        },
      },
    });

    if (hasMoreBeforeFirst) {
      previousCursor = firstShare.id;
    }
  }

  return {
    shares,
    pagination: {
      page,
      limit,
      totalShares,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextCursor,
      previousCursor,
    },
  };
};

// Helper function for share pagination
const getShareCreatedAt = async (tx, shareId) => {
  const share = await tx.share.findUnique({
    where: { id: shareId },
    select: { createdAt: true },
  });
  return share ? share.createdAt : new Date();
};
