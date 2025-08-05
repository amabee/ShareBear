import {
  getUserData,
  getUserProfile,
  getUserStats,
  getFollowers,
  getFollowings,
  searchUsers,
  getSuggestedUsers,
  updateUserProfile,
  updateUserAccountSettings,
  deactivateUser,
  reactivateUser,
} from "../services/user.service.js";
import { sanitizeInput, encodeOutput } from "../utils/sanitize.js";
import { logError } from "../utils/system-logger.js";

// Get user data by identifier (username or email)
export const getUserDataHandler = async (req, reply) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return reply.status(400).send({ error: "User identifier is required" });
    }

    const user = await getUserData(req.server.prisma, identifier, req);

    // Encode output fields before sending
    if (user && user.userInfo) {
      user.userInfo.firstName = encodeOutput(user.userInfo.firstName);
      user.userInfo.lastName = encodeOutput(user.userInfo.lastName);
      user.userInfo.displayName = encodeOutput(user.userInfo.displayName);
    }

    return reply.send({ user });
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: "User not found" });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "get_user_data",
      identifier: req.params.identifier,
    });

    return reply.status(500).send({ error: "Failed to fetch user data" });
  }
};

// Get user profile with stats and follow status
export const getUserProfileHandler = async (req, reply) => {
  try {
    const { identifier } = req.params;
    const viewerIdentifier = req.user?.username || null;

    if (!identifier) {
      return reply.status(400).send({ error: "User identifier is required" });
    }

    const profile = await getUserProfile(
      req.server.prisma,
      identifier,
      viewerIdentifier,
      req
    );

    // Encode output fields before sending
    if (profile && profile.userInfo) {
      profile.userInfo.firstName = encodeOutput(profile.userInfo.firstName);
      profile.userInfo.lastName = encodeOutput(profile.userInfo.lastName);
      profile.userInfo.displayName = encodeOutput(profile.userInfo.displayName);
      profile.userInfo.bio = encodeOutput(profile.userInfo.bio);
      profile.userInfo.location = encodeOutput(profile.userInfo.location);
    }

    return reply.send({ profile });
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: "User profile not found" });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "get_user_profile",
      identifier: req.params.identifier,
    });

    return reply.status(500).send({ error: "Failed to fetch user profile" });
  }
};

// Get user statistics
export const getUserStatsHandler = async (req, reply) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return reply.status(400).send({ error: "User identifier is required" });
    }

    const stats = await getUserStats(req.server.prisma, identifier, req);

    return reply.send({ stats });
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: "User not found" });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "get_user_stats",
      identifier: req.params.identifier,
    });

    return reply.status(500).send({ error: "Failed to fetch user stats" });
  }
};

// Get user followers
export const getFollowersHandler = async (req, reply) => {
  try {
    const { identifier } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    if (!identifier) {
      return reply.status(400).send({ error: "User identifier is required" });
    }

    const followers = await getFollowers(
      req.server.prisma,
      identifier,
      { limit: parseInt(limit), offset: parseInt(offset) },
      req
    );

    // Encode output fields for each follower
    const encodedFollowers = followers.map((follow) => ({
      ...follow,
      follower: {
        ...follow.follower,
        userInfo: follow.follower.userInfo
          ? {
              ...follow.follower.userInfo,
              firstName: encodeOutput(follow.follower.userInfo.firstName),
              lastName: encodeOutput(follow.follower.userInfo.lastName),
              displayName: encodeOutput(follow.follower.userInfo.displayName),
              bio: encodeOutput(follow.follower.userInfo.bio),
            }
          : null,
      },
    }));

    return reply.send({ followers: encodedFollowers });
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: "User not found" });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "get_followers",
      identifier: req.params.identifier,
    });

    return reply.status(500).send({ error: "Failed to fetch followers" });
  }
};

// Get user following
export const getFollowingsHandler = async (req, reply) => {
  try {
    const { identifier } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    if (!identifier) {
      return reply.status(400).send({ error: "User identifier is required" });
    }

    const followings = await getFollowings(
      req.server.prisma,
      identifier,
      { limit: parseInt(limit), offset: parseInt(offset) },
      req
    );

    // Encode output fields for each following
    const encodedFollowings = followings.map((follow) => ({
      ...follow,
      following: {
        ...follow.following,
        userInfo: follow.following.userInfo
          ? {
              ...follow.following.userInfo,
              firstName: encodeOutput(follow.following.userInfo.firstName),
              lastName: encodeOutput(follow.following.userInfo.lastName),
              displayName: encodeOutput(follow.following.userInfo.displayName),
              bio: encodeOutput(follow.following.userInfo.bio),
            }
          : null,
      },
    }));

    return reply.send({ followings: encodedFollowings });
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: "User not found" });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "get_followings",
      identifier: req.params.identifier,
    });

    return reply.status(500).send({ error: "Failed to fetch followings" });
  }
};

// Search users
export const searchUsersHandler = async (req, reply) => {
  try {
    const { q } = req.query;
    const { limit = 20, offset = 0 } = req.query;

    if (!q || q.trim().length === 0) {
      return reply.status(400).send({ error: "Search query is required" });
    }

    const users = await searchUsers(
      req.server.prisma,
      q,
      { limit: parseInt(limit), offset: parseInt(offset) },
      req
    );

    // Encode output fields for each user
    const encodedUsers = users.map((user) => ({
      ...user,
      userInfo: user.userInfo
        ? {
            ...user.userInfo,
            firstName: encodeOutput(user.userInfo.firstName),
            lastName: encodeOutput(user.userInfo.lastName),
            displayName: encodeOutput(user.userInfo.displayName),
            bio: encodeOutput(user.userInfo.bio),
          }
        : null,
    }));

    return reply.send({ users: encodedUsers });
  } catch (error) {
    if (error.code === "MISSING_QUERY") {
      return reply.status(400).send({ error: error.message });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "search_users",
      query: req.query.q,
    });

    return reply.status(500).send({ error: "Failed to search users" });
  }
};

// Get suggested users
export const getSuggestedUsersHandler = async (req, reply) => {
  try {
    const userIdentifier = req.user.username;

    const { limit = 10 } = req.query;

    const suggestions = await getSuggestedUsers(
      req.server.prisma,
      userIdentifier,
      parseInt(limit),
      req
    );

    // Encode output fields for each suggested user
    const encodedSuggestions = suggestions.map((user) => ({
      ...user,
      userInfo: user.userInfo
        ? {
            ...user.userInfo,
            firstName: encodeOutput(user.userInfo.firstName),
            lastName: encodeOutput(user.userInfo.lastName),
            displayName: encodeOutput(user.userInfo.displayName),
            bio: encodeOutput(user.userInfo.bio),
          }
        : null,
    }));

    return reply.send({ suggestions: encodedSuggestions });
  } catch (error) {
    await logError(req.server.prisma, error, "user-service", req, {
      operation: "get_suggested_users",
      userId: req.user.userId,
    });

    return reply.status(500).send({ error: "Failed to fetch suggested users" });
  }
};

// Update user profile
export const updateUserProfileHandler = async (req, reply) => {
  try {
    const userId = req.user.userId;
    const updateData = { ...req.body };

    // Sanitize input fields
    if (updateData.firstName) {
      updateData.firstName = sanitizeInput(updateData.firstName);
    }
    if (updateData.lastName) {
      updateData.lastName = sanitizeInput(updateData.lastName);
    }
    if (updateData.displayName) {
      updateData.displayName = sanitizeInput(updateData.displayName);
    }
    if (updateData.bio) {
      updateData.bio = sanitizeInput(updateData.bio);
    }
    if (updateData.location) {
      updateData.location = sanitizeInput(updateData.location);
    }

    const updatedProfile = await updateUserProfile(
      req.server.prisma,
      userId,
      updateData,
      req
    );

    // Encode output fields before sending
    if (updatedProfile) {
      updatedProfile.firstName = encodeOutput(updatedProfile.firstName);
      updatedProfile.lastName = encodeOutput(updatedProfile.lastName);
      updatedProfile.displayName = encodeOutput(updatedProfile.displayName);
      updatedProfile.bio = encodeOutput(updatedProfile.bio);
      updatedProfile.location = encodeOutput(updatedProfile.location);
    }

    return reply.send({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: "User not found" });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "update_user_profile",
      userId: req.user.userId,
    });

    return reply.status(500).send({ error: "Failed to update profile" });
  }
};

// Update user account settings
export const updateUserAccountSettingsHandler = async (req, reply) => {
  try {
    const userId = req.user.userId;
    const settings = { ...req.body };

    // Validate allowed settings
    const allowedSettings = [
      "accountType",
      "privacySettings",
      "verificationStatus",
      "phone",
    ];

    const filteredSettings = {};
    for (const [key, value] of Object.entries(settings)) {
      if (allowedSettings.includes(key)) {
        filteredSettings[key] = value;
      }
    }

    if (Object.keys(filteredSettings).length === 0) {
      return reply.status(400).send({
        error: "No valid settings provided",
      });
    }

    const updatedUser = await updateUserAccountSettings(
      req.server.prisma,
      userId,
      filteredSettings,
      req
    );

    return reply.send({
      message: "Account settings updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        accountType: updatedUser.accountType,
        privacySettings: updatedUser.privacySettings,
        verificationStatus: updatedUser.verificationStatus,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: "User not found" });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "update_account_settings",
      userId: req.user.userId,
    });

    return reply
      .status(500)
      .send({ error: "Failed to update account settings" });
  }
};

// Deactivate user account (admin only)
export const deactivateUserHandler = async (req, reply) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return reply.status(400).send({ error: "User ID is required" });
    }

    // TODO: Add admin authorization check
    // if (!req.user.isAdmin) {
    //   return reply.status(403).send({ error: "Admin access required" });
    // }

    const deactivatedUser = await deactivateUser(
      req.server.prisma,
      parseInt(userId),
      req
    );

    return reply.send({
      message: "User deactivated successfully",
      user: {
        id: deactivatedUser.id,
        username: deactivatedUser.username,
        isActive: deactivatedUser.isActive,
      },
    });
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: "User not found" });
    }

    if (error.code === "USER_ALREADY_DEACTIVATED") {
      return reply.status(400).send({ error: error.message });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "deactivate_user",
      targetUserId: req.params.userId,
    });

    return reply.status(500).send({ error: "Failed to deactivate user" });
  }
};

// Reactivate user account (admin only)
export const reactivateUserHandler = async (req, reply) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return reply.status(400).send({ error: "User ID is required" });
    }

    // TODO: Add admin authorization check
    // if (!req.user.isAdmin) {
    //   return reply.status(403).send({ error: "Admin access required" });
    // }

    const reactivatedUser = await reactivateUser(
      req.server.prisma,
      parseInt(userId),
      req
    );

    return reply.send({
      message: "User reactivated successfully",
      user: {
        id: reactivatedUser.id,
        username: reactivatedUser.username,
        isActive: reactivatedUser.isActive,
      },
    });
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return reply.status(404).send({ error: "User not found" });
    }

    if (error.code === "USER_ALREADY_ACTIVE") {
      return reply.status(400).send({ error: error.message });
    }

    await logError(req.server.prisma, error, "user-service", req, {
      operation: "reactivate_user",
      targetUserId: req.params.userId,
    });

    return reply.status(500).send({ error: "Failed to reactivate user" });
  }
};
