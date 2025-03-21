export const locales = ['zh-CN', 'zh-TW', 'en', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh-CN';

export const localeNames: Record<Locale, string> = {
  'zh-CN': '中文（简体）',
  'zh-TW': '中文（繁体）',
  'en': 'English',
  'hi': 'हिन्दी',
  'es': 'Español',
  'ar': 'العربية',
  'fr': 'Français',
  'bn': 'বাংলা',
  'pt': 'Português',
  'ru': 'Русский',
};