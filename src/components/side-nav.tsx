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

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
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
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-5 w-5" />
          <span className="sr-only">导航</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-black text-white border-r border-gray-800">
        <SheetHeader>
          <SheetTitle className="text-white">{locale === "zh-cn" ? "导航" : "Navigation"}</SheetTitle>
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
        <div className="border-t border-gray-800 my-4"></div>
        
        {/* 设置区域 */}
        <div className="flex flex-col gap-2 px-4">
          <div className="flex items-center justify-between text-sm py-2">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span>{locale === "zh-cn" ? "主题切换" : "Theme"}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-8 w-8"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-sm py-2">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              <span>{locale === "zh-cn" ? "语言切换" : "Language"}</span>
            </div>
            <LanguageToggle locale={locale} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 