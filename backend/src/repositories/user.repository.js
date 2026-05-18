// Get user basic data
export const getUserData = async (prisma, identifier) => {
  // Determine if identifier is email or username
  const whereClause = identifier.includes("@")
    ? { email: identifier }
    : { username: identifier };

  const user = await prisma.user.findUnique({
    where: whereClause,
    include: {
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
      _count: {
        select: {
          likes: true,
          followers: {
            where: { status: "accepted" },
          },
          following: {
            where: { status: "accepted" },
          },
        },
      },
    },
  });

  if (!user) return null;

  return {
    ...user,
    stats: {
      likeCount: user._count.likes,
      followersCount: user._count.followers,
      followingCount: user._count.following,
    },
  };
};

// Get user profile with stats and follow status
export const getUserProfile = async (
  prisma,
  identifier,
  viewerIdentifier = null
) => {
  // Determine if identifier is email or username
  const whereClause = identifier.includes("@")
    ? { email: identifier }
    : { username: identifier };

  const user = await prisma.user.findUnique({
    where: whereClause,
    include: {
      userInfo: true,
      _count: {
        select: {
          posts: true,
          followers: {
            where: { status: "accepted" },
          },
          following: {
            where: { status: "accepted" },
          },
        },
      },
    },
  });

  if (!user) return null;

  // If viewer is provided, check follow status
  let followStatus = null;
  if (viewerIdentifier && viewerIdentifier !== identifier) {
    // Get viewer's ID first
    const viewerWhereClause = viewerIdentifier.includes("@")
      ? { email: viewerIdentifier }
      : { username: viewerIdentifier };

    const viewer = await prisma.user.findUnique({
      where: viewerWhereClause,
      select: { id: true },
    });

    if (viewer) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: viewer.id,
            followingId: user.id,
          },
        },
      });
      followStatus = follow?.status || null;
    }
  }

  return {
    ...user,
    followStatus,
    stats: {
      postsCount: user._count.posts,
      followersCount: user._count.followers,
      followingCount: user._count.following,
    },
  };
};

// Get user activity stats
export const getUserStats = async (prisma, identifier) => {
  // Determine if identifier is email or username
  const whereClause = identifier.includes("@")
    ? { email: identifier }
    : { username: identifier };

  const stats = await prisma.user.findUnique({
    where: whereClause,
    select: {
      _count: {
        select: {
          posts: true,
          followers: {
            where: { status: "accepted" },
          },
          following: {
            where: { status: "accepted" },
          },
        },
      },
    },
  });

  return stats?._count || null;
};

// Get user followers
export const getFollowers = async (
  prisma,
  identifier,
  limit = 20,
  offset = 0
) => {
  // First get the user ID from identifier
  const whereClause = identifier.includes("@")
    ? { email: identifier }
    : { username: identifier };

  const user = await prisma.user.findUnique({
    where: whereClause,
    select: { id: true },
  });

  if (!user) return [];

  return prisma.follow.findMany({
    where: {
      followingId: user.id,
      status: "accepted",
    },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              firstName: true,
              lastName: true,
              displayName: true,
              profilePictureUrl: true,
              bio: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });
};

// Get user following
export const getFollowings = async (prisma, userId, limit = 20, offset = 0) => {
  return prisma.follow.findMany({
    where: {
      followerId: userId,
      status: "accepted",
    },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              firstName: true,
              lastName: true,
              displayName: true,
              profilePictureUrl: true,
              bio: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });
};

// Search users
export const searchUsers = async (prisma, query, limit = 20, offset = 0) => {
  return prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          userInfo: {
            OR: [
              {
                firstName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                displayName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ],
    },
    include: {
      userInfo: {
        select: {
          firstName: true,
          lastName: true,
          displayName: true,
          profilePictureUrl: true,
          bio: true,
        },
      },
    },
    orderBy: [
      {
        username: "asc",
      },
    ],
    take: limit,
    skip: offset,
  });
};

// Updated getSuggestedUsers with randomization
export const getSuggestedUsers = async (prisma, userIdentifier, limit = 10) => {
  const currentUser = await prisma.user.findFirst({
    where: { username: userIdentifier },
    select: {
      id: true,
      following: {
        select: {
          followingId: true,
        },
      },
    },
  });

  if (!currentUser) {
    throw new Error("User not found");
  }

  const currentUserId = currentUser.id;
  const followingIds = currentUser.following.map((f) => f.followingId);

  // ✅ Manual random: Get total count
  const totalCount = await prisma.user.count({
    where: {
      id: {
        notIn: [currentUserId, ...followingIds],
      },
    },
  });


  const skip =
    totalCount > limit ? Math.floor(Math.random() * (totalCount - limit)) : 0;

  const suggestions = await prisma.user.findMany({
    where: {
      id: {
        notIn: [currentUserId, ...followingIds],
      },
    },
    take: limit,
    skip: skip,
    include: {
      userInfo: {
        select: {
          firstName: true,
          lastName: true,
          displayName: true,
          profilePictureUrl: true,
          bio: true,
        },
      },
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });

  return suggestions;
};
