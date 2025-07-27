import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        usercred: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001"}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usercred: credentials.usercred,
              password: credentials.password,
            }),
          });

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

          // If login failed, throw error with the specific message from API
          // Log the actual response for debugging
          // console.log("Login failed - Status:", response.status);
          // console.log("Login failed - Data:", data);
          
          throw new Error(data.error || "Login failed");
        } catch (error) {
          // console.error("Auth error:", error);
          
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          username: user.username,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

async function refreshAccessToken(token) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001"}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.token,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
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
