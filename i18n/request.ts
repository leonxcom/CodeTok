import { getRequestConfig } from "next-intl/server";

import { getMessages } from "./server";

import { locales, defaultLocale, Locale } from "@/config/i18n";

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined, fallback to defaultLocale
  const resolvedLocale = (locale || defaultLocale) as Locale;

  // Validate locale
  if (!locales.includes(resolvedLocale)) {
    throw new Error(`Invalid locale: ${resolvedLocale}`);
  }

  // Load messages for the current locale
  const messages = await getMessages(resolvedLocale);

  return {
    messages,
    locale: resolvedLocale,
    // Add timeZone and now for consistent date handling
    timeZone: "UTC",
    now: new Date(),
  };
});
