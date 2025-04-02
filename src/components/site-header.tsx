"use client"

import Link from 'next/link'
import { useTheme } from "next-themes"
import { getSiteConfig } from '@/config/site-i18n'
import { Button } from '@/components/ui/button'
import { SideNav } from '@/components/side-nav'
import { Locale } from '../../i18n/config'
import { cn } from '@/lib/utils'
import { t } from '@/utils/language-utils'

interface SiteHeaderProps {
  locale: Locale
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const siteConfig = getSiteConfig(locale)
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-4">
          <SideNav />
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <img src="/favicon.png" alt="Logo" className="h-6 w-6" />
            <span className="font-bold hidden md:inline">CodeTok</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* 搜索框 */}
          </div>

          <Button asChild>
            <Link href={`/${locale}/auth`}>
              {t(locale, {
                zh: '登录/注册',
                en: 'Sign In/Up',
                fr: 'Connexion/Inscription'
              })}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}