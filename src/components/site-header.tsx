"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from "next-themes"
import { useTranslations } from 'next-intl'
import { Plus, User, LogOut } from "lucide-react"
import { Button } from '@/components/ui/button'
import { SideNav } from '@/components/side-nav'
import { Locale } from '../../i18n/config'
import { cn } from '@/lib/utils'
import { routing } from '@/i18n/routing'
import { useSession, signOut } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type LocaleType = (typeof routing.locales)[number]

interface SiteHeaderProps {
  locale: LocaleType
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const t = useTranslations('Navigation')
  const { data: session, isPending, error } = useSession()
  
  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.reload()
    } catch (error) {
      console.error('登出失败:', error)
    }
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 移动端汉堡菜单 */}
          <SideNav />
        </div>

        <div className="flex items-center gap-3">
          {/* 上传按钮 */}
          <Button asChild size="sm" variant="outline" className="gap-1.5 items-center px-4 py-2">
            <Link href={`/${locale}/upload`}>
              <Plus className="h-5 w-5" />
              <span>上传</span>
            </Link>
          </Button>
          
          {/* 根据登录状态显示不同的按钮 */}
          {isPending ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          ) : session?.user ? (
            /* 已登录用户菜单 */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                    <AvatarFallback>
                      {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/profile`} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>个人资料</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* 未登录用户按钮 */
            <Button asChild size="sm" className="px-4 py-2">
              <Link href={`/${locale}/auth`}>
                登录/注册
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}