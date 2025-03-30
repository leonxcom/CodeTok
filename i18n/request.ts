import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

import { locales, defaultLocale } from './config'

// 在next-intl 4.0.2中，locale参数已弃用，将来使用requestLocale
// 但在TypeScript类型尚未更新前临时使用此方法
export default getRequestConfig(async ({ locale }: { locale?: string } = {}) => {
  // Validate locale
  if (!locale || !locales.includes(locale as any)) {
    // 如果没有locale或非法，使用默认值
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default,
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
}) 