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
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onNavigate?: () => void;
}

function NavItem({ href, icon, label, onNavigate }: NavItemProps) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors hover:bg-accent text-foreground text-sm"
      onClick={onNavigate}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
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
      label: locale === "zh-cn" ? "为你推荐" : "For You"
    },
    {
      href: `/${locale}/discover`,
      icon: <Compass className="h-4 w-4" />,
      label: locale === "zh-cn" ? "发现作品" : "Discover"
    },
    {
      href: `/${locale}/jobs`,
      icon: <Briefcase className="h-4 w-4" />,
      label: locale === "zh-cn" ? "工作机会" : "Jobs"
    },
    {
      href: `/${locale}/activity`,
      icon: <Activity className="h-4 w-4" />,
      label: locale === "zh-cn" ? "已关注" : "Following"
    },
    {
      href: `/${locale}/live`,
      icon: <Radio className="h-4 w-4" />,
      label: locale === "zh-cn" ? "直播" : "LIVE"
    },
    {
      href: `/${locale}/learn`,
      icon: <GraduationCap className="h-4 w-4" />,
      label: locale === "zh-cn" ? "学习" : "Learn"
    },
    {
      href: `/${locale}/store`,
      icon: <ShoppingBag className="h-4 w-4" />,
      label: locale === "zh-cn" ? "商城" : "Store"
    },
    {
      href: `/${locale}/profile`,
      icon: <UserIcon className="h-4 w-4" />,
      label: locale === "zh-cn" ? "我的" : "Profile"
    },
    {
      href: `/${locale}/more`,
      icon: <MoreHorizontal className="h-4 w-4" />,
      label: locale === "zh-cn" ? "更多" : "More"
    }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground">
          <Menu className="h-5 w-5" />
          <span className="sr-only">导航</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="border-r bg-background text-foreground border-border w-64"
      >
        <SheetTitle className="sr-only">
          {locale === "zh-cn" ? "导航菜单" : "Navigation Menu"}
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
                placeholder={locale === "zh-cn" ? "搜索" : "Search"} 
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
        
        {/* 分割线 */}
        <div className="border-t my-2 border-border"></div>
        
        {/* 设置区域 */}
        <div className="px-3 mb-2">
          <h3 className="text-xs font-medium mb-1.5 text-foreground">
            {locale === "zh-cn" ? "主题: 跟随系统" : "Theme: Follow System"}
          </h3>
          
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("system")}
              className="h-7 w-full flex items-center justify-center px-1"
              data-state={theme === "system" ? "active" : "inactive"}
            >
              <span className="text-[10px]">{locale === "zh-cn" ? "系统" : "System"}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("light")}
              className="h-7 w-full flex items-center justify-center gap-1 px-1"
              data-state={theme === "light" ? "active" : "inactive"}
            >
              <Sun className="h-3 w-3" />
              <span className="text-[10px]">{locale === "zh-cn" ? "亮色" : "Light"}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("dark")}
              className="h-7 w-full flex items-center justify-center gap-1 px-1"
              data-state={theme === "dark" ? "active" : "inactive"}
            >
              <Moon className="h-3 w-3" />
              <span className="text-[10px]">{locale === "zh-cn" ? "暗色" : "Dark"}</span>
            </Button>
          </div>
        </div>
        
        {/* 语言切换 */}
        <div className="flex items-center justify-between py-1.5 px-3">
          <div className="flex items-center gap-1.5">
            <Languages className="h-4 w-4" />
            <span className="text-sm">{locale === "zh-cn" ? "语言切换" : "Language"}</span>
          </div>
          <LanguageToggle locale={locale} />
        </div>
      </SheetContent>
    </Sheet>
  )
} 