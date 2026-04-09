import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/profile/edit", "/jobs/post"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected) {
    // Check for token in cookies (for SSR) or redirect to login
    // Since we use localStorage (client-only), we check a cookie we'll set on login
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/edit/:path*", "/jobs/post/:path*"],
};
