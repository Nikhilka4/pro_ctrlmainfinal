import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname === "/auth";
  const isAdminDashboard = request.nextUrl.pathname === "/admin-dashboard";
  const isDefaultPage = request.nextUrl.pathname === "/";

  // If user is not logged in
  if (!token) {
    // Redirect to auth page if trying to access protected routes
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    // Allow access to auth page
    return NextResponse.next();
  }

  // If user is logged in
  // Prevent accessing auth page when logged in
  if (isAuthPage) {
    return NextResponse.redirect(
      new URL(token.role === "admin" ? "/admin-dashboard" : "/", request.url)
    );
  }

  // Redirect admin from root path to admin dashboard
  if (isDefaultPage && token.role === "admin") {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  // Handle admin dashboard access - only admins can access
  if (isAdminDashboard && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth",
    "/admin-dashboard",
    "/projects/:path*",
    "/tools/:path*",
  ],
};
