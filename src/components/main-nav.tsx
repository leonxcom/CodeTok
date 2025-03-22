import * as React from 'react'
import Link from 'next/link'

import { NavItem } from '@/types/nav'
import { getSiteConfig } from '@/config/site-i18n'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Locale } from '@/i18n/routing'

interface MainNavProps {
  items?: NavItem[]
  locale: Locale
}

export function MainNav({ items, locale }: MainNavProps) {
  const siteConfig = getSiteConfig(locale)

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href={`/${locale}`} className="flex items-center space-x-2">
        <h1 className="max-w-[66vw] truncate text-lg font-bold normal-case sm:max-w-full sm:text-3xl">
          {siteConfig.name}
        </h1>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'flex items-center text-sm font-medium text-muted-foreground',
                    item.disabled && 'cursor-not-allowed opacity-80',
                  )}
                >
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  )
}
