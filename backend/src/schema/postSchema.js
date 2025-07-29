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
      allowsComments: { 
        oneOf: [
          { type: "string" },
          { type: "boolean" }
        ]
      },
      allowsShares: { 
        oneOf: [
          { type: "string" },
          { type: "boolean" }
        ]
      },
      expiresAt: { 
        type: "string", 
        format: "date-time",
        nullable: true 
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
            id: { type: "number" },
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
  consumes: ['multipart/form-data'],
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
      allowsComments: { 
        oneOf: [
          { type: "string" },
          { type: "boolean" }
        ]
      },
      allowsShares: { 
        oneOf: [
          { type: "string" },
          { type: "boolean" }
        ]
      },
      expiresAt: { 
        type: "string", 
        format: "date-time",
        nullable: true 
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
            id: { type: "number" },
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
      allowsComments: { 
        oneOf: [
          { type: "string" },
          { type: "boolean" }
        ]
      },
      allowsShares: { 
        oneOf: [
          { type: "string" },
          { type: "boolean" }
        ]
      },
      expiresAt: { 
        type: "string", 
        format: "date-time",
        nullable: true 
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
  response: {
    200: { type: "object", properties: { message: { type: "string" } } },
    401: { type: "object", properties: { error: { type: "string" } } },
    404: { type: "object", properties: { error: { type: "string" } } },
    500: { type: "object", properties: { error: { type: "string" } } },
  },
};

export const restorePostSchema = {
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
