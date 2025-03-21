import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '@/config/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined, fallback to defaultLocale
  const resolvedLocale = locale || defaultLocale;
  
  // Load messages for the current locale
  const messages = (await import(`../messages/${resolvedLocale}.json`)).default;
  
  return {
    messages,
    locale: resolvedLocale
  };
}); 