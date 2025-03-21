import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, Locale } from '@/config/i18n';
import { NextRequest, NextResponse } from 'next/server';

// Create internationalization middleware
const intlMiddleware = createMiddleware({
  // Supported language list
  locales,
  // Default language
  defaultLocale,
  // Always show language prefix in URL
  localePrefix: 'always'
});

// Enhance middleware with cache control
export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Handle root path - redirect to default locale
  if (pathname === '/' || pathname === '') {
    const url = new URL(`/${defaultLocale}`, request.url);
    return NextResponse.redirect(url);
  }
  
  // Extract locale from path
  const firstSegment = pathname.split('/')[1];
  const isLocaleInPath = locales.includes(firstSegment as Locale);
  
  // If the path doesn't start with a locale, redirect to the default locale
  if (!isLocaleInPath && pathname !== '/favicon.ico') {
    const url = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }
  
  // Add cache control headers to prevent wrong language caching
  const response = intlMiddleware(request) as NextResponse;
  
  // Prevent caching of language-specific content
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  
  // Add a debug header to see which locale is being used
  const requestedLocale = isLocaleInPath ? firstSegment as Locale : defaultLocale;
  response.headers.set('X-Next-Locale', requestedLocale);
  
  return response;
}

// Configure matching paths
export const config = {
  // Match all paths, including root path, but exclude static assets
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)']
};