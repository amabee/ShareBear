import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect all routes under /home except auth pages
        if (req.nextUrl.pathname.startsWith("/(home)")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/(home)/:path*",
    "/api/posts/:path*",
    "/api/follow/:path*",
  ],
}; 
