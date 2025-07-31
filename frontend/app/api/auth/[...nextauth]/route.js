import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        usercred: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                usercred: credentials.usercred,
                password: credentials.password,
              }),
            }
          );
          const data = await response.json();
          if (response.ok && data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              username: data.user.username,
              accessToken: data.token,
              refreshToken: data.refreshToken,
            };
          }
          throw new Error(data.error || "Login failed");
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      console.log("JWT Callback triggered:", {
        trigger,
        hasToken: !!token,
        hasUser: !!user,
      });

      // Ensure token is a valid object - initialize if null/undefined
      if (!token || typeof token !== "object") {
        console.error("Invalid token object:", token);
        token = {}; // Initialize as empty object instead of returning {}
      }

      // Initial sign in
      if (account && user) {
        console.log("Initial sign in");
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          username: user.username,
          email: user.email, // Make sure to include email
          sub: user.id, // Make sure to include sub (user ID)
          accessTokenExpires: Date.now() + 30 * 60 * 1000,
        };
      }

      // Add a small buffer to prevent edge case race conditions
      const bufferTime = 30 * 1000; // 30 seconds buffer
      const isExpired =
        token.accessTokenExpires &&
        Date.now() > token.accessTokenExpires - bufferTime;

      // Return previous token if still valid
      if (!isExpired) {
        console.log("Token still valid");
        return token;
      }

      // Only refresh if we have a refresh token and no existing error
      if (token.refreshToken && !token.error) {
        console.log("Token expired, refreshing...");

        try {
          const refreshedToken = await refreshAccessToken(token);

          // If refresh failed, return a token with error instead of null
          if (refreshedToken.error) {
            console.log("Refresh failed, marking token as expired");
            return {
              ...token,
              error: "RefreshAccessTokenError",
              accessToken: null, // Clear the access token
              accessTokenExpires: 0, // Mark as expired
            };
          }

          return refreshedToken;
        } catch (error) {
          console.error("Refresh error:", error);
          // Return error token instead of null
          return {
            ...token,
            error: "RefreshAccessTokenError",
            accessToken: null,
            accessTokenExpires: 0,
          };
        }
      }

      console.log("No valid refresh token available");
      // Return error token instead of null
      return {
        ...token,
        error: "RefreshAccessTokenError",
        accessToken: null,
        accessTokenExpires: 0,
      };
    },

    async session({ session, token }) {
      // If token is null/undefined or has an error, return null to force re-authentication
      if (!token || token.error === "RefreshAccessTokenError") {
        console.log("Token error detected, forcing re-authentication");
        return null; // This will redirect to sign-in page
      }

      // Ensure session.user exists
      if (!session.user) {
        session.user = {};
      }

      session.user.id = token.sub;
      session.user.email = token.email;
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Use a Map to track refresh promises per token
const refreshPromises = new Map();

async function refreshAccessToken(token) {
  console.log("=== REFRESH TOKEN DEBUG START ===");
  console.log("Input token object:", {
    hasRefreshToken: !!token.refreshToken,
    refreshTokenLength: token.refreshToken?.length,
    refreshTokenStart: token.refreshToken?.substring(0, 20) + "...",
    hasAccessToken: !!token.accessToken,
    tokenKeys: Object.keys(token),
  });

  // Create a unique key for this refresh token
  const refreshKey = token.refreshToken;

  // If there's already a refresh in progress for this token, wait for it
  if (refreshPromises.has(refreshKey)) {
    console.log(
      "⏳ Refresh already in progress, waiting for existing promise..."
    );
    try {
      const result = await refreshPromises.get(refreshKey);
      console.log("✅ Using result from concurrent refresh");
      return result;
    } catch (error) {
      console.log("❌ Concurrent refresh failed, will try again");
      refreshPromises.delete(refreshKey);
    }
  }

  // Validate refresh token exists
  if (!token.refreshToken) {
    console.error("❌ No refresh token available");
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }

  // Create the refresh promise
  const refreshPromise = performRefresh(token);
  refreshPromises.set(refreshKey, refreshPromise);

  try {
    const result = await refreshPromise;
    refreshPromises.delete(refreshKey); // Clear the promise on success
    return result;
  } catch (error) {
    refreshPromises.delete(refreshKey); // Clear the promise on error
    throw error;
  }
}

async function performRefresh(token) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/auth/refresh`;

    const requestBody = {
      refreshToken: token.refreshToken,
    };

    console.log("🔄 Making refresh request:", {
      url: endpoint,
      refreshTokenPreview: token.refreshToken.substring(0, 20) + "...",
      timestamp: new Date().toISOString(),
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);

    let refreshedTokens;
    try {
      refreshedTokens = await response.json();
    } catch (parseError) {
      console.error("❌ Failed to parse response JSON:", parseError);
      throw new Error("Invalid JSON response");
    }

    console.log("Parsed response:", {
      hasToken: !!refreshedTokens.token,
      hasRefreshToken: !!refreshedTokens.refreshToken,
      error: refreshedTokens.error,
    });

    if (!response.ok) {
      console.error("❌ Refresh failed with status:", response.status);
      console.error("❌ Error response:", refreshedTokens);
      throw new Error(
        refreshedTokens.message || refreshedTokens.error || "Refresh failed"
      );
    }

    // Validate response structure
    if (!refreshedTokens.token || !refreshedTokens.refreshToken) {
      console.error("❌ Invalid response structure");
      throw new Error("Invalid token response structure");
    }

    const newTokenObject = {
      ...token,
      accessToken: refreshedTokens.token,
      refreshToken: refreshedTokens.refreshToken,
      accessTokenExpires: Date.now() + 30 * 60 * 1000,
      error: undefined,
    };

    console.log("✅ Token refresh successful!");
    console.log(
      "✅ New token expires at:",
      new Date(newTokenObject.accessTokenExpires).toISOString()
    );
    console.log("=== REFRESH TOKEN DEBUG END ===");

    return newTokenObject;
  } catch (error) {
    console.error("=== REFRESH TOKEN ERROR ===");
    console.error("Error message:", error?.message);
    console.error("Full error:", error);
    console.error("=== END ERROR ===");

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export { handler as GET, handler as POST };
