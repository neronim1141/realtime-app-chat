import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(async function middleware(req) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/"],
};
