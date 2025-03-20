import "@/styles/globals.css";
import { Metadata } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { notFound } from 'next/navigation';

import { Providers } from "../providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Navbar from "@/components/navbar";
import { defaultLocale } from "@/config/i18n";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

async function getMessages(locale: string) {
  try {
    // 首先尝试加载请求的语言
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    
    // 如果不是默认语言，尝试加载默认语言
    if (locale !== defaultLocale) {
      try {
        console.log(`Falling back to default locale ${defaultLocale}`);
        return (await import(`../../messages/${defaultLocale}.json`)).default;
      } catch (fallbackError) {
        console.error(`Error loading fallback messages:`, fallbackError);
        notFound(); // 如果连默认语言都加载失败，返回404
      }
    } else {
      notFound(); // 如果是默认语言加载失败，返回404
    }
  }
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout(props: Props) {
  // Wait for all async parameters using Promise.all
  const [params, children] = await Promise.all([
    Promise.resolve(props.params),
    Promise.resolve(props.children)
  ]);
  
  const locale = params.locale;
  const messages = await getMessages(locale);
  
  if (!messages) {
    notFound();
  }

  return (
    <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }} messages={messages} locale={locale}>
      <div className={clsx("relative flex flex-col h-screen", fontSans.variable)}>
        <Navbar />
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
          {children}
        </main>
        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://heroui.com?utm_source=next-app-template"
            title="heroui.com homepage"
          >
            <span className="text-default-600">{messages.common.poweredBy}</span>
            <p className="text-primary">HeroUI</p>
          </Link>
        </footer>
      </div>
    </Providers>
  );
} 