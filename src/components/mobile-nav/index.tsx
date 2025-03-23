'use client'

import * as React from 'react'
import Link from 'next/link'

import { NavItem } from '@/types/nav'
import { getSiteConfig } from '@/config/site-i18n'
import { cn } from '@/lib/utils'
import { shadcn } from '@/lib/ui'
import { Icons } from '@/components/icons'
import { Locale } from '@/i18n/routing'

interface MobileNavProps {
  items?: NavItem[]
  locale: Locale
  authLabels?: {
    signin: string
    signup: string
  }
}

export function MobileNav({ items, locale, authLabels }: MobileNavProps) {
  const siteConfig = getSiteConfig(locale)
  const [isOpen, setIsOpen] = React.useState(false)

  const menuText = locale === 'zh' ? '打开菜单' : 'Open menu'
  // 默认的认证标签，以防没有传递
  const labels = authLabels || {
    signin: locale === 'zh' ? '登录' : locale === 'zh-TW' ? '登入' : 'Sign In',
    signup: locale === 'zh' ? '注册' : locale === 'zh-TW' ? '註冊' : 'Sign Up',
  }

  return (
    <div className="flex md:hidden">
      <shadcn.DropdownMenu.DropdownMenu>
        <shadcn.DropdownMenu.DropdownMenuTrigger asChild>
          <shadcn.Button.Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
          >
            <Icons.menu className="h-5 w-5" />
            <span className="sr-only">{menuText}</span>
          </shadcn.Button.Button>
        </shadcn.DropdownMenu.DropdownMenuTrigger>
        <shadcn.DropdownMenu.DropdownMenuContent
          align="end"
          className="w-[200px]"
        >
          {items?.map(
            (item, index) =>
              item.href && (
                <shadcn.DropdownMenu.DropdownMenuItem key={index} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex w-full items-center',
                      item.disabled && 'cursor-not-allowed opacity-80',
                    )}
                  >
                    {item.title}
                  </Link>
                </shadcn.DropdownMenu.DropdownMenuItem>
              ),
          )}
          <shadcn.DropdownMenu.DropdownMenuItem asChild>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center"
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </shadcn.DropdownMenu.DropdownMenuItem>

          <shadcn.DropdownMenu.DropdownMenuSeparator />

          <shadcn.DropdownMenu.DropdownMenuItem asChild>
            <Link href={`/${locale}/auth/signin`} className="flex items-center">
              <Icons.logIn className="mr-2 h-4 w-4" />
              {labels.signin}
            </Link>
          </shadcn.DropdownMenu.DropdownMenuItem>

          <shadcn.DropdownMenu.DropdownMenuItem asChild>
            <Link href={`/${locale}/auth/signup`} className="flex items-center">
              <Icons.userPlus className="mr-2 h-4 w-4" />
              {labels.signup}
            </Link>
          </shadcn.DropdownMenu.DropdownMenuItem>
        </shadcn.DropdownMenu.DropdownMenuContent>
      </shadcn.DropdownMenu.DropdownMenu>
    </div>
  )
}
