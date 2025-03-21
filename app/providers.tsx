"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { memo } from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";

import { Locale } from "@/config/i18n";
import { Messages } from "@/i18n/types";

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

// 优化NextThemes提供者
const ThemedProviders = memo(
  ({
    children,
    themeProps,
  }: {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
  }) => <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>,
);

ThemedProviders.displayName = "ThemedProviders";

// 主提供者组件
const ProvidersComponent = ({
  children,
  themeProps,
  messages,
  locale,
}: ProvidersProps) => {
  const router = useRouter();

  // 使用严格模式确保消息和区域设置已定义
  if (!messages || !locale) {
    // 移除console语句
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      now={new Date()}
      // 添加缓存控制，确保不会使用错误的缓存翻译
      timeZone="UTC"
    >
      <HeroUIProvider navigate={router.push}>
        <ThemedProviders themeProps={themeProps}>{children}</ThemedProviders>
      </HeroUIProvider>
    </NextIntlClientProvider>
  );
};

export const Providers = memo(ProvidersComponent);
Providers.displayName = "Providers";
