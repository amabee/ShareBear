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
