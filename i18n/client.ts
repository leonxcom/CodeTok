// For client components
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

// Create a navigation function for switching locales
export function useLocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) {
      console.log(`Already using locale: ${locale}`);
      return; // Skip if the selected language is the current one
    }
    
    try {
      // Build the new URL directly with locale prefix
      const segments = pathname.split('/');
      segments[1] = newLocale;
      const newPath = segments.join('/');
      
      // Add a cache-busting parameter to force a complete reload
      const cacheBuster = `?t=${Date.now()}`;
      const finalUrl = newPath + cacheBuster;
      
      console.log(`Switching locale from ${locale} to ${newLocale} via hard refresh`);
      console.log(`Navigating to: ${finalUrl}`);
      
      // Use hard refresh with cache-busting to avoid any caching issues
      window.location.href = finalUrl;
    } catch (error) {
      console.error('Error changing locale:', error);
    }
  };

  return { locale, handleLocaleChange };
}

// Convenience hooks re-export
export { useTranslations, useLocale, useTimeZone } from 'next-intl';