"use client"

import { useParams } from "next/navigation"
import { Locale } from "../../../../i18n/config"
import { Users } from "lucide-react"

export default function CommunityPage() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "zh-cn" ? "社区" : "Community"}
        </h1>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-medium mb-4">
            {locale === "zh-cn" ? "编程社区" : "Programming Communities"}
          </h2>
          <p className="text-muted-foreground">
            {locale === "zh-cn" 
              ? "发现并加入各种编程社区，与志同道合的开发者交流" 
              : "Discover and join various programming communities to connect with like-minded developers"}
          </p>
        </div>
      </div>
    </div>
  )
} 