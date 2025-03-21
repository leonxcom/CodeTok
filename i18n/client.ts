// For client components
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/config/i18n';

// Create a navigation function for switching locales
export function useLocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      console.log(`Already using locale: ${locale}`);
      return; // Skip if the selected language is the current one
    }
    
    try {
      // Build the new URL directly with locale prefix
      const segments = pathname.split('/');
      segments[1] = newLocale;
      const newPath = segments.join('/');
      
      console.log(`Switching locale from ${locale} to ${newLocale}`);
      console.log(`Navigating to: ${newPath}`);
      
      // Use location change for reliable locale switching
      window.location.href = newPath;
    } catch (error) {
      console.error('Error changing locale:', error);
    }
  };

  return { locale, handleLocaleChange };
}

// Re-export hooks from our typed hooks file
export { useTranslations, useLocale, useTimeZone } from './hooks';