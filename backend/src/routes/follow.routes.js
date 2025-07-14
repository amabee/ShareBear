import {
  follow,
  unfollow,
  checkFollow,
  getFollowStats,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";
import {
  checkFollowSchema,
  followSchema,
  followStatsSchema,
  getFollowersSchema,
  getFollowingSchema,
  unfollowSchema,
} from "../schema/followSchemas.js";

export default async function followRoutes(fastify, opts) {
  fastify.addHook("preHandler", fastify.authenticate);

  // Follow a user
  fastify.post("/:followingId", { schema: followSchema }, follow);

  // Unfollow a user
  fastify.delete("/:followingId", { schema: unfollowSchema }, unfollow);

  // Check follow status
  fastify.get(
    "/check/:followingId",
    { schema: checkFollowSchema },
    checkFollow
  );

  // Get user follow stats
  fastify.get("/stats/:userId", { schema: followStatsSchema }, getFollowStats);

  // Get user followers
  fastify.get(
    "/followers/:userId",
    { schema: getFollowersSchema },
    getFollowers
  );

  // Get user following
  fastify.get(
    "/following/:userId",
    {
      schema: getFollowingSchema,
    },
    getFollowing
  );
}
