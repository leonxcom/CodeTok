"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import { 
  HomeIcon, 
  Menu, 
  Compass, 
  Activity, 
  Briefcase, 
  Users, 
  GraduationCap, 
  ShoppingBag,
  Moon,
  Sun,
  Languages,
  Search,
  Radio,
  UserIcon,
  MoreHorizontal
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from '@/navigation'
import { Locale } from "../../i18n/config"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { t } from '@/utils/language-utils'
import { cn } from "@/lib/utils"
import { LanguageToggle } from "@/components/language-toggle"

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onNavigate?: () => void;
}

function NavItem({ href, icon, label, onNavigate }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  
  return (
    <Button
      variant="ghost"
      asChild
      onClick={onNavigate}
      className={cn("justify-start pl-3 py-5 h-9", isActive && "bg-accent text-accent-foreground")}
    >
      <Link href={href} className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </Link>
    </Button>
  )
}

export function SideNav() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"
  const { setTheme, theme } = useTheme()
  const [open, setOpen] = React.useState(false)

  const handleNavigation = React.useCallback(() => {
    setOpen(false)
  }, [])

  const navItems = [
    {
      href: `/${locale}`,
      icon: <HomeIcon className="h-4 w-4" />,
      label: t(locale, { 
        zh: "为你推荐", 
        en: "For You",
        fr: "Pour Vous"
      })
    },
    {
      href: `/${locale}/discover`,
      icon: <Compass className="h-4 w-4" />,
      label: t(locale, { 
        zh: "发现作品", 
        en: "Discover",
        fr: "Découvrir"
      })
    },
    {
      href: `/${locale}/jobs`,
      icon: <Briefcase className="h-4 w-4" />,
      label: t(locale, { 
        zh: "工作机会", 
        en: "Jobs",
        fr: "Emplois"
      })
    },
    {
      href: `/${locale}/activity`,
      icon: <Activity className="h-4 w-4" />,
      label: t(locale, { 
        zh: "已关注", 
        en: "Following",
        fr: "Abonnements"
      })
    },
    {
      href: `/${locale}/live`,
      icon: <Radio className="h-4 w-4" />,
      label: t(locale, { 
        zh: "直播", 
        en: "LIVE",
        fr: "EN DIRECT"
      })
    },
    {
      href: `/${locale}/learn`,
      icon: <GraduationCap className="h-4 w-4" />,
      label: t(locale, { 
        zh: "学习", 
        en: "Learn",
        fr: "Apprendre"
      })
    },
    {
      href: `/${locale}/store`,
      icon: <ShoppingBag className="h-4 w-4" />,
      label: t(locale, { 
        zh: "商城", 
        en: "Store",
        fr: "Boutique"
      })
    },
    {
      href: `/${locale}/profile`,
      icon: <UserIcon className="h-4 w-4" />,
      label: t(locale, { 
        zh: "我的", 
        en: "Profile",
        fr: "Profil"
      })
    },
    {
      href: `/${locale}/more`,
      icon: <MoreHorizontal className="h-4 w-4" />,
      label: t(locale, { 
        zh: "更多", 
        en: "More",
        fr: "Plus"
      })
    }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t(locale, { zh: "导航", en: "Navigation", fr: "Navigation" })}</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="border-r bg-background text-foreground border-border w-64 flex flex-col"
      >
        <SheetTitle className="sr-only">
          {t(locale, {
            zh: "导航菜单",
            en: "Navigation Menu",
            fr: "Menu de Navigation"
          })}
        </SheetTitle>
        <SheetHeader className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-3">
            <Image 
              src="/favicon.png" 
              alt="CodeTok Logo" 
              width={28} 
              height={28} 
              className="rounded-sm"
            />
            <h1 className="text-lg font-bold text-foreground">
              CodeTok
              <span className="ml-1.5 text-[10px] px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md font-medium">
                Beta
              </span>
            </h1>
          </div>
          
          {/* 搜索框 */}
          <div className="w-full mb-3 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-2 h-3 w-3 text-muted-foreground" />
              <Input 
                placeholder={t(locale, { 
                  zh: "搜索", 
                  en: "Search",
                  fr: "Rechercher"
                })} 
                className="pl-7 w-full bg-accent h-8 text-sm"
              />
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col gap-1 py-2">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              icon={item.icon}
              label={item.label}
              onNavigate={handleNavigation}
            />
          ))}
        </div>
        
        {/* 填充空间 */}
        <div className="flex-grow"></div>
        
        {/* 分割线 */}
        <div className="border-t border-border mt-2"></div>
        
        {/* 设置区域 */}
        <div className="px-3 mt-2">
          <h3 className="text-xs font-medium mb-1.5 text-foreground">
            {t(locale, {
              zh: "主题: 跟随系统",
              en: "Theme: Follow System",
              fr: "Thème: Suivre le système"
            })}
          </h3>
          
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("system")}
              className="h-7 w-full flex items-center justify-center px-1"
              data-state={theme === "system" ? "active" : "inactive"}
            >
              <span className="text-[10px]">{t(locale, {
                zh: "系统",
                en: "System",
                fr: "Système"
              })}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("light")}
              className="h-7 w-full flex items-center justify-center gap-1 px-1"
              data-state={theme === "light" ? "active" : "inactive"}
            >
              <Sun className="h-3 w-3" />
              <span className="text-[10px]">{t(locale, {
                zh: "亮色",
                en: "Light",
                fr: "Clair"
              })}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("dark")}
              className="h-7 w-full flex items-center justify-center gap-1 px-1"
              data-state={theme === "dark" ? "active" : "inactive"}
            >
              <Moon className="h-3 w-3" />
              <span className="text-[10px]">{t(locale, {
                zh: "暗色",
                en: "Dark",
                fr: "Sombre"
              })}</span>
            </Button>
          </div>
        </div>
        
        {/* 语言切换 */}
        <div className="flex items-center justify-between py-1.5 px-3 mb-2">
          <div className="flex items-center gap-1.5">
            <Languages className="h-4 w-4" />
            <span className="text-sm">{t(locale, {
              zh: "语言切换",
              en: "Language",
              fr: "Langue"
            })}</span>
          </div>
          <LanguageToggle locale={locale} />
        </div>
      </SheetContent>
    </Sheet>
  )
}