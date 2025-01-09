// import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


// Temporarily disable auth checks
export function middleware() {
  return NextResponse.next();
}

// Keeping matchers for future use when auth is re-enabled
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ]
};
