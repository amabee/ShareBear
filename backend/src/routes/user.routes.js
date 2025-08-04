import {
  getUserDataHandler,
  getUserProfileHandler,
  getUserStatsHandler,
  getFollowersHandler,
  getFollowingsHandler,
  searchUsersHandler,
  getSuggestedUsersHandler,
  updateUserProfileHandler,
  updateUserAccountSettingsHandler,
  deactivateUserHandler,
  reactivateUserHandler,
} from "../controllers/user.controller.js";
import {
  getUserDataSchema,
  getUserProfileSchema,
  getUserStatsSchema,
  getFollowersSchema,
  getFollowingsSchema,
  searchUsersSchema,
  getSuggestedUsersSchema,
  updateUserProfileSchema,
  updateUserAccountSettingsSchema,
  deactivateUserSchema,
  reactivateUserSchema,
} from "../schema/userSchemas.js";

export default async function userRoutes(fastify, options) {
  // Authentication Hook
  fastify.addHook("preHandler", fastify.authenticate);

  // Get user data by identifier (username or email)
  fastify.get(
    "/:identifier",
    {
      schema: getUserDataSchema,
    },
    getUserDataHandler
  );

  // Get user profile with stats and follow status
  fastify.get(
    "/:identifier/profile",
    {
      schema: getUserProfileSchema,
    },
    getUserProfileHandler
  );

  // Get user statistics
  fastify.get(
    "/:identifier/stats",
    {
      schema: getUserStatsSchema,
    },
    getUserStatsHandler
  );

  // Get user followers
  fastify.get(
    "/:identifier/followers",
    {
      schema: getFollowersSchema,
    },
    getFollowersHandler
  );

  // Get user following
  fastify.get(
    "/:identifier/following",
    {
      schema: getFollowingsSchema,
    },
    getFollowingsHandler
  );

  // Search users
  fastify.get(
    "/search",
    {
      schema: searchUsersSchema,
    },
    searchUsersHandler
  );

  // Get suggested users (requires authentication)
  fastify.get(
    "/suggestions",
    {
      preHandler: [fastify.authenticate],
      schema: getSuggestedUsersSchema,
    },
    getSuggestedUsersHandler
  );

  // Update user profile (requires authentication)
  fastify.put(
    "/profile",
    {
      preHandler: [fastify.authenticate],
      schema: updateUserProfileSchema,
    },
    updateUserProfileHandler
  );

  // Update user account settings (requires authentication)
  fastify.put(
    "/settings",
    {
      preHandler: [fastify.authenticate],
      schema: updateUserAccountSettingsSchema,
    },
    updateUserAccountSettingsHandler
  );

  // Deactivate user (admin only)
  fastify.patch(
    "/:userId/deactivate",
    {
      preHandler: [fastify.authenticate],
      schema: deactivateUserSchema,
    },
    deactivateUserHandler
  );

  // Reactivate user (admin only)
  fastify.patch(
    "/:userId/reactivate",
    {
      preHandler: [fastify.authenticate],
      schema: reactivateUserSchema,
    },
    reactivateUserHandler
  );
}
