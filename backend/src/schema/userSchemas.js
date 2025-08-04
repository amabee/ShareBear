// Get user data by identifier
export const getUserDataSchema = {
  params: {
    type: "object",
    required: ["identifier"],
    properties: {
      identifier: { 
        type: "string", 
        minLength: 2,
        errorMessage: "User identifier is required"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            username: { type: "string" },
            email: { type: "string" },
            accountType: { type: "string" },
            privacySettings: { type: "string" },
            verificationStatus: { type: "boolean" },
            isActive: { type: "boolean" },
            createdAt: { type: "string" },
            userInfo: {
              type: "object",
              properties: {
                firstName: { type: "string" },
                lastName: { type: "string" },
                displayName: { type: "string" },
                profilePictureUrl: { type: "string" },
                bio: { type: "string" },
                location: { type: "string" },
                // website: { type: "string" },
                // isPrivate: { type: "boolean" },
                // isVerified: { type: "boolean" },
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
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

// Get user profile with stats and follow status
export const getUserProfileSchema = {
  params: {
    type: "object",
    required: ["identifier"],
    properties: {
      identifier: { 
        type: "string", 
        minLength: 1,
        errorMessage: "User identifier is required"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        profile: {
          type: "object",
          properties: {
            id: { type: "number" },
            username: { type: "string" },
            email: { type: "string" },
            accountType: { type: "string" },
            privacySettings: { type: "string" },
            verificationStatus: { type: "boolean" },
            isActive: { type: "boolean" },
            createdAt: { type: "string" },
            followStatus: { type: "string" },
            userInfo: {
              type: "object",
              properties: {
                firstName: { type: "string" },
                lastName: { type: "string" },
                displayName: { type: "string" },
                profilePictureUrl: { type: "string" },
                coverPhotoUrl: { type: "string" },
                bio: { type: "string" },
                location: { type: "string" },
                website: { type: "string" },
                birthDate: { type: "string" },
                gender: { type: "string" },
                isPrivate: { type: "boolean" },
                isVerified: { type: "boolean" },
              },
            },
            stats: {
              type: "object",
              properties: {
                postsCount: { type: "number" },
                followersCount: { type: "number" },
                followingCount: { type: "number" },
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
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

// Get user statistics
export const getUserStatsSchema = {
  params: {
    type: "object",
    required: ["identifier"],
    properties: {
      identifier: { 
        type: "string", 
        minLength: 1,
        errorMessage: "User identifier is required"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        stats: {
          type: "object",
          properties: {
            posts: { type: "number" },
            followers: { type: "number" },
            following: { type: "number" },
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
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

// Get user followers
export const getFollowersSchema = {
  params: {
    type: "object",
    required: ["identifier"],
    properties: {
      identifier: { 
        type: "string", 
        minLength: 1,
        errorMessage: "User identifier is required"
      },
    },
  },
  querystring: {
    type: "object",
    properties: {
      limit: { 
        type: "integer", 
        minimum: 1, 
        maximum: 100, 
        default: 20,
        errorMessage: "Limit must be between 1 and 100"
      },
      offset: { 
        type: "integer", 
        minimum: 0, 
        default: 0,
        errorMessage: "Offset must be 0 or greater"
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
                      bio: { type: "string" },
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
    404: {
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

// Get user following
export const getFollowingsSchema = {
  params: {
    type: "object",
    required: ["identifier"],
    properties: {
      identifier: { 
        type: "string", 
        minLength: 1,
        errorMessage: "User identifier is required"
      },
    },
  },
  querystring: {
    type: "object",
    properties: {
      limit: { 
        type: "integer", 
        minimum: 1, 
        maximum: 100, 
        default: 20,
        errorMessage: "Limit must be between 1 and 100"
      },
      offset: { 
        type: "integer", 
        minimum: 0, 
        default: 0,
        errorMessage: "Offset must be 0 or greater"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        followings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              followerId: { type: "number" },
              followingId: { type: "number" },
              status: { type: "string" },
              createdAt: { type: "string" },
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
                      bio: { type: "string" },
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
    404: {
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

// Search users
export const searchUsersSchema = {
  querystring: {
    type: "object",
    required: ["q"],
    properties: {
      q: { 
        type: "string", 
        minLength: 1,
        errorMessage: "Search query is required"
      },
      limit: { 
        type: "integer", 
        minimum: 1, 
        maximum: 100, 
        default: 20,
        errorMessage: "Limit must be between 1 and 100"
      },
      offset: { 
        type: "integer", 
        minimum: 0, 
        default: 0,
        errorMessage: "Offset must be 0 or greater"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        users: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              username: { type: "string" },
              email: { type: "string" },
              accountType: { type: "string" },
              privacySettings: { type: "string" },
              verificationStatus: { type: "boolean" },
              isActive: { type: "boolean" },
              userInfo: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  displayName: { type: "string" },
                  profilePictureUrl: { type: "string" },
                  bio: { type: "string" },
                  isVerified: { type: "boolean" },
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
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

// Get suggested users
export const getSuggestedUsersSchema = {
  querystring: {
    type: "object",
    properties: {
      limit: { 
        type: "integer", 
        minimum: 1, 
        maximum: 50, 
        default: 10,
        errorMessage: "Limit must be between 1 and 50"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        suggestions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              username: { type: "string" },
              accountType: { type: "string" },
              privacySettings: { type: "string" },
              verificationStatus: { type: "boolean" },
              userInfo: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  displayName: { type: "string" },
                  profilePictureUrl: { type: "string" },
                  bio: { type: "string" },
                  isVerified: { type: "boolean" },
                },
              },
              _count: {
                type: "object",
                properties: {
                  followers: { type: "number" },
                },
              },
            },
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

// Update user profile
export const updateUserProfileSchema = {
  body: {
    type: "object",
    properties: {
      firstName: { 
        type: "string", 
        maxLength: 50,
        errorMessage: "First name must be 50 characters or less"
      },
      lastName: { 
        type: "string", 
        maxLength: 50,
        errorMessage: "Last name must be 50 characters or less"
      },
      displayName: { 
        type: "string", 
        maxLength: 100,
        errorMessage: "Display name must be 100 characters or less"
      },
      bio: { 
        type: "string", 
        maxLength: 500,
        errorMessage: "Bio must be 500 characters or less"
      },
      location: { 
        type: "string", 
        maxLength: 100,
        errorMessage: "Location must be 100 characters or less"
      },
      profilePictureUrl: { 
        type: "string", 
        format: "uri",
        errorMessage: "Profile picture URL must be a valid URI"
      },
      coverPhotoUrl: { 
        type: "string", 
        format: "uri",
        errorMessage: "Cover photo URL must be a valid URI"
      },
      birthDate: { 
        type: "string", 
        format: "date",
        errorMessage: "Birth date must be a valid date"
      },
      gender: { 
        type: "string", 
        enum: ["MALE", "FEMALE", "OTHER", "UNSPECIFIED"],
        errorMessage: "Gender must be one of: MALE, FEMALE, OTHER, UNSPECIFIED"
      },
      website: { 
        type: "string", 
        format: "uri",
        errorMessage: "Website must be a valid URI"
      },
      isPrivate: { type: "boolean" },
      isVerified: { type: "boolean" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        profile: {
          type: "object",
          properties: {
            id: { type: "number" },
            userId: { type: "number" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            displayName: { type: "string" },
            bio: { type: "string" },
            location: { type: "string" },
            profilePictureUrl: { type: "string" },
            coverPhotoUrl: { type: "string" },
            birthDate: { type: "string" },
            gender: { type: "string" },
            website: { type: "string" },
            isPrivate: { type: "boolean" },
            isVerified: { type: "boolean" },
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
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

// Update user account settings
export const updateUserAccountSettingsSchema = {
  body: {
    type: "object",
    properties: {
      accountType: { 
        type: "string", 
        enum: ["PERSONAL", "BUSINESS", "CREATOR"],
        errorMessage: "Account type must be one of: PERSONAL, BUSINESS, CREATOR"
      },
      privacySettings: { 
        type: "string", 
        enum: ["PUBLIC", "PRIVATE", "FRIENDS"],
        errorMessage: "Privacy settings must be one of: PUBLIC, PRIVATE, FRIENDS"
      },
      verificationStatus: { type: "boolean" },
      phone: { 
        type: "string", 
        pattern: "^[+]?[0-9\\s\\-()]+$",
        errorMessage: "Phone number must contain only digits, spaces, hyphens, parentheses, and optionally a plus sign"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            username: { type: "string" },
            email: { type: "string" },
            accountType: { type: "string" },
            privacySettings: { type: "string" },
            verificationStatus: { type: "boolean" },
            phone: { type: "string" },
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
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

// Deactivate user (admin only)
export const deactivateUserSchema = {
  params: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: { 
        type: "integer", 
        minimum: 1,
        errorMessage: "User ID must be a positive integer"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            username: { type: "string" },
            isActive: { type: "boolean" },
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
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

// Reactivate user (admin only)
export const reactivateUserSchema = {
  params: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: { 
        type: "integer", 
        minimum: 1,
        errorMessage: "User ID must be a positive integer"
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            username: { type: "string" },
            isActive: { type: "boolean" },
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
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
}; 
