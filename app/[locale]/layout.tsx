import "@/styles/globals.css";
import { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { notFound } from "next/navigation";
import React, { Suspense, lazy } from "react";

import { getMessages } from "@/i18n/server";
import { Providers } from "@/app/providers";
import { fontSans } from "@/config/fonts";
import { locales, Locale } from "@/config/i18n";
import { Navbar } from "@/components/ui/navbar";

// Lazy load analytics components
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

  // Get current year
  const currentYear = new Date().getFullYear();
  // Build copyright text
  const copyrightText = messages.app.footer.rights.replace(
    "YEAR",
    currentYear.toString(),
  );

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
        <footer className="w-full bg-default-900/20 border-t border-default-200/50 py-12 mt-20">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Company information */}
              <div>
                <h3 className="text-lg font-bold mb-4">
                  {messages.app.footer.company}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/about`}
                    >
                      {messages.app.footer.aboutUs}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/careers`}
                    >
                      {messages.app.footer.careers}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/blog`}
                    >
                      {messages.app.footer.blog}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/press`}
                    >
                      {messages.app.footer.press}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-lg font-bold mb-4">
                  {messages.app.footer.resources}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/docs`}
                    >
                      {messages.app.footer.documentation}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/tutorials`}
                    >
                      {messages.app.footer.tutorials}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/community`}
                    >
                      {messages.app.footer.community}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/events`}
                    >
                      {messages.app.footer.events}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-lg font-bold mb-4">
                  {messages.app.footer.legal}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/terms`}
                    >
                      {messages.app.footer.terms}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/privacy`}
                    >
                      {messages.app.footer.privacy}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-default-500 hover:text-primary transition-colors"
                      href={`/${locale}/copyright`}
                    >
                      {messages.app.footer.copyright}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact us */}
              <div>
                <h3 className="text-lg font-bold mb-4">
                  {messages.app.footer.contact}
                </h3>
                <div className="flex space-x-4 mb-4">
                  <Link
                    className="text-default-500 hover:text-primary transition-colors"
                    href="https://twitter.com/nostudy_ai"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </Link>
                  <Link
                    className="text-default-500 hover:text-primary transition-colors"
                    href="https://github.com/nostudy-ai"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </Link>
                  <Link
                    className="text-default-500 hover:text-primary transition-colors"
                    href="https://linkedin.com/company/nostudy-ai"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect height="12" width="4" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </Link>
                </div>
                <Link
                  className="text-default-500 hover:text-primary transition-colors"
                  href="mailto:contact@nostudy.ai"
                >
                  contact@nostudy.ai
                </Link>
              </div>
            </div>

            <div className="border-t border-default-200/50 mt-10 pt-6 text-center text-default-500">
              <p>{copyrightText}</p>
            </div>
          </div>
        </footer>
      </div>
    </Providers>
  );
}
