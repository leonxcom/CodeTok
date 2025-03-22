import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取请求中的语言参数，对应[locale]路径参数
  let locale = await requestLocale;

  // 确保使用有效的语言
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  try {
    // 动态导入对应语言的消息文件
    const messages = (await import(`../../messages/${locale}.json`)).default;
    
    return {
      locale,
      messages,
    };
  } catch (error) {
    // 如果找不到语言文件，返回404页面
    notFound();
    return { locale: routing.defaultLocale, messages: {} };
  }
}); 