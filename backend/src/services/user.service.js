import {
  getUserData as getUserDataRepo,
  getUserProfile as getUserProfileRepo,
  getUserStats as getUserStatsRepo,
  getFollowers as getFollowersRepo,
  getFollowings as getFollowingsRepo,
  searchUsers as searchUsersRepo,
  getSuggestedUsers as getSuggestedUsersRepo,
} from "../repositories/user.repository.js";
import { logUserAction } from "../utils/system-logger.js";

export async function getUserData(prisma, identifier, req) {
  return await prisma.$transaction(async (tx) => {
    const user = await getUserDataRepo(tx, identifier);

    if (!user) {
      const error = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    // Log user data access
    if (req) {
      await logUserAction(prisma, user.id, "get_user_data", req,  {
        targetUserId: user.id,
        targetUsername: user.username,
        identifier: identifier,
      });
    }

    return user;
  });
}

export async function getUserProfile(
  prisma,
  identifier,
  viewerIdentifier = null,
  req
) {
  return await prisma.$transaction(async (tx) => {
    const profile = await getUserProfileRepo(tx, identifier, viewerIdentifier);

    if (!profile) {
      const error = new Error("User profile not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    // Log profile view
    if (req) {
      await logUserAction(prisma, profile.id, "view_user_profile", req);
    }

    return profile;
  });
}

export async function getUserStats(prisma, identifier, req) {
  return await prisma.$transaction(async (tx) => {
    const stats = await getUserStatsRepo(tx, identifier);

    if (!stats) {
      const error = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    // Log stats access
    if (req) {
      await logUserAction(prisma, "get_user_stats", req, "INFO", {
        targetIdentifier: identifier,
        stats: stats,
      });
    }

    return stats;
  });
}

export async function getFollowers(
  prisma,
  identifier,
  paginationOptions = {},
  req
) {
  return await prisma.$transaction(async (tx) => {
    const { limit = 20, offset = 0 } = paginationOptions;

    const followers = await getFollowersRepo(tx, identifier, limit, offset);

    // Log followers access
    if (req) {
      await logUserAction(
        prisma,
        followers.followingId,
        "get_user_followers",
        req,
        {
          targetIdentifier: identifier,
          followersCount: followers.length,
          limit,
          offset,
        }
      );
    }

    return followers;
  });
}

export async function getFollowings(
  prisma,
  identifier,
  paginationOptions = {},
  req
) {
  return await prisma.$transaction(async (tx) => {
    const { limit = 20, offset = 0 } = paginationOptions;

    // First get the user ID from identifier
    const whereClause = identifier.includes("@")
      ? { email: identifier }
      : { username: identifier };

    const user = await tx.user.findUnique({
      where: whereClause,
      select: { id: true },
    });

    if (!user) {
      const error = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    const followings = await getFollowingsRepo(tx, user.id, limit, offset);

    // Log followings access
    if (req) {
      await logUserAction(prisma, user.id, "get_user_followings", req, {
        targetUserId: user.id,
        targetIdentifier: identifier,
        followingsCount: followings.length,
        limit,
        offset,
      });
    }

    return followings;
  });
}

export async function searchUsers(prisma, query, paginationOptions = {}, req) {
  return await prisma.$transaction(async (tx) => {
    const { limit = 20, offset = 0 } = paginationOptions;

    if (!query || query.trim().length === 0) {
      const error = new Error("Search query is required");
      error.code = "MISSING_QUERY";
      throw error;
    }

    const users = await searchUsersRepo(tx, query.trim(), limit, offset);

    // Log search activity
    if (req) {
      await logUserAction(prisma, "search_users", req, "INFO", {
        query: query.trim(),
        resultsCount: users.length,
        limit,
        offset,
      });
    }

    return users;
  });
}

export async function getSuggestedUsers(prisma, userId, limit = 10, req) {
  return await prisma.$transaction(async (tx) => {
    const suggestions = await getSuggestedUsersRepo(tx, userId, limit);

    // Log suggestions access
    if (req) {
      await logUserAction(prisma, "get_suggested_users", req, "INFO", {
        userId,
        suggestionsCount: suggestions.length,
        limit,
      });
    }

    return suggestions;
  });
}

export async function updateUserProfile(prisma, userId, updateData, req) {
  return await prisma.$transaction(async (tx) => {
    // Validate user exists
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { userInfo: true },
    });

    if (!user) {
      const error = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    // Update user info
    const updatedUserInfo = await tx.userInfo.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });

    // Log profile update
    if (req) {
      await logUserAction(prisma, "update_user_profile", req, "INFO", {
        userId,
        updatedFields: Object.keys(updateData),
      });
    }

    return updatedUserInfo;
  });
}

export async function updateUserAccountSettings(prisma, userId, settings, req) {
  return await prisma.$transaction(async (tx) => {
    // Validate user exists
    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    // Update user account settings
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: settings,
    });

    // Log account settings update
    if (req) {
      await logUserAction(prisma, "update_account_settings", req, "INFO", {
        userId,
        updatedSettings: Object.keys(settings),
      });
    }

    return updatedUser;
  });
}

export async function deactivateUser(prisma, userId, req) {
  return await prisma.$transaction(async (tx) => {
    // Validate user exists
    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (!user.isActive) {
      const error = new Error("User is already deactivated");
      error.code = "USER_ALREADY_DEACTIVATED";
      throw error;
    }

    // Deactivate user
    const deactivatedUser = await tx.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    // Log deactivation
    if (req) {
      await logUserAction(prisma, "deactivate_user", req, "WARN", {
        userId,
        username: user.username,
      });
    }

    return deactivatedUser;
  });
}

export async function reactivateUser(prisma, userId, req) {
  return await prisma.$transaction(async (tx) => {
    // Validate user exists
    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (user.isActive) {
      const error = new Error("User is already active");
      error.code = "USER_ALREADY_ACTIVE";
      throw error;
    }

    // Reactivate user
    const reactivatedUser = await tx.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    // Log reactivation
    if (req) {
      await logUserAction(prisma, "reactivate_user", req, "INFO", {
        userId,
        username: user.username,
      });
    }

    return reactivatedUser;
  });
}
