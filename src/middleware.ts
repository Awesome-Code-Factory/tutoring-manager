import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./auth/verifySession";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  const pathname = request.nextUrl.pathname;
  const redirectTo = request.nextUrl.searchParams.get("redirectTo");
  const { userId } = await verifySession();
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.append("redirectTo", pathname);

  if (userId === null && pathname !== "/login")
    return NextResponse.redirect(loginUrl);
  if (userId !== null && pathname === "/login")
    return NextResponse.redirect(
      new URL(`/${redirectTo?.replace("/", "") ?? ""}`, request.url),
    );
}
