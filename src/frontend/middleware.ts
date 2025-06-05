import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const auth = request.cookies.get("auth-token");

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!auth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\.(?:ico|svg|png|jpg|jpeg|webp|css|js)$).*)",
  ],
};
