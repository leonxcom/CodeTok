"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Home, Compass, Briefcase, Users, Radio, BookOpen, ShoppingBag, User, MoreHorizontal, Play, Code, Layout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SiteHeader } from './site-header'
import { Button } from './ui/button'

interface MainLayoutProps {
  children: React.ReactNode
  locale: string
}

export function MainLayout({ children, locale }: MainLayoutProps) {
  const pathname = usePathname()
  const t = useTranslations('Navigation')
  
  const navigationItems = [
    {
      href: `/${locale}`,
      label: t('home'),
      icon: <Home className="h-6 w-6" />,
      highlight: true,
    },
    {
      href: `/${locale}/explore`,
      label: t('discover'),
      icon: <Compass className="h-6 w-6" />,
    },
    {
      href: `/${locale}/projects`,
      label: t('projects'),
      icon: <Code className="h-6 w-6" />,
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
    {
      href: `/${locale}/profile`,
      label: t('profile'),
      icon: <User className="h-6 w-6" />,
    },
    {
      href: `/${locale}/more`,
      label: t('more'),
      icon: <MoreHorizontal className="h-6 w-6" />,
    },
  ]
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* 抖音风格的固定侧边栏 */}
      <div className="flex w-24 flex-shrink-0 flex-col items-center border-r bg-background py-6">
        <Link href={`/${locale}`} className="mb-6 flex flex-col items-center justify-center">
          <Image src="/favicon.png" alt="CodeTok Logo" width={42} height={42} priority className="mb-1" />
        </Link>
        
        <div className="flex flex-col items-center justify-start space-y-7 flex-1 overflow-y-auto py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 rounded-lg p-2 transition-colors",
                pathname === item.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground",
                item.highlight && "relative"
              )}
            >
              <div className="relative">
                {item.icon}
                {item.highlight && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-20">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </div>
              <span className="text-xs mt-1.5 text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-auto">
        <SiteHeader locale={locale} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
} 