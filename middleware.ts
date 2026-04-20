import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const pathname = request.nextUrl.pathname;

  // Public paths (no auth required)
  const publicPaths = ['/login'];
  if (publicPaths.includes(pathname)) {
    if (isAuthenticated) {
      const role = token.role as string;
      if (role === 'TRAINER') {
        return NextResponse.redirect(new URL('/trainer', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Require authentication for all other pages
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  const role = token.role as string;

  // Protect trainer routes from non-trainers
  if (pathname.startsWith('/trainer') && role !== 'TRAINER') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect owner routes from trainers
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/gym')) && role === 'TRAINER') {
    return NextResponse.redirect(new URL('/trainer', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
