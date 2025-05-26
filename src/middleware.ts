import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale } from '../i18n/config'

// 简单的中间件，只处理语言重定向
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // 跳过静态资源和API路由
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/') ||
    pathname.includes('.') || // 简单地跳过所有带点的路径（通常是静态资源）
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }
  
  // 检查路径中是否已包含有效的语言代码
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  // 如果没有语言前缀，则重定向到默认语言
  if (!pathnameHasLocale) {
    const url = new URL(request.url)
    url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// 简单的matcher配置
export const config = {
  matcher: ['/', '/:path*']
} 