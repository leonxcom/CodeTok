import { defaultLocale, Locale } from '@/config/i18n';
import { Messages, isMessages } from './types';

/**
 * Load messages for a specific locale
 * @param locale - The locale to load messages for
 * @returns The messages object for the locale
 */
export async function getMessages(locale: Locale): Promise<Messages> {
  try {
    // First try to load the requested locale
    const messages = (await import(`../messages/${locale}.json`)).default;
    
    // Validate messages structure
    if (!isMessages(messages)) {
      throw new Error(`Invalid messages structure for locale ${locale}`);
    }
    
    return messages;
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    
    // If not default locale, try to load default locale
    if (locale !== defaultLocale) {
      try {
        console.log(`Falling back to default locale ${defaultLocale}`);
        const fallbackMessages = (await import(`../messages/${defaultLocale}.json`)).default;
        
        // Validate fallback messages structure
        if (!isMessages(fallbackMessages)) {
          throw new Error(`Invalid messages structure for fallback locale ${defaultLocale}`);
        }
        
        return fallbackMessages;
      } catch (fallbackError) {
        console.error(`Error loading fallback messages:`, fallbackError);
        throw new Error(`Failed to load messages for locale ${locale} and fallback locale ${defaultLocale}`);
      }
    }
    
    throw error;
  }
}

// Re-export getRequestConfig for convenience
export { getRequestConfig } from 'next-intl/server'; 