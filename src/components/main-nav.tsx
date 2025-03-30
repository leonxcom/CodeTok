import * as React from 'react'
import { Link } from '@/navigation'
import Image from 'next/image'

import { NavItem } from '@/types/nav'
import { getSiteConfig } from '@/config/site-i18n'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Locale } from '../../i18n/config'

interface MainNavProps {
  items?: NavItem[]
  locale: Locale
}

export function MainNav({ items, locale }: MainNavProps) {
  const siteConfig = getSiteConfig(locale)

  return (
    <div className="flex items-center justify-center">
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/favicon.png" 
          alt="VibeTok Logo" 
          width={36} 
          height={36} 
          className="rounded-sm"
        />
        <h1 className="text-2xl font-bold">
          {siteConfig.name}
        </h1>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
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
