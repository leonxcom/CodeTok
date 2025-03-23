import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale parameter from request, corresponding to [locale] path parameter
  let locale = await requestLocale;

  // Ensure a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  try {
    // Dynamically import messages for the corresponding locale
    const messages = (await import(`../../messages/${locale}.json`)).default;
    
    return {
      locale,
      messages,
    };
  } catch (error) {
    // If language file is not found, return 404 page
    notFound();
    return { locale: routing.defaultLocale, messages: {} };
  }
}); 