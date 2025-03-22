import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware({
  // 使用routing中定义的配置
  ...routing
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
