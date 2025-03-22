'use client'

import * as React from 'react'
import Link from 'next/link'

import { NavItem } from '@/types/nav'
import { getSiteConfig } from '@/config/site-i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/icons'
import { Locale } from '@/i18n/routing'

interface MobileNavProps {
  items?: NavItem[]
  locale: Locale
}

export function MobileNav({ items, locale }: MobileNavProps) {
  const siteConfig = getSiteConfig(locale)
  const [isOpen, setIsOpen] = React.useState(false)

  const menuText = locale === 'zh' ? '打开菜单' : 'Open menu'

  return (
    <div className="flex md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <Icons.menu className="h-5 w-5" />
            <span className="sr-only">{menuText}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {items?.map(
            (item, index) =>
              item.href && (
                <DropdownMenuItem key={index} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex w-full items-center',
                      item.disabled && 'cursor-not-allowed opacity-80',
                    )}
                  >
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ),
          )}
          <DropdownMenuItem asChild>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center"
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
