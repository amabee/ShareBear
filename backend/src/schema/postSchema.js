export const createPostSchema = {
  body: {
    type: "object",
    properties: {
      contentType: {
        type: "string",
        enum: ["TEXT", "IMAGE", "VIDEO"],
        errorMessage: "Invalid content type",
      },
      caption: { type: "string" },
      thumbnailUrl: { type: "string" },
      location: { type: "string" },
      taggedUsers: { type: "string" },
      privacyLevel: {
        type: "string",
        enum: ["PUBLIC", "PRIVATE", "FRIENDS"],
        errorMessage: "Invalid privacy level",
      },
      allowsComments: { type: "boolean" },
      allowsShares: { type: "boolean" },
      expiresAt: { type: "string", format: "date-time" },
    },
    additionalProperties: true,
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        post: {
          type: "object",
          properties: {
            id: { type: "number" },
            userId: { type: "number" },
            contentType: { type: "string" },
            caption: { type: "string" },
            contentUrl: { type: "string" },
            thumbnailUrl: { type: "string" },
            location: { type: "string" },
            taggedUsers: { type: "string" },
            privacyLevel: { type: "string" },
            allowsComments: { type: "boolean" },
            allowsShares: { type: "boolean" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            expiresAt: { type: "string" },
            isDeleted: { type: "boolean" },
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
    401: {
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

export const updatePostSchema = {
  body: {
    type: "object",
    properties: {
      contentType: {
        type: "string",
        enum: ["TEXT", "IMAGE", "VIDEO"],
        errorMessage: "Invalid content type",
      },
      caption: { type: "string" },
      thumbnailUrl: { type: "string" },
      location: { type: "string" },
      taggedUsers: { type: "string" },
      privacyLevel: {
        type: "string",
        enum: ["PUBLIC", "PRIVATE", "FRIENDS"],
        errorMessage: "Invalid privacy level",
      },
      allowsComments: { type: "boolean" },
      allowsShares: { type: "boolean" },
      expiresAt: { type: "string", format: "date-time" },
    },
    additionalProperties: false,
    minProperties: 1,
    errorMessage: {
      minProperties: "At least one field must be provided to update."
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        post: { type: "object" },
      },
    },
    400: { type: "object", properties: { error: { type: "string" } } },
    401: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const softDeletePostSchema = {
  response: {
    200: { type: "object", properties: { message: { type: "string" } } },
    401: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const restorePostSchema = {
  response: {
    200: { type: "object", properties: { message: { type: "string" }, post: { type: "object" } } },
    401: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const getPostsSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        posts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              userId: { type: "number" },
              contentType: { type: "string" },
              caption: { type: "string" },
              contentUrl: { type: "string" },
              thumbnailUrl: { type: "string" },
              location: { type: "string" },
              taggedUsers: { type: "string" },
              privacyLevel: { type: "string" },
              allowsComments: { type: "boolean" },
              allowsShares: { type: "boolean" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              expiresAt: { type: "string" },
              isDeleted: { type: "boolean" },
              user: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  username: { type: "string" },
                  userInfo: {
                    type: "object",
                    properties: {
                      profilePictureUrl: { type: "string" },
                    },
                  },
                },
              },
              _count: {
                type: "object",
                properties: {
                  likes: { type: "number" },
                  comments: { type: "number" },
                  shares: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
    401: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const getPostSchema = {
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^\\d+$" },
    },
    required: ["postId"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        post: {
          type: "object",
          properties: {
            id: { type: "number" },
            userId: { type: "number" },
            contentType: { type: "string" },
            caption: { type: "string" },
            contentUrl: { type: "string" },
            thumbnailUrl: { type: "string" },
            location: { type: "string" },
            taggedUsers: { type: "string" },
            privacyLevel: { type: "string" },
            allowsComments: { type: "boolean" },
            allowsShares: { type: "boolean" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            expiresAt: { type: "string" },
            isDeleted: { type: "boolean" },
            user: {
              type: "object",
              properties: {
                id: { type: "number" },
                username: { type: "string" },
                userInfo: {
                  type: "object",
                  properties: {
                    profilePictureUrl: { type: "string" },
                  },
                },
              },
            },
            likes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  userId: { type: "number" },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      username: { type: "string" },
                      userInfo: {
                        type: "object",
                        properties: {
                          profilePictureUrl: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            comments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  content: { type: "string" },
                  userId: { type: "number" },
                  createdAt: { type: "string" },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      username: { type: "string" },
                      userInfo: {
                        type: "object",
                        properties: {
                          profilePictureUrl: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            _count: {
              type: "object",
              properties: {
                likes: { type: "number" },
                comments: { type: "number" },
                shares: { type: "number" },
              },
            },
          },
        },
      },
    },
    401: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};
