import {
  checkFollowStatus,
  createFollow,
  deleteFollow,
  getFollowersCount,
  getFollowingCount,
  getFollowers,
  getFollowing,
  findUserById,
} from "../repositories/follow.repository.js";
import { logUserAction, logError } from "../utils/system-logger.js";

export async function followUser(prisma, followerId, followingId, req) {
  return await prisma.$transaction(async (tx) => {
    // Check if trying to follow yourself
    if (followerId === followingId) {
      const error = new Error("You cannot follow yourself");
      error.code = "SELF_FOLLOW";
      throw error;
    }

    // Check if the user to follow exists
    const userToFollow = await findUserById(tx, followingId);
    if (!userToFollow) {
      const error = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    // Check if already following this user
    const existingFollow = await checkFollowStatus(tx, followerId, followingId);

    if (existingFollow) {
      if (existingFollow.status === "accepted") {
        const error = new Error("You are already following this user");
        error.code = "ALREADY_FOLLOWING";
        throw error;
      } else if (existingFollow.status === "pending") {
        const error = new Error("Follow request is already pending");
        error.code = "FOLLOW_PENDING";
        throw error;
      } else if (existingFollow.status === "blocked") {
        const error = new Error("Cannot follow this user");
        error.code = "FOLLOW_BLOCKED";
        throw error;
      }
    }

    // Create the follow relationship
    const follow = await createFollow(tx, followerId, followingId, "accepted");

    // Log the follow action
    await logUserAction(tx, followerId, "follow_user", req, {
      targetUserId: followingId,
      targetUsername: userToFollow.username,
    });

    return follow;
  });
}

export async function unfollowUser(prisma, followerId, followingId, req) {
  return await prisma.$transaction(async (tx) => {
    // Check if trying to unfollow yourself
    if (followerId === followingId) {
      const error = new Error("You cannot unfollow yourself");
      error.code = "SELF_UNFOLLOW";
      throw error;
    }

    // Check if the user to unfollow exists
    const userToUnfollow = await findUserById(tx, followingId);
    if (!userToUnfollow) {
      const error = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    // Check if currently following this user
    const existingFollow = await checkFollowStatus(tx, followerId, followingId);

    if (!existingFollow) {
      const error = new Error("You are not following this user");
      error.code = "NOT_FOLLOWING";
      throw error;
    }

    if (existingFollow.status !== "accepted") {
      const error = new Error("You are not following this user");
      error.code = "NOT_FOLLOWING";
      throw error;
    }

    // Delete the follow relationship
    await deleteFollow(tx, followerId, followingId);

    // Log the unfollow action
    await logUserAction(tx, followerId, "unfollow_user", req, {
      targetUserId: followingId,
      targetUsername: userToUnfollow.username,
    });

    return { message: "Successfully unfollowed user" };
  });
}

export async function getFollowStatus(prisma, followerId, followingId) {
  const existingFollow = await checkFollowStatus(
    prisma,
    followerId,
    followingId
  );

  return {
    isFollowing: existingFollow?.status === "accepted",
    status: existingFollow?.status || null,
    followId: existingFollow?.id || null,
  };
}

// USER FOLLOW STATISTICS
export async function getUserFollowStats(prisma, userId) {
  const [followersCount, followingCount] = await Promise.all([
    getFollowersCount(prisma, userId),
    getFollowingCount(prisma, userId),
  ]);

  return {
    followersCount,
    followingCount,
  };
}

// LIST OF FOLLOWERS
export async function getUserFollowers(prisma, userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const followers = await getFollowers(prisma, userId, limit, offset);

  return {
    followers: followers.map((follow) => follow.follower),
    pagination: {
      page,
      limit,
      hasMore: followers.length === limit,
    },
  };
}

// LIST OF FOLLOWINGS
export async function getUserFollowing(prisma, userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const following = await getFollowing(prisma, userId, limit, offset);

  return {
    following: following.map((follow) => follow.following),
    pagination: {
      page,
      limit,
      hasMore: following.length === limit,
    },
  };
}
