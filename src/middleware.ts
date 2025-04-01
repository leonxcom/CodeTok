import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, localePrefix } from '../i18n/config'

// Create the i18n middleware
const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix
})

// Check if path is a static asset
function isStaticAsset(path: string): boolean {
  // Check common static asset extensions
  return /\.(svg|png|jpg|jpeg|gif|ico|css|js|woff|woff2|ttf|eot|map)$/.test(path);
}

// Main middleware function with enhanced reliability
export function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl.clone()
    const hostname = request.headers.get('host') || ''
    const path = url.pathname
    
    console.log('[Middleware] Processing path:', path);
    
    // Skip processing for static assets
    if (isStaticAsset(path) || path.includes('_next') || path.includes('favicon.ico')) {
      console.log('[Middleware] Static asset detected, skipping');
      return NextResponse.next();
    }
    
    // Check if using a subdomain for code sharing
    const subdomain = hostname.split('.')[0]
    
    if (hostname !== 'codetok.app' && hostname.endsWith('codetok.app')) {
      // Rewrite the URL to the project page
      url.pathname = `/project/${subdomain}`
      console.log('[Middleware] Subdomain detected, rewriting to:', url.pathname);
      return NextResponse.rewrite(url)
    }
    
    // Handle API routes directly without localization
    if (path.startsWith('/api')) {
      console.log('[Middleware] API route detected, skipping localization');
      return NextResponse.next();
    }
    
    // Force default language to be zh-cn
    // If path is root or doesn't include a locale prefix, redirect to zh-cn
    if (path === '/' || !locales.some((locale: string) => path.startsWith(`/${locale}`))) {
      url.pathname = `/${defaultLocale}${path === '/' ? '' : path}`
      console.log('[Middleware] Redirecting to locale path:', url.pathname);
      return NextResponse.redirect(url)
    }
    
    // Continue with i18n middleware for regular routes
    console.log('[Middleware] Passing to i18n middleware');
    return i18nMiddleware(request)
  } catch (error) {
    // Error recovery - log error and allow request to proceed
    console.error('[Middleware] Error in middleware execution:', error);
    return NextResponse.next();
  }
}

// More specific matcher patterns to improve performance
export const config = {
  matcher: [
    // Skip static files, API routes, and Next.js internal routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
