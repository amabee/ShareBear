import {
  followUser,
  unfollowUser,
  getFollowStatus,
  getUserFollowStats,
  getUserFollowers,
  getUserFollowing,
} from "../services/follow.service.js";
import { logError } from "../utils/system-logger.js";

export const follow = async (req, reply) => {
  const startTime = Date.now();
  const followerId = req.user.userId;
  const { followingId } = req.params;

  try {
    const follow = await followUser(
      req.server.prisma,
      followerId,
      parseInt(followingId),
      req
    );

    return reply.status(201).send({
      message: "Successfully followed user",
      follow,
    });
  } catch (error) {
    // Handle specific error codes
    if (error.code === "SELF_FOLLOW") {
      return reply.status(400).send({ error: error.message });
    }

    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: error.message });
    }

    if (error.code === "ALREADY_FOLLOWING") {
      return reply.status(409).send({ error: error.message });
    }

    if (error.code === "FOLLOW_PENDING") {
      return reply.status(409).send({ error: error.message });
    }

    if (error.code === "FOLLOW_BLOCKED") {
      return reply.status(403).send({ error: error.message });
    }

    await logError(req.server.prisma, error, "follow-service", req, {
      operation: "follow",
      duration: Date.now() - startTime,
      context: { followerId, followingId },
    });

    return reply.status(500).send({ error: "Failed to follow user" });
  }
};

export const unfollow = async (req, reply) => {
  const startTime = Date.now();
  const followerId = req.user.userId;
  const { followingId } = req.params;

  try {
    const result = await unfollowUser(
      req.server.prisma,
      followerId,
      parseInt(followingId),
      req
    );

    return reply.status(200).send({
      message: result.message,
    });
  } catch (error) {
    // Handle specific error codes
    if (error.code === "SELF_UNFOLLOW") {
      return reply.status(400).send({ error: error.message });
    }

    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: error.message });
    }

    if (error.code === "NOT_FOLLOWING") {
      return reply.status(409).send({ error: error.message });
    }

    await logError(req.server.prisma, error, "follow-service", req, {
      operation: "unfollow",
      duration: Date.now() - startTime,
      context: { followerId, followingId },
    });

    return reply.status(500).send({ error: "Failed to unfollow user" });
  }
};

export const checkFollow = async (req, reply) => {
  const followerId = req.user.userId;
  const { followingId } = req.params;

  console.log(req);

  try {
    const status = await getFollowStatus(
      req.server.prisma,
      followerId,
      parseInt(followingId)
    );

    return reply.status(200).send(status);
  } catch (error) {
    await logError(req.server.prisma, error, "follow-service", req, {
      operation: "check_follow",
      context: { followerId, followingId },
    });

    return reply.status(500).send({ error: "Failed to check follow status" });
  }
};

export const getFollowStats = async (req, reply) => {
  const { userId } = req.params;

  try {
    const stats = await getUserFollowStats(req.server.prisma, parseInt(userId));

    return reply.status(200).send(stats);
  } catch (error) {
    await logError(req.server.prisma, error, "follow-service", req, {
      operation: "get_follow_stats",
      context: { userId },
    });

    return reply.status(500).send({ error: "Failed to get follow stats" });
  }
};

export const getFollowers = async (req, reply) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const result = await getUserFollowers(
      req.server.prisma,
      parseInt(userId),
      page,
      limit
    );

    return reply.status(200).send(result);
  } catch (error) {
    await logError(req.server.prisma, error, "follow-service", req, {
      operation: "get_followers",
      context: { userId, page, limit },
    });

    return reply.status(500).send({ error: "Failed to get followers" });
  }
};

export const getFollowing = async (req, reply) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const result = await getUserFollowing(
      req.server.prisma,
      parseInt(userId),
      page,
      limit
    );

    return reply.status(200).send(result);
  } catch (error) {
    await logError(req.server.prisma, error, "follow-service", req, {
      operation: "get_following",
      context: { userId, page, limit },
    });

    return reply.status(500).send({ error: "Failed to get following" });
  }
};
