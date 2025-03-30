import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, localePrefix } from '../i18n/config'

// Create the i18n middleware
const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix
})

// 检查路径是否为静态资源
function isStaticAsset(path: string): boolean {
  // 检查常见静态资源扩展名
  return /\.(svg|png|jpg|jpeg|gif|ico|css|js|woff|woff2|ttf|eot|map)$/.test(path);
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  const path = url.pathname
  
  console.log('[Middleware] Processing path:', path);
  
  // 如果是静态资源请求，直接跳过处理
  if (isStaticAsset(path)) {
    console.log('[Middleware] Static asset detected, skipping');
    return NextResponse.next();
  }
  
  // Check if using a subdomain for code sharing
  const subdomain = hostname.split('.')[0]
  
  if (hostname !== 'vibetok.app' && hostname.endsWith('vibetok.app')) {
    // Rewrite the URL to the project page
    url.pathname = `/project/${subdomain}`
    console.log('[Middleware] Subdomain detected, rewriting to:', url.pathname);
    return NextResponse.rewrite(url)
  }
  
  // Force default language to be zh-cn
  // If path is root or doesn't include a locale prefix, redirect to zh-cn
  if (path === '/' || (
    !locales.some(locale => path.startsWith(`/${locale}`)) && 
    !path.startsWith('/_next') && 
    !path.startsWith('/api')
  )) {
    url.pathname = `/zh-cn${path === '/' ? '' : path}`
    console.log('[Middleware] Redirecting to locale path:', url.pathname);
    return NextResponse.redirect(url)
  }
  
  // Continue with i18n middleware for regular routes
  console.log('[Middleware] Passing to i18n middleware');
  return i18nMiddleware(request)
}

export const config = {
  // 使用Next.js支持的格式定义matcher
  matcher: [
    // 匹配除了api和_next路径外的所有路径
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
