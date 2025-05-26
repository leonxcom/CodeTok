"use client"

import { useParams } from "next/navigation"
import { Locale } from "../../../../i18n/config"
import { Briefcase, MapPin, Search, Filter, Clock, Building, DollarSign, Info, Brain, Lightbulb } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"

// 示例工作数据 - 全部替换为AI编程和Vibe Coding相关职位
const DEMO_JOBS = [
  {
    id: "1",
    title: "AI编程指导师",
    company: "CodeTok",
    logo: null,
    location: "远程",
    salary: "35k-65k",
    tags: ["AI", "LLM", "Vibe Coding", "Prompt Engineering"],
    description: "引导用户利用自然语言和AI进行编程，提供专业的Prompt优化建议，帮助用户实现从想法到代码的快速转化。作为CodeTok平台的核心角色，负责培训用户掌握最前沿的AI编程技巧。",
    postedTime: "刚刚",
    isVerified: true,
    isHot: true,
  },
  {
    id: "2",
    title: "Vibe Query Language专家",
    company: "字节跳动",
    logo: null,
    location: "北京 / 远程",
    salary: "40k-70k",
    tags: ["VQL", "Vibe Coding", "Rust", "AI"],
    description: "负责开发和优化基于Vibe Query Language的开发工具，提升AI辅助编程效率，打造下一代智能编程体验。参与VQL标准制定，设计更直观的AI编程接口。",
    postedTime: "1天前",
    isVerified: true,
    isHot: true,
  },
  {
    id: "3",
    title: "AI代码质量分析师",
    company: "阿里巴巴",
    logo: null,
    location: "杭州",
    salary: "30k-55k",
    tags: ["代码分析", "LLM", "质量保证", "AI"],
    description: "负责分析AI生成代码的质量、安全性和性能，开发智能检测工具识别潜在问题，提供优化建议，确保AI编程输出符合企业标准和最佳实践。",
    postedTime: "3天前",
    isVerified: true,
    isHot: false,
  },
  {
    id: "4",
    title: "AI代码转译专家",
    company: "腾讯",
    logo: null,
    location: "深圳",
    salary: "35k-60k",
    tags: ["代码转换", "多语言", "AI", "自然语言处理"],
    description: "专注于开发AI驱动的代码转换系统，能够将自然语言需求精准转化为高质量代码，同时支持不同编程语言间的智能转换，减少开发团队的技术壁垒。",
    postedTime: "1周前",
    isVerified: true,
    isHot: false,
  },
  {
    id: "5",
    title: "Vibe编程体验设计师",
    company: "网易",
    logo: null,
    location: "广州",
    salary: "28k-48k",
    tags: ["UX", "AI交互", "Vibe Coding", "产品设计"],
    description: "设计直观、高效的AI编程交互体验，使非技术背景用户也能轻松使用Vibe Coding进行创作。负责优化AI提示流程，降低学习门槛，提升编程效率和用户满意度。",
    postedTime: "5天前",
    isVerified: true,
    isHot: false,
  }
];

export default function JobsPage() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"
  const t = useTranslations("Jobs")

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "zh-cn" ? "AI编程工作机会" : "AI Programming Jobs"}
        </h1>
      </div>
      
      {/* Vibe Coding介绍 */}
      <div className="bg-primary/5 p-4 rounded-lg mb-6">
        <h2 className="font-medium mb-2 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          {locale === "zh-cn" ? "关于Vibe Coding" : "About Vibe Coding"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {locale === "zh-cn" 
            ? "Vibe Coding是由前OpenAI联合创始人Andrej Karpathy在2025年提出的编程方式，用户只需用自然语言描述需求，AI就能自动生成代码。这种方法让非专业程序员也能创建应用，彻底改变了软件开发方式。CodeTok是首批支持Vibe Coding的平台之一，为用户提供一站式AI编程体验。" 
            : "Vibe Coding, introduced by former OpenAI co-founder Andrej Karpathy in 2025, is a programming approach where users describe requirements in natural language, and AI generates the code. This method enables non-programmers to create applications, revolutionizing software development. CodeTok is among the first platforms to support Vibe Coding, offering a one-stop AI programming experience."}
        </p>
      </div>
      
      {/* 搜索栏 */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder={locale === "zh-cn" ? "搜索AI编程职位、公司或技能" : "Search AI programming jobs, companies, or skills"} 
              className="pl-10"
            />
          </div>
        </div>
        <Button className="flex gap-2">
          <Filter className="h-4 w-4" />
          <span>{t("filterBy")}</span>
        </Button>
      </div>
      
      {/* 工作类型筛选 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" size="sm" className="text-xs bg-primary/10">全部</Button>
        <Button variant="outline" size="sm" className="text-xs">Vibe Coding</Button>
        <Button variant="outline" size="sm" className="text-xs">AI代码生成</Button>
        <Button variant="outline" size="sm" className="text-xs">AI教育</Button>
        <Button variant="outline" size="sm" className="text-xs">研究与开发</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* 主要工作列表 */}
        <div>
          <div className="grid gap-4">
            {DEMO_JOBS.map((job) => (
              <Card key={job.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                    <span className="text-base font-semibold">{job.company.charAt(0)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{job.title}</h3>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium whitespace-nowrap">{job.salary}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1 flex-wrap">
                        {job.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{job.postedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 