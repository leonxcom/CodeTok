import { Messages, isMessages } from "./types";

import { defaultLocale, Locale } from "@/config/i18n";

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
    // 错误处理，但不使用console

    // If not default locale, try to load default locale
    if (locale !== defaultLocale) {
      try {
        // 尝试加载默认语言，但不使用console
        const fallbackMessages = (
          await import(`../messages/${defaultLocale}.json`)
        ).default;

        // Validate fallback messages structure
        if (!isMessages(fallbackMessages)) {
          throw new Error(
            `Invalid messages structure for fallback locale ${defaultLocale}`,
          );
        }

        return fallbackMessages;
      } catch {
        // 错误处理，但不使用console
        throw new Error(
          `Failed to load messages for locale ${locale} and fallback locale ${defaultLocale}`,
        );
      }
    }

    throw error;
  }
}

/**
 * Get a translation function for a specific locale and namespace
 * @param locale - The locale to get translations for
 * @param namespace - The namespace to get translations from
 * @returns A function that returns the translation for a key
 */
export async function getTranslations(
  locale: Locale,
  namespace: keyof Messages,
) {
  const messages = await getMessages(locale);

  return function t(key: string): string {
    const parts = key.split(".");
    let value: any = messages[namespace];

    for (const part of parts) {
      if (value === undefined) {
        return key;
      }
      value = value[part];
    }

    return value !== undefined ? value : key;
  };
}

// Re-export getRequestConfig for convenience
export { getRequestConfig } from "next-intl/server";
