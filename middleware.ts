import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/",
  "/grocery",
  "/product",
  "/cart",
  "/checkout",
  "/login",
  "/register",
];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublic = publicRoutes.some(
    (route) => path === route || path.startsWith(route + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};