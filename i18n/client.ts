// For client components
"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

import { Locale } from "@/config/i18n";

// Create a navigation function for switching locales
export function useLocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      return; // Skip if the selected language is the current one
    }

    try {
      // Build the new URL directly with locale prefix
      const segments = pathname.split("/");

      segments[1] = newLocale;
      const newPath = segments.join("/");

      // Use location change for reliable locale switching
      window.location.href = newPath;
    } catch {
      // Error handling, but not using console
    }
  };

  return { locale, handleLocaleChange };
}

// Re-export hooks from our typed hooks file
export { useTranslations, useLocale, useTimeZone } from "./hooks";
