// FOLLOW RELATED FUNCTIONS
export const checkFollowStatus = async (prisma, followerId, followingId) => {
  return prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId, // the current user
        followingId, // the current user that is following
      },
    },
  });
};

export const createFollow = async (
  prisma,
  followerId,
  followingId,
  status = "accepted"
) => {
  return prisma.follow.create({
    data: {
      followerId,
      followingId,
      status,
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
            },
          },
        },
      },
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
            },
          },
        },
      },
    },
  });
};

export const deleteFollow = async (prisma, followerId, followingId) => {
  return prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
};

export const getFollowersCount = async (prisma, userId) => {
  return prisma.follow.count({
    where: {
      followingId: userId,
      status: "accepted",
    },
  });
};

export const getFollowingCount = async (prisma, userId) => {
  return prisma.follow.count({
    where: {
      followerId: userId,
      status: "accepted",
    },
  });
};

export const getFollowers = async (prisma, userId, limit = 20, offset = 0) => {
  return prisma.follow.findMany({
    where: {
      followingId: userId,
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

export const getFollowing = async (prisma, userId, limit = 20, offset = 0) => {
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

export const findUserById = async (prisma, userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
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
  });
};
