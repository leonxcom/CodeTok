"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Home, Compass, Briefcase, Users, Radio, BookOpen, ShoppingBag, User, MoreHorizontal, Languages, Laptop, Sun, Moon, ChevronDown, LogIn, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

// 语言选项
const LANGUAGES = {
  'zh-cn': '简体中文',
  'en': 'English',
  'fr': 'français'
}

export function SideNav() {
  const pathname = usePathname()
  const t = useTranslations('Navigation')
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  
  // 从路径中提取语言前缀
  const locale = pathname.split('/')[1]
  
  const [mounted, setMounted] = React.useState(false)

  // 组件挂载后再访问theme，避免水合错误
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // 处理语言切换
  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }
  
  const navigationItems = [
    {
      href: `/${locale}`,
      label: t('for_you'),
      icon: <Home className="h-6 w-6" />,
    },
    {
      href: `/${locale}/explore`,
      label: t('discover'),
      icon: <Compass className="h-6 w-6" />,
    },
    {
      href: `/${locale}/jobs`,
      label: t('jobs'),
      icon: <Briefcase className="h-6 w-6" />,
    },
    {
      href: `/${locale}/following`,
      label: t('following'),
      icon: <Users className="h-6 w-6" />,
    },
    {
      href: `/${locale}/live`,
      label: t('live'),
      icon: <Radio className="h-6 w-6" />,
    },
    {
      href: `/${locale}/learn`,
      label: t('learn'),
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      href: `/${locale}/store`,
      label: t('store'),
      icon: <ShoppingBag className="h-6 w-6" />,
    },
  ]
  
  const accountItems = [
    {
      href: `/${locale}/auth/login`,
      label: t('login'),
      icon: <LogIn className="h-6 w-6" />,
    },
    {
      href: `/${locale}/settings`,
      label: t('settings'),
      icon: <Settings className="h-6 w-6" />,
    },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-full max-w-[280px] flex flex-col md:hidden">
        <div className="flex items-center justify-center border-b p-4">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image src="/favicon.png" alt="CodeTok Logo" width={32} height={32} />
          </Link>
        </div>
        
        <div className="p-4 border-b">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary">游客</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Link href={`/${locale}/auth/login`} className="font-medium text-base hover:underline">
                登录/注册
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                登录后即可使用更多功能
              </p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid gap-1">
              {navigationItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 rounded-md px-3 py-2.5 hover:bg-muted transition-colors",
                      pathname === item.href 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="text-base">{item.label}</span>
                  </Link>
                </SheetClose>
              ))}
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid gap-1">
              {accountItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 rounded-md px-3 py-2.5 hover:bg-muted transition-colors",
                      pathname === item.href 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="text-base">{item.label}</span>
                  </Link>
                </SheetClose>
              ))}
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <div className="px-3 mb-3 text-muted-foreground font-medium">主题和语言</div>
              
              <div className="mb-4">
                <p className="text-sm px-3 mb-2">主题设置</p>
                <div className="flex gap-2">
                  <Button 
                    variant={mounted && theme === "system" ? "default" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setTheme("system")}
                  >
                    系统
                  </Button>
                  <Button 
                    variant={mounted && theme === "light" ? "default" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setTheme("light")}
                  >
                    亮色
                  </Button>
                  <Button 
                    variant={mounted && theme === "dark" ? "default" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setTheme("dark")}
                  >
                    暗色
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm px-3 mb-2">语言选择</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        <span>{LANGUAGES[locale as keyof typeof LANGUAGES] || '选择语言'}</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-full">
                    {Object.entries(LANGUAGES).map(([code, name]) => (
                      <DropdownMenuItem 
                        key={code}
                        className={cn(
                          "cursor-pointer",
                          code === locale && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => handleLanguageChange(code)}
                      >
                        <span>{name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="p-3 border-t text-center text-xs text-muted-foreground">
          <p>CodeTok © 2023-2024</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}