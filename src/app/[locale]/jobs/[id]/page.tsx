"use client"

import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { useTranslations } from "next-intl"
import { Briefcase, MapPin, BadgeCheck, Zap, Calendar, Clock, DollarSign, FileText, Gift, Building, Brain, Cpu, Code, Shield, Lightbulb } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Locale } from "../../../../../i18n/config"
import { Card } from "@/components/ui/card"

// 模拟的工作数据 - 全部替换为AI编程和Vibe Coding相关职位
const DEMO_JOBS = [
  {
    id: "1",
    title: "AI编程指导师",
    company: "CodeTok",
    logo: "/images/companies/bytedance.png",
    location: "远程",
    salary: "35k-65k",
    tags: ["AI", "LLM", "Vibe Coding", "Prompt Engineering"],
    description: "引导用户利用自然语言和AI进行编程，提供专业的Prompt优化建议，帮助用户实现从想法到代码的快速转化。作为CodeTok平台的核心角色，负责培训用户掌握最前沿的AI编程技巧。",
    requirements: "1. 熟悉主流LLM的功能和限制，如Claude和GPT系列\n2. 具备优秀的提示工程(Prompt Engineering)能力\n3. 了解常见编程语言和框架\n4. 出色的沟通能力，能将复杂的编程概念转化为用户易懂的表述\n5. 对AI编程和Vibe Coding理念有深入理解",
    benefits: "1. 业内顶尖的薪资福利和股权激励\n2. 完全远程工作，弹性工作时间\n3. 高端AI工具和设备补贴\n4. 国际AI会议参与机会\n5. 与业内领先AI专家合作机会",
    postedDate: "2025-05-10",
    postedTime: "刚刚",
    isVerified: true,
    isHot: true,
  },
  {
    id: "2",
    title: "Vibe Query Language专家",
    company: "字节跳动",
    logo: "/images/companies/bytedance.png",
    location: "北京 / 远程",
    salary: "40k-70k",
    tags: ["VQL", "Vibe Coding", "Rust", "AI"],
    description: "负责开发和优化基于Vibe Query Language的开发工具，提升AI辅助编程效率，打造下一代智能编程体验。参与VQL标准制定，设计更直观的AI编程接口。",
    requirements: "1. 具备3年以上编程语言或编译器开发经验\n2. 精通Rust编程语言\n3. 深入理解大语言模型API和能力边界\n4. 有开发者工具或IDE插件开发经验优先\n5. 良好的英文文档阅读和写作能力",
    benefits: "1. 行业领先的薪资和年终奖\n2. 灵活的工作地点和时间\n3. 定期技术分享和培训\n4. 前沿AI研究环境\n5. 国际会议和学术交流机会",
    postedDate: "2025-05-09",
    postedTime: "1天前",
    isVerified: true,
    isHot: true,
  },
  {
    id: "3",
    title: "AI代码质量分析师",
    company: "阿里巴巴",
    logo: "/images/companies/alibaba.png",
    location: "杭州",
    salary: "30k-55k",
    tags: ["代码分析", "LLM", "质量保证", "AI"],
    description: "负责分析AI生成代码的质量、安全性和性能，开发智能检测工具识别潜在问题，提供优化建议，确保AI编程输出符合企业标准和最佳实践。",
    requirements: "1. 3年以上代码质量分析或安全审计经验\n2. 熟悉静态分析和动态分析工具\n3. 对常见编程漏洞和反模式有深入理解\n4. 了解LLM编程的特点和常见问题\n5. 有自动化测试工具开发经验优先",
    benefits: "1. 有竞争力的薪资和年终奖\n2. 五险一金和额外补充医疗保险\n3. 弹性工作制\n4. 定期团建和旅游\n5. 内部创新项目孵化机会",
    postedDate: "2025-05-07",
    postedTime: "3天前",
    isVerified: true,
    isHot: false,
  },
];

export default function JobDetailPage() {
  const params = useParams();
  const locale = params.locale as Locale || "zh-cn";
  const id = params.id as string;
  const t = useTranslations("Jobs");
  
  // 查找工作数据
  const job = DEMO_JOBS.find(job => job.id === id);
  
  if (!job) {
    notFound();
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === "zh-cn" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };
  
  // 根据职位选择合适的图标
  const getTitleIcon = () => {
    if (job.title.includes("AI编程指导")) return <Brain className="h-5 w-5 text-primary" />;
    if (job.title.includes("VQL") || job.title.includes("Query")) return <Code className="h-5 w-5 text-primary" />;
    if (job.title.includes("分析")) return <Cpu className="h-5 w-5 text-primary" />;
    return <Briefcase className="h-5 w-5 text-primary" />;
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-2">
        <Link href={`/${locale}/jobs`} className="text-sm text-muted-foreground hover:text-primary">
          {locale === "zh-cn" ? "所有AI工作" : "All AI Jobs"}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm">{job.title}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 工作详情 */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                {job.logo ? (
                  <Image
                    src={job.logo}
                    alt={job.company}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold">{job.company.charAt(0)}</span>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  {getTitleIcon()}
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  {job.isHot && (
                    <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-1 mt-1">
                  <span className="font-medium">{job.company}</span>
                  {job.isVerified && (
                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(job.postedDate)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                {locale === "zh-cn" ? "薪资范围" : "Salary Range"}
              </h2>
              <p className="text-xl font-bold text-primary">{job.salary}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                {locale === "zh-cn" ? "职位描述" : "Job Description"}
              </h2>
              <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                {locale === "zh-cn" ? "岗位要求" : "Requirements"}
              </h2>
              <p className="text-muted-foreground whitespace-pre-line">{job.requirements}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Gift className="h-5 w-5 text-muted-foreground" />
                {locale === "zh-cn" ? "福利待遇" : "Benefits"}
              </h2>
              <p className="text-muted-foreground whitespace-pre-line">{job.benefits}</p>
            </div>
            
            {/* Vibe Coding介绍部分 */}
            <div className="mt-8 p-4 bg-primary/5 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                {locale === "zh-cn" ? "关于Vibe Coding" : "About Vibe Coding"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {locale === "zh-cn"
                  ? "Vibe Coding是由前OpenAI联合创始人Andrej Karpathy在2025年提出的编程方式，用户只需用自然语言描述需求，AI就能自动生成代码。这种方法让非专业程序员也能创建应用，彻底改变了软件开发方式。加入我们，成为这场编程革命的一部分！"
                  : "Vibe Coding, introduced by former OpenAI co-founder Andrej Karpathy in 2025, is a programming approach where users describe requirements in natural language, and AI generates the code. This method enables non-programmers to create applications, revolutionizing software development. Join us to be part of this programming revolution!"}
              </p>
            </div>
          </Card>
        </div>
        
        {/* 应用区域 */}
        <div>
          <Card className="p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {locale === "zh-cn" ? "申请AI职位" : "Apply for this AI job"}
            </h2>
            
            <Button className="w-full mb-3">
              {t("applyNow")}
            </Button>
            
            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-6">
              <Clock className="h-4 w-4" />
              <span>{job.postedTime}</span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              {locale === "zh-cn" 
                ? "申请简单快捷，只需几分钟。加入AI编程革命！" 
                : "Quick and easy application, takes only a few minutes. Join the AI coding revolution!"}
            </p>
          </Card>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          {locale === "zh-cn" ? "相似AI职位" : "Similar AI Jobs"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_JOBS.filter(j => j.id !== id).map((job) => (
            <Link href={`/${locale}/jobs/${job.id}`} key={job.id}>
              <Card className="p-4 hover:shadow-md transition-shadow h-full">
                <div className="flex items-start gap-3">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
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
                    <h3 className="font-medium text-sm truncate">{job.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span className="truncate">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <DollarSign className="h-3 w-3" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 