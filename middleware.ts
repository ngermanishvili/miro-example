import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"];
// Auth-related routes
const authRoutes = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip middleware for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // IMPORTANT: Check for post-authentication redirects by examining request headers
  const referer = request.headers.get("referer") || "";

  // Very comprehensive detection of auth flow
  const isPostAuthFlow =
    referer.includes("/api/auth/callback") ||
    referer.includes("/api/auth/signin") ||
    referer.includes("/sign-in") ||
    search.includes("callbackUrl") ||
    search.includes("error=") || // Auth error flows
    request.cookies.has("next-auth.callback-url") ||
    request.cookies.has("__Secure-next-auth.callback-url") ||
    request.cookies.has("__Host-next-auth.csrf-token");

  // Check for any authentication-related cookies in a comprehensive way
  const hasAuthCookies = Boolean(
    request.cookies.get("next-auth.callback-url")?.value ||
      request.cookies.get("next-auth.csrf-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.callback-url")?.value ||
      request.cookies.get("__Secure-next-auth.csrf-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value ||
      request.cookies.get("__Host-next-auth.csrf-token")?.value
  );

  // Check for actual session token which confirms authentication
  const sessionCookie =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token") ||
    request.cookies.get("__Host-next-auth.session-token");

  const hasSession = Boolean(sessionCookie?.value);

  // If there's any sign we're in an auth flow, allow the request to pass through
  // This prevents redirect loops during authentication
  if (isPostAuthFlow) {
    console.log(
      `[Middleware] Auth flow detected for ${pathname}, allowing access`
    );
    return NextResponse.next();
  }

  // For protected routes, validate authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!hasSession) {
      console.log(
        `[Middleware] Unauthorized access to ${pathname} - redirecting to sign-in`
      );
      const url = new URL("/sign-in", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    console.log(`[Middleware] Authorized access to ${pathname}`);
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname === route) && hasSession) {
    console.log(
      `[Middleware] Authenticated user on auth page - redirecting to dashboard`
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
