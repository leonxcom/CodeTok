import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import createIntlMiddleware from 'next-intl/middleware';
import { routing, locales } from './i18n/routing';

/**
 * Paths that require authentication
 */
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
];

/**
 * Create the internationalization middleware
 */
const intlMiddleware = createIntlMiddleware({
  ...routing,
  // Force default locale (Chinese) regardless of browser settings
  defaultLocale: 'zh',
  localeDetection: false
});

/**
 * Check if a path requires authentication
 */
const isProtectedPath = (pathname: string) => {
  return protectedPaths.some(path => {
    // Extract locale from path if present
    const pathWithoutLocale = extractPathWithoutLocale(pathname);
    return pathWithoutLocale.startsWith(path) || pathWithoutLocale === path;
  });
};

/**
 * Extract the path without locale prefix
 */
const extractPathWithoutLocale = (pathname: string) => {
  // Check if path starts with a locale
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.substring(`/${locale}`.length) || '/';
    }
  }
  return pathname;
};

/**
 * Check if session is valid
 */
const checkSession = async (sessionToken: string) => {
  try {
    // Verify session token
    const sessionData = await db.select()
      .from(sessions)
      .where(eq(sessions.sessionToken, sessionToken));

    if (sessionData.length === 0) {
      // Session not found
      return false;
    }

    const session = sessionData[0];

    // Check if session is expired
    if (new Date() > new Date(session.expires)) {
      // Session expired
      return false;
    }

    // Session is valid
    return true;
  } catch (error) {
    console.error('Error verifying session:', error);
    return false;
  }
};

/**
 * Main middleware function that combines internationalization and authentication
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply internationalization middleware first
  const response = intlMiddleware(request);
  
  // Check if the path is protected
  if (!isProtectedPath(pathname)) {
    return response;
  }
  
  // Get session token from cookies
  const sessionToken = request.cookies.get('sessionToken')?.value;

  if (!sessionToken) {
    // Redirect to login page if no session token
    const url = new URL(`/${request.nextUrl.locale}/auth`, request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // Check if session is valid
  const isValidSession = await checkSession(sessionToken);
  
  if (!isValidSession) {
    // Redirect to login page if session is invalid
    const url = new URL(`/${request.nextUrl.locale}/auth`, request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // Session is valid, proceed with the internationalization response
  return response;
}

/**
 * Configure the paths that should be matched by the middleware
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
