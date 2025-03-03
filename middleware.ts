import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes that require authentication
const protectedRoutes = ["/dashboard"];
// Auth-related routes that should be accessible only to non-authenticated users
const authRoutes = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and during auth process
  if (pathname.startsWith("/api") || pathname.includes("auth")) {
    return NextResponse.next();
  }

  // Check for session token
  const hasSession = Boolean(
    request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value
  );

  // Only protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (hasSession && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
