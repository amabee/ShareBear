import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/(home)")) {
          return !!token;
        }

        // For auth routes, allow access (the layout will handle redirects)
        if (req.nextUrl.pathname.startsWith("/(auth)")) {
          return true;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/(home)/:path*",
    "/(auth)/:path*",
    "/api/posts/:path*",
    "/api/follow/:path*",
  ],
};
