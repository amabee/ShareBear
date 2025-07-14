export const createPostSchema = {
  body: {
    type: "object",
    properties: {
      contentType: { type: "string", enum: ["TEXT", "IMAGE", "VIDEO"], errorMessage: "Invalid content type" },
      caption: { type: "string" },
      thumbnailUrl: { type: "string" },
      location: { type: "string" },
      taggedUsers: { type: "string" },
      privacyLevel: { type: "string", enum: ["PUBLIC", "PRIVATE", "FRIENDS"], errorMessage: "Invalid privacy level" },
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
