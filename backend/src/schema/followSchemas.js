export const followSchema = {
  params: {
    type: "object",
    required: ["followingId"],
    properties: {
      followingId: {
        type: "string",
        pattern: "^[0-9]+$",
        errorMessage: "followingId must be a valid number",
      },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        follow: {
          type: "object",
          properties: {
            id: { type: "number" },
            followerId: { type: "number" },
            followingId: { type: "number" },
            status: { type: "string" },
            createdAt: { type: "string" },
            follower: {
              type: "object",
              properties: {
                id: { type: "number" },
                username: { type: "string" },
                userInfo: {
                  type: "object",
                  properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    displayName: { type: "string" },
                    profilePictureUrl: { type: "string" },
                  },
                },
              },
            },
            following: {
              type: "object",
              properties: {
                id: { type: "number" },
                username: { type: "string" },
                userInfo: {
                  type: "object",
                  properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    displayName: { type: "string" },
                    profilePictureUrl: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    409: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const unfollowSchema = {
  params: {
    type: "object",
    required: ["followingId"],
    properties: {
      followingId: {
        type: "string",
        pattern: "^[0-9]+$",
        errorMessage: "followingId must be a valid number",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    409: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const checkFollowSchema = {
  params: {
    type: "object",
    required: ["followingId"],
    properties: {
      followingId: {
        type: "string",
        pattern: "^[0-9]+$",
        errorMessage: "followingId must be a valid number",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        isFollowing: { type: "boolean" },
        status: { type: "string", nullable: true },
        followId: { type: "number", nullable: true },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const followStatsSchema = {
  params: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: {
        type: "string",
        pattern: "^[0-9]+$",
        errorMessage: "userId must be a valid number",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        followersCount: { type: "number" },
        followingCount: { type: "number" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const getFollowersSchema = {
  params: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: {
        type: "string",
        pattern: "^[0-9]+$",
        errorMessage: "userId must be a valid number",
      },
    },
  },
  querystring: {
    type: "object",
    properties: {
      page: {
        type: "string",
        pattern: "^[0-9]+$",
        default: "1",
      },
      limit: {
        type: "string",
        pattern: "^[0-9]+$",
        default: "20",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        followers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              username: { type: "string" },
              userInfo: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  displayName: { type: "string" },
                  profilePictureUrl: { type: "string" },
                  bio: { type: "string" },
                },
              },
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            hasMore: { type: "boolean" },
          },
        },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const getFollowingSchema = {
  params: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: {
        type: "string",
        pattern: "^[0-9]+$",
        errorMessage: "userId must be a valid number",
      },
    },
  },
  querystring: {
    type: "object",
    properties: {
      page: {
        type: "string",
        pattern: "^[0-9]+$",
        default: "1",
      },
      limit: {
        type: "string",
        pattern: "^[0-9]+$",
        default: "20",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        following: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              username: { type: "string" },
              userInfo: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  displayName: { type: "string" },
                  profilePictureUrl: { type: "string" },
                  bio: { type: "string" },
                },
              },
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            hasMore: { type: "boolean" },
          },
        },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};
