"use client"

import { useParams } from "next/navigation"
import { Locale } from "../../../../i18n/config"
import { Activity } from "lucide-react"

export default function ActivityPage() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "zh-cn" ? "已关注" : "Following"}
        </h1>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-medium mb-4">
            {locale === "zh-cn" ? "关注创作者动态" : "Follow Creator Updates"}
          </h2>
          <p className="text-muted-foreground">
            {locale === "zh-cn" 
              ? "这里将显示您关注的创作者最新动态，敬请期待！" 
              : "Here you'll see updates from creators you follow. Stay tuned!"}
          </p>
        </div>
      </div>
    </div>
  )
} 
 