"use client"

import { useParams, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Locale } from "../../../../i18n/config"
import { 
  Settings, 
  Globe, 
  Palette, 
  User, 
  Bell,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Languages,
  UserCog,
  Key,
  Eye,
  Download,
  Share2,
  Heart,
  Star,
  Bug,
  Coffee,
  Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function MorePage() {
  const params = useParams()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const locale = params.locale as Locale || "zh-cn"

  useEffect(() => {
    setMounted(true)
  }, [])

  // 用户信息
  const userInfo = {
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "",
    level: "高级用户",
    joinDate: "2023年6月"
  }

  // 语言选项
  const languages = [
    { code: "zh-cn", name: "简体中文", flag: "🇨🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" }
  ]

  // 主题选项
  const themes = [
    { value: "light", name: locale === "zh-cn" ? "浅色模式" : "Light Mode", icon: Sun },
    { value: "dark", name: locale === "zh-cn" ? "深色模式" : "Dark Mode", icon: Moon },
    { value: "system", name: locale === "zh-cn" ? "跟随系统" : "System", icon: Monitor }
  ]

  // 切换语言
  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  // 设置项组
  const settingGroups = [
    {
      title: locale === "zh-cn" ? "个人设置" : "Personal Settings",
      items: [
        {
          icon: User,
          title: locale === "zh-cn" ? "编辑个人资料" : "Edit Profile",
          description: locale === "zh-cn" ? "更新你的个人信息和头像" : "Update your personal info and avatar",
          action: () => router.push(`/${locale}/profile`)
        },
        {
          icon: Bell,
          title: locale === "zh-cn" ? "通知设置" : "Notifications",
          description: locale === "zh-cn" ? "管理通知和消息偏好" : "Manage notification and message preferences",
          action: () => {},
          hasSwitch: true,
          defaultValue: true
        },
        {
          icon: Shield,
          title: locale === "zh-cn" ? "隐私与安全" : "Privacy & Security",
          description: locale === "zh-cn" ? "控制你的隐私设置" : "Control your privacy settings",
          action: () => {}
        },
        {
          icon: Key,
          title: locale === "zh-cn" ? "账户设置" : "Account Settings",
          description: locale === "zh-cn" ? "密码、邮箱和账户安全" : "Password, email and account security",
          action: () => {}
        }
      ]
    },
    {
      title: locale === "zh-cn" ? "应用设置" : "App Settings",
      items: [
        {
          icon: Download,
          title: locale === "zh-cn" ? "数据导出" : "Data Export",
          description: locale === "zh-cn" ? "下载你的项目和数据" : "Download your projects and data",
          action: () => {}
        },
        {
          icon: Eye,
          title: locale === "zh-cn" ? "隐私模式" : "Privacy Mode",
          description: locale === "zh-cn" ? "隐藏个人活动状态" : "Hide personal activity status",
          action: () => {},
          hasSwitch: true,
          defaultValue: false
        }
      ]
    },
    {
      title: locale === "zh-cn" ? "支持与反馈" : "Support & Feedback",
      items: [
        {
          icon: HelpCircle,
          title: locale === "zh-cn" ? "帮助中心" : "Help Center",
          description: locale === "zh-cn" ? "查看常见问题和教程" : "View FAQs and tutorials",
          action: () => window.open('https://help.codetok.com', '_blank')
        },
        {
          icon: Bug,
          title: locale === "zh-cn" ? "报告问题" : "Report Bug",
          description: locale === "zh-cn" ? "报告bug或提出改进建议" : "Report bugs or suggest improvements",
          action: () => {}
        },
        {
          icon: Star,
          title: locale === "zh-cn" ? "给我们评分" : "Rate Us",
          description: locale === "zh-cn" ? "在应用商店给我们评分" : "Rate us on the app store",
          action: () => {}
        },
        {
          icon: Coffee,
          title: locale === "zh-cn" ? "请开发者喝咖啡" : "Buy Dev a Coffee",
          description: locale === "zh-cn" ? "支持CodeTok的持续发展" : "Support CodeTok's continuous development",
          action: () => {}
        }
      ]
    },
    {
      title: locale === "zh-cn" ? "关于" : "About",
      items: [
        {
          icon: Info,
          title: locale === "zh-cn" ? "关于CodeTok" : "About CodeTok",
          description: locale === "zh-cn" ? "版本信息和开发团队" : "Version info and development team",
          action: () => {}
        },
        {
          icon: Share2,
          title: locale === "zh-cn" ? "分享应用" : "Share App",
          description: locale === "zh-cn" ? "推荐给朋友和同事" : "Recommend to friends and colleagues",
          action: () => {}
        }
      ]
    }
  ]

  if (!mounted) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="h-6 w-6 text-gray-600" />
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "zh-cn" ? "更多" : "More"}
        </h1>
      </div>

      {/* 用户信息卡片 */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userInfo.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xl">
                {userInfo.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{userInfo.name}</h2>
              <p className="text-muted-foreground">{userInfo.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">{userInfo.level}</Badge>
                <span className="text-sm text-muted-foreground">
                  {locale === "zh-cn" ? "加入于" : "Joined"} {userInfo.joinDate}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push(`/${locale}/profile`)}>
              <UserCog className="h-4 w-4 mr-2" />
              {locale === "zh-cn" ? "编辑" : "Edit"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 快速设置 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {locale === "zh-cn" ? "快速设置" : "Quick Settings"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 语言设置 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">{locale === "zh-cn" ? "语言" : "Language"}</h3>
                <p className="text-sm text-muted-foreground">
                  {locale === "zh-cn" ? "选择界面语言" : "Choose interface language"}
                </p>
              </div>
            </div>
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{languages.find(l => l.code === locale)?.flag}</span>
                    <span>{languages.find(l => l.code === locale)?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex items-center gap-2">
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* 主题设置 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">{locale === "zh-cn" ? "主题" : "Theme"}</h3>
                <p className="text-sm text-muted-foreground">
                  {locale === "zh-cn" ? "选择外观模式" : "Choose appearance mode"}
                </p>
              </div>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-40">
                                 <SelectValue>
                   {theme && (() => {
                     const currentTheme = themes.find(t => t.value === theme);
                     if (currentTheme) {
                       const IconComponent = currentTheme.icon;
                       return (
                         <div className="flex items-center gap-2">
                           <IconComponent className="h-4 w-4" />
                           <span>{currentTheme.name}</span>
                         </div>
                       );
                     }
                     return null;
                   })()}
                 </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {themes.map((themeOption) => (
                  <SelectItem key={themeOption.value} value={themeOption.value}>
                    <div className="flex items-center gap-2">
                      <themeOption.icon className="h-4 w-4" />
                      <span>{themeOption.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 设置分组 */}
      <div className="space-y-6">
        {settingGroups.map((group, groupIndex) => (
          <Card key={groupIndex}>
            <CardHeader>
              <CardTitle className="text-lg">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={!item.hasSwitch ? item.action : undefined}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {item.hasSwitch ? (
                        <Switch defaultChecked={item.defaultValue} />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 退出登录 */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              // 这里添加退出登录逻辑
              console.log('退出登录')
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {locale === "zh-cn" ? "退出登录" : "Sign Out"}
          </Button>
        </CardContent>
      </Card>

      {/* 版本信息 */}
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>CodeTok v1.2.0</p>
        <p>{locale === "zh-cn" ? "让代码创作更简单" : "Making code creation easier"}</p>
      </div>
    </div>
  )
} 