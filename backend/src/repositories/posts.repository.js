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
              profilePictureUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          shares: true,
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
              profilePictureUrl: true,
            },
          },
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
    },
  });
};

export const createPost = async (prisma, userId, postData) => {
  return await prisma.post.create({
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
