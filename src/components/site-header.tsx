import Link from 'next/link'

import { getSiteConfig } from '@/config/site-i18n'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import { Locale } from '../../i18n/config'
import { LanguageToggle } from './language-toggle'

interface SiteHeaderProps {
  locale: Locale
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const siteConfig = getSiteConfig(locale)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-center">
        <MainNav items={siteConfig.mainNav} locale={locale} />
        <div className="absolute right-4 flex items-center space-x-1">
          <LanguageToggle locale={locale} />
        </div>
      </div>
    </header>
  )
}
