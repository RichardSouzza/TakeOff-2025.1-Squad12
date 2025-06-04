import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get("auth-token");

  if (publicRoutes.includes(pathname)) {
    console.log("Permitir", pathname);
    return NextResponse.next();
  }

  else if (!auth) {
    console.log("Bloquear", pathname)
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.ico|.*\\.svg|.*\\.png$).*)"],
}
