// Import locale definitions from routing
import { locales, defaultLocale } from '@/i18n/routing'

/**
 * i18n configuration
 */
export const i18n = {
  defaultLocale,
  locales,
  // This is the list of languages that are supported by the app
  // The language names are used in the language switcher
  localeMeta: {
    en: {
      name: 'English',
      direction: 'ltr',
    },
    zh: {
      name: '中文（简体）',
      direction: 'ltr',
    },
    'zh-TW': {
      name: '中文（繁體）',
      direction: 'ltr',
    },
  },
}
