export const getPosts = async (prisma, userId) => {
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

  return await prisma.post.findMany({
    where: {
      userId: { in: userIds },
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
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

export const getPostsByHashtag = async (prisma, hashtagName, userId) => {
  return await prisma.post.findMany({
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
    orderBy: {
      createdAt: "desc",
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
