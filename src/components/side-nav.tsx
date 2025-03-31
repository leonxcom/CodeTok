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
  theme?: string;
}

function NavItem({ href, icon, label, theme }: NavItemProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
        theme === "dark" 
          ? "hover:bg-gray-800" 
          : "hover:bg-gray-100 text-gray-900"
      )}
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
        <Button variant="ghost" size="icon" className={theme === "dark" ? "text-white" : "text-gray-900"}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">导航</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className={cn(
          "border-r", 
          theme === "dark" 
            ? "bg-black text-white border-gray-800" 
            : "bg-white text-gray-900 border-gray-200"
        )}
      >
        <SheetHeader>
          <SheetTitle className={theme === "dark" ? "text-white" : "text-gray-900"}>
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
              theme={theme}
            />
          ))}
        </div>
        
        {/* 分割线 */}
        <div className={cn(
          "border-t my-4",
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        )}></div>
        
        {/* 设置区域 */}
        <div className="flex flex-col gap-4 px-4">
          {/* 主题切换 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5 flex items-center justify-center">
                  <Moon className="h-4 w-4 absolute" style={{ clipPath: 'inset(0 50% 0 0)' }}/>
                  <Sun className="h-4 w-4 absolute" style={{ clipPath: 'inset(0 0 0 50%)' }}/>
                </div>
              )}
              <span>
                {locale === "zh-cn" 
                  ? `主题：${theme === "dark" ? "暗色" : theme === "light" ? "亮色" : "跟随系统"}` 
                  : `Theme: ${theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"}`}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("system")}
                className={cn(
                  "h-9 w-full flex items-center justify-center",
                  theme === "system" 
                    ? "bg-gray-700 text-white border-gray-600" 
                    : theme === "dark" 
                      ? "border-gray-700 hover:bg-gray-800" 
                      : "border-gray-300 hover:bg-gray-100"
                )}
              >
                <span className="text-xs">{locale === "zh-cn" ? "系统" : "System"}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("light")}
                className={cn(
                  "h-9 w-full flex items-center justify-center gap-1",
                  theme === "light" 
                    ? "bg-gray-200 text-gray-900 border-gray-300" 
                    : theme === "dark" 
                      ? "border-gray-700 hover:bg-gray-800" 
                      : "border-gray-300 hover:bg-gray-100"
                )}
              >
                <Sun className="h-4 w-4" />
                <span className="text-xs">{locale === "zh-cn" ? "亮色" : "Light"}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("dark")}
                className={cn(
                  "h-9 w-full flex items-center justify-center gap-1",
                  theme === "dark" 
                    ? "bg-gray-800 text-white border-gray-700" 
                    : "border-gray-300 hover:bg-gray-100"
                )}
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
        </div>
      </SheetContent>
    </Sheet>
  )
} 