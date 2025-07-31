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
    async jwt({ token, user, account }) {
      // Ensure token is a valid object
      if (!token || typeof token !== "object") {
        console.error("Invalid token object:", token);
        return {};
      }

      // Initial sign in
      if (account && user) {
        console.log("Initial sign in");
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          username: user.username,
          accessTokenExpires: Date.now() + 1 * 60 * 1000, // Set expiry time (1 hour)
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        console.log("Token still valid: ", token);
        return token;
      }

      // Access token has expired, try to update it
      if (token.refreshToken) {
        console.log("Token expired, refreshing...");
        const refreshedToken = await refreshAccessToken(token);
        return refreshedToken;
      }

      // No refresh token available, return token as is
      console.log("No refresh token available");
      return token;
    },
    async session({ session, token }) {
      if (!token) {
        return null;
      }

      // console.log(token);

      // If there's an error in the token, return a session with the error
      if (token.error) {
        return {
          ...session,
          error: token.error,
        };
      }

      // Ensure session.user exists
      if (!session.user) {
        session.user = {};
      }

      session.user.id = token.sub;
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
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

async function refreshAccessToken(token) {
  console.log("Refreshing token:", {
    hasRefreshToken: !!token.refreshToken,
    hasAccessToken: !!token.accessToken,
    expiresAt: token.accessTokenExpires,
  });

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001"
      }/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        }),
      }
    );

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("Refresh failed:", refreshedTokens);
      throw refreshedTokens;
    }

    console.log("Token refreshed successfully");
    return {
      ...token,
      accessToken: refreshedTokens.token,
      refreshToken: refreshedTokens.refreshToken,
      accessTokenExpires: Date.now() + 1 * 60 * 1000, // 1 hour
    };
  } catch (error) {
    console.error("Error refreshing token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export { handler as GET, handler as POST };
