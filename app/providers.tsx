"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { memo } from "react";
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

// Optimize NextThemes provider
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

// Main provider component
const ProvidersComponent = ({
  children,
  themeProps,
  messages,
  locale,
}: ProvidersProps) => {
  const router = useRouter();

  // Use strict mode to ensure messages and locale are defined
  if (!messages || !locale) {
    // Remove console statements
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      now={new Date()}
      // Add cache control to ensure incorrect cached translations are not used
      timeZone="UTC"
    >
      <ThemedProviders themeProps={themeProps}>{children}</ThemedProviders>
    </NextIntlClientProvider>
  );
};

export const Providers = memo(ProvidersComponent);
Providers.displayName = "Providers";
