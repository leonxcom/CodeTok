'use client';

import { useTranslations as useNextIntlTranslations } from 'next-intl';
import type { Messages } from './types';

/**
 * Type-safe wrapper for useTranslations hook
 * @param namespace - The namespace to get translations from
 * @returns A typed translation function
 */
export function useTranslations<T extends keyof Messages>(namespace: T) {
  return useNextIntlTranslations(namespace);
}

// Re-export other hooks for convenience
export { useLocale, useTimeZone } from 'next-intl'; 