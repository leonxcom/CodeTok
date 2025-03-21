"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextIntlClientProvider } from 'next-intl';
import { Locale } from '@/config/i18n';
import { Messages } from '@/i18n/types';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  messages: Messages;
  locale: Locale;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps, messages, locale }: ProvidersProps) {
  const router = useRouter();

  // 使用严格模式确保消息和区域设置已定义
  if (!messages || !locale) {
    console.error('Messages or locale not provided to Providers. Using fallback.');
  }

  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages}
      // 添加缓存控制，确保不会使用错误的缓存翻译
      timeZone="UTC"
      now={new Date()}
    >
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </NextIntlClientProvider>
  );
}
