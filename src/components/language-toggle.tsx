'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

import { shadcn } from '@/lib/ui'
import { Icons } from '@/components/icons'
import { Locale, locales, languageNames } from '@/i18n/routing'

interface LanguageToggleProps {
  locale: Locale
}

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <shadcn.DropdownMenu.DropdownMenu>
      <shadcn.DropdownMenu.DropdownMenuTrigger>
        <div
          className={shadcn.Button.buttonVariants({
            size: 'icon',
            variant: 'ghost',
          })}
        >
          <Icons.Languages className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle language</span>
        </div>
      </shadcn.DropdownMenu.DropdownMenuTrigger>
      <shadcn.DropdownMenu.DropdownMenuContent>
        {locales.map((lang) => (
          <shadcn.DropdownMenu.DropdownMenuItem key={lang} onClick={() => switchLanguage(lang)}>
            {languageNames[lang]}
          </shadcn.DropdownMenu.DropdownMenuItem>
        ))}
      </shadcn.DropdownMenu.DropdownMenuContent>
    </shadcn.DropdownMenu.DropdownMenu>
  )
}
