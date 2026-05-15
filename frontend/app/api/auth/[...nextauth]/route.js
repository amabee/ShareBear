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
      // console.log("JWT Callback triggered:", {
      //   trigger,
      //   hasToken: !!token,
      //   hasUser: !!user,
      // });

      // Ensure token is a valid object
      if (!token || typeof token !== "object") {
        token = {};
      }

      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          username: user.username,
          email: user.email,
          sub: user.id,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
        };
      }

      // 60-second buffer before actual expiry to avoid edge races
      const bufferTime = 60 * 1000;
      const isExpired =
        token.accessTokenExpires &&
        Date.now() > token.accessTokenExpires - bufferTime;

      if (!isExpired) {
        return token;
      }

      if (token.refreshToken && !token.error) {
        try {
          const refreshedToken = await refreshAccessToken(token);
          if (refreshedToken.error) {
            return {
              ...token,
              error: "RefreshAccessTokenError",
              accessToken: null,
              accessTokenExpires: 0,
            };
          }
          return refreshedToken;
        } catch {
          return {
            ...token,
            error: "RefreshAccessTokenError",
            accessToken: null,
            accessTokenExpires: 0,
          };
        }
      }

      return {
        ...token,
        error: "RefreshAccessTokenError",
        accessToken: null,
        accessTokenExpires: 0,
      };
    },

    async session({ session, token }) {
      if (!token || token.error === "RefreshAccessTokenError") {
        return null;
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
  if (!token.refreshToken) {
    return { ...token, error: "RefreshAccessTokenError" };
  }

  const refreshKey = token.refreshToken;

  // Deduplicate concurrent refresh calls for the same token
  if (refreshPromises.has(refreshKey)) {
    try {
      return await refreshPromises.get(refreshKey);
    } catch {
      refreshPromises.delete(refreshKey);
    }
  }

  const refreshPromise = performRefresh(token);
  refreshPromises.set(refreshKey, refreshPromise);

  try {
    const result = await refreshPromise;
    refreshPromises.delete(refreshKey);
    return result;
  } catch (error) {
    refreshPromises.delete(refreshKey);
    throw error;
  }
}

async function performRefresh(token) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );

    const refreshedTokens = await response.json();

    if (!response.ok || !refreshedTokens.token || !refreshedTokens.refreshToken) {
      throw new Error(refreshedTokens.message || refreshedTokens.error || "Refresh failed");
    }

    return {
      ...token,
      accessToken: refreshedTokens.token,
      refreshToken: refreshedTokens.refreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export { handler as GET, handler as POST };
