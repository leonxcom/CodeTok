import { defineRouting } from 'next-intl/routing';

// Define supported languages
export const locales = ['zh', 'zh-TW', 'en'] as const;
export type Locale = (typeof locales)[number];

// Language name mapping
export const languageNames: Record<Locale, string> = {
  zh: '中文（简体）',
  'zh-TW': '中文（繁體）',
  en: 'English',
};

// Default language
export const defaultLocale = 'zh';

// Export routing configuration
export const routing = defineRouting({
  locales,
  defaultLocale,
  // Use 'as-needed' strategy, which only shows language prefix in URL for non-default languages
  // Default language (zh) will not show prefix in URL
  localePrefix: 'as-needed',
}); 