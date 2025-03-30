import Link from 'next/link'

import { getSiteConfig } from '@/config/site-i18n'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import { Locale } from '../../i18n/config'
import { LanguageToggle } from './language-toggle'
import { Button } from './ui/button'

interface SiteHeaderProps {
  locale: Locale
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const siteConfig = getSiteConfig(locale)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black">
      <div className="container flex h-16 items-center justify-center">
        <MainNav items={siteConfig.mainNav} locale={locale} />
        <div className="absolute right-4 flex items-center space-x-1">
          {/* 暂时隐藏多语言切换图标 */}
          {/* <LanguageToggle locale={locale} /> */}
          <Link 
            href={`/${locale}/upload`} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {locale === 'zh-cn' ? '上传' : 'Upload'}
          </Link>
        </div>
      </div>
    </header>
  )
}
