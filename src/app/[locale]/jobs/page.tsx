"use client"

import { useParams } from "next/navigation"
import { Locale } from "../../../../i18n/config"
import { Briefcase } from "lucide-react"

export default function JobsPage() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "zh-cn" ? "工作机会" : "Jobs"}
        </h1>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-medium mb-4">
            {locale === "zh-cn" ? "发现编程工作机会" : "Find Programming Jobs"}
          </h2>
          <p className="text-muted-foreground">
            {locale === "zh-cn" 
              ? "这里将展示优质的编程相关工作机会，敬请期待！" 
              : "Here we'll showcase high-quality programming job opportunities. Stay tuned!"}
          </p>
        </div>
      </div>
    </div>
  )
} 