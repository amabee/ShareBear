import { uploadFile } from "../services/fileStorage/index.js";
import { createPost as createPostService } from "../services/posts.service.js";

export const createPost = async (req, reply) => {
  let fileUrl = undefined;
  if (req.file) {
    fileUrl = await uploadFile(req.file, "posts");
  }

  const userId = req.user.userId;
  const postData = {
    contentType: req.body.contentType,
    caption: req.body.caption,
    contentUrl: fileUrl,
    thumbnailUrl: req.body.thumbnailUrl,
    location: req.body.location,
    taggedUsers: req.body.taggedUsers,
    privacyLevel: req.body.privacyLevel,
    allowsComments: req.body.allowsComments,
    allowsShares: req.body.allowsShares,
    expiresAt: req.body.expiresAt,
  };

  const post = await createPostService(req.server.prisma, userId, postData);
  return reply.status(201).send({ message: "Post created", post });
};

export const addFriend = async (req, reply) => {
  return reply.status(501).send({ error: "Route not implemented yet." });
};
