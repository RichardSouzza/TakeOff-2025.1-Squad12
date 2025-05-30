import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get("authMock");

  if (pathname.startsWith("/dashboards") && !auth) {
    // return NextResponse.redirect(new URL("/", request.url));
  }
console.log("teste",pathname);

  if (!pathname.startsWith("/dashboards")) {
    const response = NextResponse.next();
    response.cookies.delete("authMock");
    return response;
  }

  return NextResponse.next();
}
