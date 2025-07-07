export const registerSchema = {
  body: {
    type: "object",
    required: ["email", "password", "userInfo"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
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
