export const getPosts = async (prisma, userId, paginationOptions = {}) => {
  const { page = 1, limit = 10, cursor } = paginationOptions;
  
  const following = await prisma.follow.findMany({
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
      lt: await getPostCreatedAt(prisma, cursor)
    };
  }

  // Get total count for pagination metadata
  const totalPosts = await prisma.post.count({
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
  const posts = await prisma.post.findMany({
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

  // Get cursors for next and previous pages
  let nextCursor = null;
  let previousCursor = null;

  if (posts.length > 0) {
    const lastPost = posts[posts.length - 1];
    const firstPost = posts[0];
    
    // Check if there are more posts after the last one
    const hasMoreAfterLast = await prisma.post.findFirst({
      where: {
        userId: { in: userIds },
        isDeleted: false,
        createdAt: {
          lt: lastPost.createdAt
        }
      }
    });
    
    if (hasMoreAfterLast) {
      nextCursor = lastPost.id;
    }

    // Check if there are posts before the first one
    const hasMoreBeforeFirst = await prisma.post.findFirst({
      where: {
        userId: { in: userIds },
        isDeleted: false,
        createdAt: {
          gt: firstPost.createdAt
        }
      }
    });
    
    if (hasMoreBeforeFirst) {
      previousCursor = firstPost.id;
    }
  }

  return {
    posts,
    pagination: {
      page,
      limit,
      totalPosts,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextCursor,
      previousCursor
    }
  };
};

// Helper function to get post creation date for cursor-based pagination
const getPostCreatedAt = async (prisma, postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { createdAt: true }
  });
  return post ? post.createdAt : new Date();
};

export const getPost = async (prisma, postId) => {
  return await prisma.post.findUnique({
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
              profilePictureUrl: true,
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
};





export const updatePost = async (prisma, postId, userId, updateData) => {
  return await prisma.post.updateMany({
    where: { id: postId, userId, isDeleted: false },
    data: updateData,
  });
};

export const softDeletePost = async (prisma, postId, userId) => {
  return await prisma.post.updateMany({
    where: { id: postId, userId, isDeleted: false },
    data: { isDeleted: true },
  });
};

export const restorePost = async (prisma, postId, userId) => {
  return await prisma.post.updateMany({
    where: { id: postId, userId, isDeleted: true },
    data: { isDeleted: false },
  });
};

export const getPostsByHashtag = async (prisma, hashtagName, userId, paginationOptions = {}) => {
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
      lt: await getPostCreatedAt(prisma, cursor)
    };
  }

  // Get total count for pagination metadata
  const totalPosts = await prisma.post.count({
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
  const posts = await prisma.post.findMany({
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

  // Get cursors for next and previous pages
  let nextCursor = null;
  let previousCursor = null;

  if (posts.length > 0) {
    const lastPost = posts[posts.length - 1];
    const firstPost = posts[0];
    
    // Check if there are more posts after the last one
    const hasMoreAfterLast = await prisma.post.findFirst({
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
          lt: lastPost.createdAt
        }
      }
    });
    
    if (hasMoreAfterLast) {
      nextCursor = lastPost.id;
    }

    // Check if there are posts before the first one
    const hasMoreBeforeFirst = await prisma.post.findFirst({
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
          gt: firstPost.createdAt
        }
      }
    });
    
    if (hasMoreBeforeFirst) {
      previousCursor = firstPost.id;
    }
  }

  return {
    posts,
    pagination: {
      page,
      limit,
      totalPosts,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextCursor,
      previousCursor
    }
  };
};

export const getTrendingHashtags = async (prisma, limit = 10) => {
  return await prisma.hashtag.findMany({
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
