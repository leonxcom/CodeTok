import { Locale } from '../../i18n/config';

/**
 * 根据当前语言环境返回相应的文本
 * @param locale 当前语言环境
 * @param texts 包含不同语言文本的对象
 * @returns 对应语言的文本
 */
export function getLocalizedText(
  locale: Locale, 
  texts: { 
    zh: string;  // 简体中文文本
    en: string;  // 英文文本
    fr: string;  // 法语文本
  }
): string {
  switch (locale) {
    case 'zh-cn':
      return texts.zh;
    case 'fr':
      return texts.fr;
    case 'en':
    default:
      return texts.en;
  }
}

/**
 * 用于简化组件中的多语言文本条件渲染
 * 使用示例：t(locale, {
 *   zh: '简体中文',
 *   en: 'English',
 *   fr: 'Français'
 * })
 */
export const t = getLocalizedText; 