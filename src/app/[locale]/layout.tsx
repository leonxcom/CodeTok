import '@/styles/globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { MainLayout } from '@/components/layouts'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  
  try {
    const t = await getTranslations({ locale, namespace: 'Metadata' })
    
    return {
      title: {
        default: t('title'),
        template: `%s | ${t('title')}`,
      },
      description: t('description'),
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
      },
    }
  } catch (error) {
    console.error('Failed to get metadata translations:', error)
    return {
      title: 'CodeTok - 代码分享平台',
      description: '发现、分享和讨论代码片段和项目',
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
      },
    }
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  const isValidLocale = routing.locales.includes(locale as any)
  
  if (!isValidLocale) {
    notFound()
  }
  
  let messages = {}
  try {
    messages = await getMessages({ locale })
  } catch (error) {
    console.error(`Failed to load messages for ${locale}:`, error)
    messages = {
      Navigation: {
        home: '首页',
        explore: '探索',
        upload: '上传',
        signIn: '登录',
        signUp: '注册',
        profile: '个人资料',
        settings: '设置',
        logout: '退出',
        for_you: '为你推荐',
        discover: '发现',
        jobs: '工作机会',
        following: '关注',
        live: '直播',
        learn: '学习',
        store: '商店',
        more: '更多'
      },
      Metadata: {
        title: 'CodeTok - 代码分享平台',
        description: '发现、分享和讨论代码片段和项目'
      }
    }
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <MainLayout locale={locale}>
              {children}
            </MainLayout>
            <TailwindIndicator />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
