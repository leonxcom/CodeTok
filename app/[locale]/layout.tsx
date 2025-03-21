import "@/styles/globals.css";
import { Metadata } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { notFound } from "next/navigation";
import React, { Suspense, lazy } from "react";

import { getMessages } from "@/i18n/server";
import { Providers } from "@/app/providers";
import { fontSans } from "@/config/fonts";
import { locales, Locale } from "@/config/i18n";
import Navbar from "@/components/navbar";

// 懒加载分析组件
const GoogleAnalytics = lazy(
  () => import("@/components/analytics/google-analytics"),
);
const VercelAnalytics = lazy(
  () => import("@/components/analytics/vercel-analytics"),
);

interface Props {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const validLocale = locale as Locale;

  // Validate locale
  if (!locales.includes(validLocale)) {
    notFound();
  }

  // Get messages for metadata
  const messages = await getMessages(validLocale);

  return {
    description: messages.app.description,
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function LocaleLayout(props: Props) {
  const { locale } = await props.params;
  const validLocale = locale as Locale;

  // Validate locale
  if (!locales.includes(validLocale)) {
    notFound();
  }

  // Get messages for the layout
  const messages = await getMessages(validLocale);

  if (!messages) {
    notFound();
  }

  return (
    <Providers
      locale={validLocale}
      messages={messages}
      themeProps={{ attribute: "class", defaultTheme: "dark" }}
    >
      <div
        className={clsx("relative flex flex-col h-screen", fontSans.variable)}
      >
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Suspense fallback={null}>
          <VercelAnalytics />
        </Suspense>
        <Navbar />
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
          {props.children}
        </main>
        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://heroui.com?utm_source=next-app-template"
            title="heroui.com homepage"
          >
            <span className="text-default-600">
              {messages.common.poweredBy}
            </span>
            <p className="text-primary">HeroUI</p>
          </Link>
        </footer>
      </div>
    </Providers>
  );
}
