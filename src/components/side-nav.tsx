"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
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
  Languages
} from "lucide-react"
import { useTheme } from "next-themes"

import { Locale } from "../../i18n/config"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover:bg-accent text-foreground"
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

  const navItems = [
    {
      href: `/${locale}`,
      icon: <HomeIcon className="h-5 w-5" />,
      label: locale === "zh-cn" ? "首页" : "Home"
    },
    {
      href: `/${locale}/discover`,
      icon: <Compass className="h-5 w-5" />,
      label: locale === "zh-cn" ? "发现作品" : "Discover"
    },
    {
      href: `/${locale}/activity`,
      icon: <Activity className="h-5 w-5" />,
      label: locale === "zh-cn" ? "创作者动态" : "Activity"
    },
    {
      href: `/${locale}/jobs`,
      icon: <Briefcase className="h-5 w-5" />,
      label: locale === "zh-cn" ? "工作机会" : "Jobs"
    },
    {
      href: `/${locale}/team`,
      icon: <Users className="h-5 w-5" />,
      label: locale === "zh-cn" ? "组队" : "Team"
    },
    {
      href: `/${locale}/courses`,
      icon: <GraduationCap className="h-5 w-5" />,
      label: locale === "zh-cn" ? "课程" : "Courses"
    },
    {
      href: `/${locale}/store`,
      icon: <ShoppingBag className="h-5 w-5" />,
      label: locale === "zh-cn" ? "商城" : "Store"
    }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground">
          <Menu className="h-5 w-5" />
          <span className="sr-only">导航</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="border-r bg-background text-foreground border-border"
      >
        <SheetHeader>
          <SheetTitle className="text-foreground">
            {locale === "zh-cn" ? "导航" : "Navigation"}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 py-4">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
        
        {/* 分割线 */}
        <div className="border-t my-4 border-border"></div>
        
        {/* 设置区域 */}
        <div className="px-4 mb-2">
          <h3 className="text-sm font-medium mb-2 text-foreground">
            {locale === "zh-cn" ? "主题: 跟随系统" : "Theme: Follow System"}
          </h3>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("system")}
              className="h-9 w-full flex items-center justify-center"
              data-state={theme === "system" ? "active" : "inactive"}
            >
              <span className="text-xs">{locale === "zh-cn" ? "系统" : "System"}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("light")}
              className="h-9 w-full flex items-center justify-center gap-1"
              data-state={theme === "light" ? "active" : "inactive"}
            >
              <Sun className="h-4 w-4" />
              <span className="text-xs">{locale === "zh-cn" ? "亮色" : "Light"}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme("dark")}
              className="h-9 w-full flex items-center justify-center gap-1"
              data-state={theme === "dark" ? "active" : "inactive"}
            >
              <Moon className="h-4 w-4" />
              <span className="text-xs">{locale === "zh-cn" ? "暗色" : "Dark"}</span>
            </Button>
          </div>
        </div>
        
        {/* 语言切换 */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            <span>{locale === "zh-cn" ? "语言切换" : "Language"}</span>
          </div>
          <LanguageToggle locale={locale} />
        </div>
      </SheetContent>
    </Sheet>
  )
} 