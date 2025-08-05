export const createPostSchema = {
  body: {
    type: "object",
    properties: {
      contentType: {
        type: "string",
        enum: ["TEXT", "IMAGE", "VIDEO", "MIXED"],
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
      allowsComments: {
        oneOf: [{ type: "string" }, { type: "boolean" }],
      },
      allowsShares: {
        oneOf: [{ type: "string" }, { type: "boolean" }],
      },
      expiresAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
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
            id: { type: "string" },
            userId: { type: "number" },
            contentType: { type: "string" },
            caption: { type: "string" },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  imageUrl: { type: "string" },
                  altText: { type: "string" },
                  displayOrder: { type: "number" },
                  width: { type: "number" },
                  height: { type: "number" },
                  fileSize: { type: "number" },
                  createdAt: { type: "string" },
                },
              },
            },
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
            hashtags: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hashtag: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                      usageCount: { type: "number" },
                    },
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

export const createPostMultipartSchema = {
  consumes: ["multipart/form-data"],
  body: {
    type: "object",
    properties: {
      contentType: {
        type: "string",
        enum: ["TEXT", "IMAGE", "VIDEO", "MIXED"],
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
      allowsComments: {
        oneOf: [{ type: "string" }, { type: "boolean" }],
      },
      allowsShares: {
        oneOf: [{ type: "string" }, { type: "boolean" }],
      },
      expiresAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
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
            id: { type: "string" },
            userId: { type: "number" },
            contentType: { type: "string" },
            caption: { type: "string" },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  imageUrl: { type: "string" },
                  altText: { type: "string" },
                  displayOrder: { type: "number" },
                  width: { type: "number" },
                  height: { type: "number" },
                  fileSize: { type: "number" },
                  createdAt: { type: "string" },
                },
              },
            },
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
            hashtags: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hashtag: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                      usageCount: { type: "number" },
                    },
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
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{32}$" },
    },
    required: ["postId"],
  },
  body: {
    type: "object",
    properties: {
      contentType: {
        type: "string",
        enum: ["TEXT", "IMAGE", "VIDEO", "MIXED"],
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
      allowsComments: {
        oneOf: [{ type: "string" }, { type: "boolean" }],
      },
      allowsShares: {
        oneOf: [{ type: "string" }, { type: "boolean" }],
      },
      expiresAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
    },
    additionalProperties: false,
    minProperties: 1,
    errorMessage: {
      minProperties: "At least one field must be provided to update.",
    },
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
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{32}$" },
    },
    required: ["postId"],
  },
  response: {
    200: { type: "object", properties: { message: { type: "string" } } },
    401: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const restorePostSchema = {
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{32}$" },
    },
    required: ["postId"],
  },
  response: {
    200: {
      type: "object",
      properties: { message: { type: "string" }, post: { type: "object" } },
    },
    401: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const getPostsSchema = {
  querystring: {
    type: "object",
    properties: {
      page: {
        oneOf: [
          { type: "integer", minimum: 1 },
          { type: "string", pattern: "^[1-9]\\d*$" },
        ],
        default: 1,
        description: "Page number for pagination",
      },
      limit: {
        oneOf: [
          { type: "integer", minimum: 1, maximum: 50 },
          { type: "string", pattern: "^([1-9]|[1-4]\\d|50)$" },
        ],
        default: 10,
        description: "Number of posts per page (max 50)",
      },
      cursor: {
        type: "string",
        description: "Cursor for cursor-based pagination (post ID)",
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        posts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              userId: { type: "number" },
              contentType: { type: "string" },
              caption: { type: "string" },
              images: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    imageUrl: { type: "string" },
                    altText: { type: "string" },
                    displayOrder: { type: "number" },
                    width: { type: "number" },
                    height: { type: "number" },
                    fileSize: { type: "number" },
                    createdAt: { type: "string" },
                  },
                },
              },
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
              liked: { type: "boolean" }, // Added this field
              hashtags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    hashtag: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        usageCount: { type: "number" },
                      },
                    },
                  },
                },
              },
              user: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  username: { type: "string" },
                  userInfo: {
                    type: "object",
                    properties: {
                      firstName: { type: "string" },
                      middleName: { type: "string" },
                      lastName: { type: "string" },
                      displayName: { type: "string" },
                      profilePictureUrl: { type: "string" },
                      coverPhotoUrl: { type: "string" },
                      bio: { type: "string" },
                      location: { type: "string" },
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
        pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            totalPosts: { type: "integer" },
            totalPages: { type: "integer" },
            hasNextPage: { type: "boolean" },
            hasPreviousPage: { type: "boolean" },
            nextCursor: { type: "string" },
            previousCursor: { type: "string" },
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
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{32}$" },
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
            id: { type: "string" },
            userId: { type: "number" },
            contentType: { type: "string" },
            caption: { type: "string" },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  imageUrl: { type: "string" },
                  altText: { type: "string" },
                  displayOrder: { type: "number" },
                  width: { type: "number" },
                  height: { type: "number" },
                  fileSize: { type: "number" },
                  createdAt: { type: "string" },
                },
              },
            },
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
            liked: { type: "boolean" }, // Added this field
            hashtags: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hashtag: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                      usageCount: { type: "number" },
                    },
                  },
                },
              },
            },
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

export const getPostsByHashtagSchema = {
  params: {
    type: "object",
    properties: {
      hashtag: { type: "string", minLength: 1 },
    },
    required: ["hashtag"],
  },
  querystring: {
    type: "object",
    properties: {
      page: {
        oneOf: [
          { type: "integer", minimum: 1 },
          { type: "string", pattern: "^[1-9]\\d*$" },
        ],
        default: 1,
        description: "Page number for pagination",
      },
      limit: {
        oneOf: [
          { type: "integer", minimum: 1, maximum: 50 },
          { type: "string", pattern: "^([1-9]|[1-4]\\d|50)$" },
        ],
        default: 10,
        description: "Number of posts per page (max 50)",
      },
      cursor: {
        type: "string",
        description: "Cursor for cursor-based pagination (post ID)",
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        posts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              userId: { type: "number" },
              contentType: { type: "string" },
              caption: { type: "string" },
              images: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    imageUrl: { type: "string" },
                    altText: { type: "string" },
                    displayOrder: { type: "number" },
                    width: { type: "number" },
                    height: { type: "number" },
                    fileSize: { type: "number" },
                    createdAt: { type: "string" },
                  },
                },
              },
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
              liked: { type: "boolean" }, // Added this field
              hashtags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    hashtag: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        usageCount: { type: "number" },
                      },
                    },
                  },
                },
              },
              user: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  username: { type: "string" },
                  userInfo: {
                    type: "object",
                    properties: {
                      firstName: { type: "string" },
                      middleName: { type: "string" },
                      lastName: { type: "string" },
                      displayName: { type: "string" },
                      profilePictureUrl: { type: "string" },
                      coverPhotoUrl: { type: "string" },
                      bio: { type: "string" },
                      location: { type: "string" },
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
        hashtag: { type: "string" },
        pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            totalPosts: { type: "integer" },
            totalPages: { type: "integer" },
            hasNextPage: { type: "boolean" },
            hasPreviousPage: { type: "boolean" },
            nextCursor: { type: "string" },
            previousCursor: { type: "string" },
          },
        },
      },
    },
    401: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const getTrendingHashtagsSchema = {
  querystring: {
    type: "object",
    properties: {
      limit: { type: "string", pattern: "^\\d+$" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        hashtags: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              usageCount: { type: "number" },
              createdAt: { type: "string" },
            },
          },
        },
      },
    },
    401: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

// ========== LIKE SCHEMAS ==========
export const likePostSchema = {
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{25}$" },
    },
    required: ["postId"],
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        like: {
          type: "object",
          properties: {
            id: { type: "string" },
            postId: { type: "string" },
            userId: { type: "string" },
            createdAt: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "string" },
                username: { type: "string" },
                userInfo: {
                  type: "object",
                  properties: {
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
    404: { type: "object", properties: { error: { type: "string" } } },
    409: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const unlikePostSchema = {
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{25}$" },
    },
    required: ["postId"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

// ========== COMMENT SCHEMAS ==========
export const createCommentSchema = {
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{25}$" },
    },
    required: ["postId"],
  },
  body: {
    type: "object",
    properties: {
      content: {
        type: "string",
        minLength: 1,
        maxLength: 1000,
        errorMessage: "Comment content must be between 1 and 1000 characters",
      },
      parentId: {
        type: "string",
        pattern: "^[a-zA-Z0-9]{25}$",
        nullable: true,
      },
    },
    required: ["content"],
    additionalProperties: false,
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        comment: {
          type: "object",
          properties: {
            id: { type: "string" },
            postId: { type: "string" },
            userId: { type: "string" },
            content: { type: "string" },
            parentId: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "string" },
                username: { type: "string" },
                userInfo: {
                  type: "object",
                  properties: {
                    displayName: { type: "string" },
                    profilePictureUrl: { type: "string" },
                  },
                },
              },
            },
            _count: {
              type: "object",
              properties: {
                replies: { type: "number" },
              },
            },
          },
        },
      },
    },
    400: { type: "object", properties: { error: { type: "string" } } },
    403: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const updateCommentSchema = {
  params: {
    type: "object",
    properties: {
      commentId: { type: "string", pattern: "^[a-zA-Z0-9]{25}$" },
    },
    required: ["commentId"],
  },
  body: {
    type: "object",
    properties: {
      content: {
        type: "string",
        minLength: 1,
        maxLength: 1000,
        errorMessage: "Comment content must be between 1 and 1000 characters",
      },
    },
    required: ["content"],
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        comment: {
          type: "object",
          properties: {
            id: { type: "string" },
            postId: { type: "string" },
            userId: { type: "string" },
            content: { type: "string" },
            parentId: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "string" },
                username: { type: "string" },
                userInfo: {
                  type: "object",
                  properties: {
                    displayName: { type: "string" },
                    profilePictureUrl: { type: "string" },
                  },
                },
              },
            },
            _count: {
              type: "object",
              properties: {
                replies: { type: "number" },
              },
            },
          },
        },
      },
    },
    400: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const deleteCommentSchema = {
  params: {
    type: "object",
    properties: {
      commentId: { type: "string", pattern: "^[a-zA-Z0-9]{25}$" },
    },
    required: ["commentId"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const getCommentsSchema = {
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{25}$" },
    },
    required: ["postId"],
  },
  querystring: {
    type: "object",
    properties: {
      page: {
        oneOf: [
          { type: "integer", minimum: 1 },
          { type: "string", pattern: "^[1-9]\\d*$" },
        ],
        default: 1,
        description: "Page number for pagination",
      },
      limit: {
        oneOf: [
          { type: "integer", minimum: 1, maximum: 50 },
          { type: "string", pattern: "^([1-9]|[1-4]\\d|50)$" },
        ],
        default: 20,
        description: "Number of comments per page (max 50)",
      },
      cursor: {
        type: "string",
        description: "Cursor for cursor-based pagination (comment ID)",
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        comments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              postId: { type: "string" },
              userId: { type: "string" },
              content: { type: "string" },
              parentId: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  username: { type: "string" },
                  userInfo: {
                    type: "object",
                    properties: {
                      displayName: { type: "string" },
                      profilePictureUrl: { type: "string" },
                    },
                  },
                },
              },
              replies: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    content: { type: "string" },
                    userId: { type: "string" },
                    createdAt: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        username: { type: "string" },
                        userInfo: {
                          type: "object",
                          properties: {
                            displayName: { type: "string" },
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
                  replies: { type: "number" },
                },
              },
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            totalComments: { type: "integer" },
            totalPages: { type: "integer" },
            hasNextPage: { type: "boolean" },
            hasPreviousPage: { type: "boolean" },
            nextCursor: { type: "string" },
            previousCursor: { type: "string" },
          },
        },
      },
    },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

// ========== SHARE SCHEMAS ==========
export const sharePostSchema = {
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{25}$" },
    },
    required: ["postId"],
  },
  body: {
    type: "object",
    properties: {
      caption: {
        type: "string",
        maxLength: 500,
        nullable: true,
      },
      privacyLevel: {
        type: "string",
        enum: ["PUBLIC", "FRIENDS", "PRIVATE"],
        default: "PUBLIC",
        errorMessage: "Invalid privacy level",
      },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        share: {
          type: "object",
          properties: {
            id: { type: "string" },
            postId: { type: "string" },
            userId: { type: "string" },
            caption: { type: "string" },
            privacyLevel: { type: "string" },
            createdAt: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "string" },
                username: { type: "string" },
                userInfo: {
                  type: "object",
                  properties: {
                    displayName: { type: "string" },
                    profilePictureUrl: { type: "string" },
                  },
                },
              },
            },
            post: {
              type: "object",
              properties: {
                id: { type: "string" },
                caption: { type: "string" },
                contentType: { type: "string" },
                user: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    userInfo: {
                      type: "object",
                      properties: {
                        displayName: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    400: { type: "object", properties: { error: { type: "string" } } },
    403: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    409: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const unsharePostSchema = {
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{25}$" },
    },
    required: ["postId"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const getSharesSchema = {
  params: {
    type: "object",
    properties: {
      postId: { type: "string", pattern: "^[a-zA-Z0-9]{25}$" },
    },
    required: ["postId"],
  },
  querystring: {
    type: "object",
    properties: {
      page: {
        oneOf: [
          { type: "integer", minimum: 1 },
          { type: "string", pattern: "^[1-9]\\d*$" },
        ],
        default: 1,
        description: "Page number for pagination",
      },
      limit: {
        oneOf: [
          { type: "integer", minimum: 1, maximum: 50 },
          { type: "string", pattern: "^([1-9]|[1-4]\\d|50)$" },
        ],
        default: 20,
        description: "Number of shares per page (max 50)",
      },
      cursor: {
        type: "string",
        description: "Cursor for cursor-based pagination (share ID)",
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        shares: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              postId: { type: "string" },
              userId: { type: "string" },
              caption: { type: "string" },
              privacyLevel: { type: "string" },
              createdAt: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  username: { type: "string" },
                  userInfo: {
                    type: "object",
                    properties: {
                      displayName: { type: "string" },
                      profilePictureUrl: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            totalShares: { type: "integer" },
            totalPages: { type: "integer" },
            hasNextPage: { type: "boolean" },
            hasPreviousPage: { type: "boolean" },
            nextCursor: { type: "string" },
            previousCursor: { type: "string" },
          },
        },
      },
    },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};
