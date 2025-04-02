'use client'

import * as React from 'react'
import { useRouter, usePathname } from '@/navigation'
import { t } from '@/utils/language-utils'

import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/icons'
import { Locale, locales, languageNames } from '../../i18n/config'

interface LanguageToggleProps {
  locale: Locale
}

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return
    router.replace(pathname, { locale: newLocale as Locale })
  }

  // 获取当前语言环境下的语言切换标签
  const languageSwitchLabel = t(locale, {
    zh: '切换语言',
    en: 'Switch language',
    fr: 'Changer de langue'
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={buttonVariants({
            size: 'icon',
            variant: 'ghost',
          })}
          title={languageSwitchLabel}
        >
          <Icons.Languages className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">{languageSwitchLabel}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((lang: Locale) => (
          <DropdownMenuItem 
            key={lang} 
            onClick={() => switchLanguage(lang)}
            className={lang === locale ? "bg-muted" : ""}
          >
            {languageNames[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}