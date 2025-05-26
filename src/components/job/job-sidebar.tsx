"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { BadgeCheck, MapPin, Zap } from "lucide-react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 定义Job类型
interface JobTag {
  name: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  salary: string;
  tags: string[];
  isVerified: boolean;
  isHot: boolean;
}

// 模拟的工作数据
const DEMO_JOBS: Job[] = [
  {
    id: "1",
    title: "资深前端工程师",
    company: "字节跳动",
    logo: "/images/companies/bytedance.png", // 需要添加这个图片
    location: "北京 / 远程",
    salary: "30k-60k",
    tags: ["React", "Next.js", "TypeScript"],
    isVerified: true,
    isHot: true,
  },
  {
    id: "2",
    title: "全栈开发工程师",
    company: "腾讯",
    logo: "/images/companies/tencent.png", // 需要添加这个图片
    location: "深圳",
    salary: "25k-45k",
    tags: ["JavaScript", "Node.js", "Vue"],
    isVerified: true,
    isHot: false,
  },
  {
    id: "3",
    title: "Python开发工程师",
    company: "阿里巴巴",
    logo: "/images/companies/alibaba.png", // 需要添加这个图片
    location: "杭州",
    salary: "20k-40k",
    tags: ["Python", "Django", "FastAPI"],
    isVerified: true,
    isHot: true,
  },
]

interface JobSidebarProps {
  standalone?: boolean;
  locale?: string;
}

export function JobSidebar({ standalone = false, locale }: JobSidebarProps) {
  const params = useParams();
  const currentLocale = locale || params?.locale as string || "zh-cn";
  const t = useTranslations("Jobs")
  const [viewAll, setViewAll] = useState(false)
  
  const displayJobs = viewAll ? DEMO_JOBS : DEMO_JOBS.slice(0, 2)
  
  return (
    <div className={standalone ? "w-full max-w-xs border-l" : "w-full"}>
      <div className="p-4">
        <div className="space-y-3">
          {displayJobs.map((job) => (
            <JobCard key={job.id} job={job} locale={currentLocale} />
          ))}
        </div>
        
        {!viewAll && DEMO_JOBS.length > 2 && (
          <Button 
            variant="ghost" 
            className="w-full mt-3 text-xs" 
            onClick={() => setViewAll(true)}
          >
            {t("showMore")}
          </Button>
        )}
      </div>
      
      {standalone && (
        <div className="p-4 border-t">
          <Link href={`/${currentLocale}/jobs/post`} className="block">
            <Button variant="outline" className="w-full">
              {t("postJob")}
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {t("reachDevelopers")}
          </p>
        </div>
      )}
    </div>
  )
}

interface JobCardProps {
  job: Job;
  locale: string;
}

function JobCard({ job, locale }: JobCardProps) {
  return (
    <Link href={`/${locale}/jobs/${job.id}`}>
      <Card className="p-3 hover:bg-accent transition-colors cursor-pointer">
        <div className="flex gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {job.logo ? (
              <Image
                src={job.logo}
                alt={job.company}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-xs font-semibold">{job.company.charAt(0)}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="font-medium text-sm truncate">{job.title}</h4>
              {job.isHot && (
                <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
              )}
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="truncate">{job.company}</span>
              {job.isVerified && (
                <BadgeCheck className="h-3 w-3 text-blue-500 ml-1" />
              )}
            </div>
            
            <div className="flex items-center mt-1">
              <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">{job.location}</span>
              <span className="text-xs font-medium ml-auto">{job.salary}</span>
            </div>
            
            <div className="flex gap-1 mt-2 flex-wrap">
              {job.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
} 