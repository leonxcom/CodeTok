import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Suspense } from "react";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { defaultLocale } from "@/config/i18n";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// Wrap loading state with Suspense
const BodyContent = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    {children}
  </Suspense>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang={defaultLocale}>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <BodyContent>{children}</BodyContent>
      </body>
    </html>
  );
}

export const dynamic = "force-static";
