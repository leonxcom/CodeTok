import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, localePrefix } from '../i18n/config'

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  localePrefix,
  // Used when no locale matches
  defaultLocale,
})

// 遵循next-intl官方文档推荐的matcher配置
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
