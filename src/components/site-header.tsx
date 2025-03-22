import Link from 'next/link'

import { getSiteConfig } from '@/config/site-i18n'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import { MobileNav } from '@/components/mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { Locale } from '@/i18n/routing'
import { LanguageToggle } from './language-toggle'

interface SiteHeaderProps {
  locale: Locale
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const siteConfig = getSiteConfig(locale)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <MainNav items={siteConfig.mainNav} locale={locale} />
        <div className="flex items-center space-x-2">
          <nav className="hidden items-center space-x-1 md:flex">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
          </nav>
          <LanguageToggle locale={locale} />
          <ThemeToggle />
          <MobileNav items={siteConfig.mainNav} locale={locale} />
        </div>
      </div>
    </header>
  )
}
