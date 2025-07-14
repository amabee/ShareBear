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
