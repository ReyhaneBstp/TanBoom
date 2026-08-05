import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const authRoutes = new Set(["/login"]);
const protectedRoutes = ["/design"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth?.user);
  const isAuthRoute = authRoutes.has(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/design/:path*", "/login"],
};