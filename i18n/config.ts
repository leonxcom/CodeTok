export const locales = ['en', 'zh-cn', 'fr']
export const languageNames: Record<Locale, string> = {
  en: 'English',
  'zh-cn': '简体中文',
  fr: 'français'
}

export type Locale = (typeof locales)[number]
export const defaultLocale = 'en'
export const localePrefix = 'always' 