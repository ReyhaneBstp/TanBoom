import { NextResponse } from "next/server";
import { auth } from "@/auth";

const authRoutes = new Set(["/login", "/register"]);
const protectedRoutes = ["/design"];

export default auth((req) => {
  const { nextUrl } = req;
  // فقط وجود user یعنی لاگین واقعی؛ req.auth در حالت خطا هم می‌تواند آبجکت (truthy) باشد
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
  matcher: ["/design/:path*", "/login", "/register"],
};