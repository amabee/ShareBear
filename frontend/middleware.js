import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Routes that require authentication (actual URL paths, not folder group names)
const PROTECTED_PATHS = ["/", "/notifications", "/profile", "/reels", "/search"];
// Routes only for unauthenticated users
const AUTH_PATHS = ["/login", "/signup"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token && !token.error;

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Unauthenticated user trying to access a protected page → redirect to login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access login/signup → redirect to home
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (static assets)
     * - favicon.ico
     * - /api/auth (NextAuth internal routes)
     * - /media (uploaded file serving)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|media).*)",
  ],
};
