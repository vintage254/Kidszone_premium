import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;

  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (!user) {
      // Not logged in, redirect to sign-in page
      return NextResponse.redirect(new URL('/api/auth/signin', nextUrl));
    }

    if (user.role !== 'ADMIN') {
      // Logged in but not an admin, redirect to home or an unauthorized page
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
