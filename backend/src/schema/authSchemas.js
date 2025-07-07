export const registerSchema = {
  body: {
    type: "object",
    required: ["email", "password", "userInfo"],
    properties: {
      email: { type: "string", format: "email" },
      password: {
        type: "string",
        minLength: 8,
        maxLength: 24,
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,24}$",
        errorMessage: {
          pattern:
            "Password must be 8-18 characters and include an uppercase letter, a lowercase letter, a number, and a special character",
        },
      },
      userInfo: {
        type: "object",
        required: ["firstName", "lastName", "birthDate", "location"],
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          birthDate: { type: "string", format: "date-time" },
          location: { type: "string" },
        },
        errorMessage: {
          required: {
            firstName: "First name is required",
            lastName: "Last name is required",
            birthDate: "Birth date is required",
            location: "Location is required",
          },
        },
      },
    },
    errorMessage: {
      required: {
        email: "Email is required",
        password: "Password is required",
        userInfo: "User info is required",
      },
      properties: {
        email: "Email must be a valid email address",
        password: "Password must be at least 6 characters",
      },
    },
  },
};

export const loginSchema = {
  body: {
    type: "object",
    required: ["usercred", "password"],
    properties: {
      usercred: { type: "string" },
      password: { type: "string", minLength: 8 },
    },
    errorMessage: {
      required: {
        usercred: "Usercred is required",
        password: "Password is required",
      },
      properties: {
        usercred: "Usercred can be the email or the username of the user",
        password: "Password must be at least 8 characters",
      },
    },
  },
};

export const refreshSchema = {
  body: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string" },
    },
    errorMessage: {
      required: {
        refreshToken: "Refresh token is required",
      },
      properties: {
        refreshToken: "Refresh token must be a string",
      },
    },
  },
};
