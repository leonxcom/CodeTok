import { defineRouting } from 'next-intl/routing';

// 定义支持的语言
export const locales = ['zh', 'zh-TW', 'en'] as const;
export type Locale = (typeof locales)[number];

// 语言名称映射
export const languageNames: Record<Locale, string> = {
  zh: '中文（简体）',
  'zh-TW': '中文（繁體）',
  en: 'English',
};

// 默认语言
export const defaultLocale = 'zh';

// 导出路由配置
export const routing = defineRouting({
  locales,
  defaultLocale,
  // 使用'always'策略，始终在URL中显示语言前缀，即使是默认语言
  // 如果设置为'as-needed'，则默认语言不会显示在URL中
  localePrefix: 'always',
}); 