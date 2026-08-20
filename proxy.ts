
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED = ['/profile', '/orders', '/payment'];
const AUTH_PAGES = ['/signin', '/signup'];

export function proxy(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  const { pathname } = req.nextUrl;

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !session) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
  if (AUTH_PAGES.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/profile/:path*', '/orders/:path*', '/payment/:path*', '/signin', '/signup'] };