"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Locale } from "../../../../../i18n/config"
import { 
  Briefcase, 
  Info, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  FileText, 
  ListChecks, 
  Code, 
  Mail,
  Brain,
  Lightbulb,
  Cpu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

export default function PostJobPage() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"
  const t = useTranslations("Jobs")
  
  const [formState, setFormState] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    aiSkillLevel: "",
    salary: "",
    description: "",
    requirements: "",
    skills: "",
    contactEmail: "",
    isVibeCoding: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormState(prev => ({ ...prev, [name]: checked }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // 模拟提交到API
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      // 重置表单
      setFormState({
        title: "",
        company: "",
        location: "",
        jobType: "",
        aiSkillLevel: "",
        salary: "",
        description: "",
        requirements: "",
        skills: "",
        contactEmail: "",
        isVibeCoding: false
      })
    }, 1500)
  }
  
  return (
    <div className="container max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "zh-cn" ? "发布AI编程工作" : "Post an AI Job"}
        </h1>
      </div>
      
      {isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-primary">
              {locale === "zh-cn" ? "发布成功！" : "Posted Successfully!"}
            </CardTitle>
            <CardDescription className="text-center">
              {locale === "zh-cn" 
                ? "您的AI编程工作机会已成功提交，我们会尽快审核。" 
                : "Your AI job posting has been submitted successfully and will be reviewed shortly."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <Button onClick={() => setIsSubmitted(false)}>
              {locale === "zh-cn" ? "发布另一个" : "Post Another Job"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Alert className="mb-6 border-primary/50 bg-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
            <AlertTitle>
              {locale === "zh-cn" ? "Vibe Coding革命" : "Vibe Coding Revolution"}
            </AlertTitle>
            <AlertDescription>
              {locale === "zh-cn" 
                ? "Vibe Coding是一种新型的编程方式，由Andrej Karpathy在2025年提出。用户只需用自然语言描述需求，AI就能自动生成代码。发布相关职位，吸引顶尖AI编程人才！" 
                : "Vibe Coding is a new programming approach introduced by Andrej Karpathy in 2025. Users describe requirements in natural language, and AI generates the code. Post related positions to attract top AI programming talent!"}
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === "zh-cn" ? "AI工作基本信息" : "AI Job Basic Information"}
                </CardTitle>
                <CardDescription>
                  {locale === "zh-cn" ? "填写AI编程工作的基本信息" : "Fill in the basic details of the AI job"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {locale === "zh-cn" ? "职位名称" : "Job Title"} *
                    </Label>
                    <Input 
                      id="title"
                      name="title"
                      value={formState.title}
                      onChange={handleChange}
                      placeholder={locale === "zh-cn" ? "例如：AI编程指导师" : "e.g., AI Programming Coach"}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {locale === "zh-cn" ? "公司名称" : "Company"} *
                    </Label>
                    <Input 
                      id="company"
                      name="company"
                      value={formState.company}
                      onChange={handleChange}
                      placeholder={locale === "zh-cn" ? "例如：CodeTok" : "e.g., CodeTok"}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {locale === "zh-cn" ? "工作地点" : "Location"} *
                    </Label>
                    <Input 
                      id="location"
                      name="location"
                      value={formState.location}
                      onChange={handleChange}
                      placeholder={locale === "zh-cn" ? "例如：远程 / 北京" : "e.g., Remote / Beijing"}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobType" className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {locale === "zh-cn" ? "工作类型" : "Job Type"} *
                    </Label>
                    <Select 
                      value={formState.jobType} 
                      onValueChange={(value) => handleSelectChange("jobType", value)}
                      required
                    >
                      <SelectTrigger id="jobType">
                        <SelectValue placeholder={locale === "zh-cn" ? "选择工作类型" : "Select job type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">
                          {locale === "zh-cn" ? "全职" : "Full-time"}
                        </SelectItem>
                        <SelectItem value="part-time">
                          {locale === "zh-cn" ? "兼职" : "Part-time"}
                        </SelectItem>
                        <SelectItem value="contract">
                          {locale === "zh-cn" ? "合同制" : "Contract"}
                        </SelectItem>
                        <SelectItem value="internship">
                          {locale === "zh-cn" ? "实习" : "Internship"}
                        </SelectItem>
                        <SelectItem value="ai-coding">
                          {locale === "zh-cn" ? "AI辅助编程" : "AI-Assisted Coding"}
                        </SelectItem>
                        <SelectItem value="vibe-coding">
                          {locale === "zh-cn" ? "Vibe Coding" : "Vibe Coding"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aiSkillLevel" className="flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    {locale === "zh-cn" ? "AI技能要求" : "AI Skill Level"} *
                  </Label>
                  <Select 
                    value={formState.aiSkillLevel} 
                    onValueChange={(value) => handleSelectChange("aiSkillLevel", value)}
                    required
                  >
                    <SelectTrigger id="aiSkillLevel">
                      <SelectValue placeholder={locale === "zh-cn" ? "选择AI技能水平" : "Select AI skill level"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">
                        {locale === "zh-cn" ? "入门级" : "Beginner"}
                      </SelectItem>
                      <SelectItem value="intermediate">
                        {locale === "zh-cn" ? "中级" : "Intermediate"}
                      </SelectItem>
                      <SelectItem value="expert">
                        {locale === "zh-cn" ? "专家级" : "Expert"}
                      </SelectItem>
                      <SelectItem value="researcher">
                        {locale === "zh-cn" ? "研究水平" : "Researcher"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary" className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {locale === "zh-cn" ? "薪资范围" : "Salary Range"}
                  </Label>
                  <Input 
                    id="salary"
                    name="salary"
                    value={formState.salary}
                    onChange={handleChange}
                    placeholder={locale === "zh-cn" ? "例如：35k-65k" : "e.g., $80k-120k"}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVibeCoding"
                    checked={formState.isVibeCoding}
                    onCheckedChange={(checked: boolean) => handleCheckboxChange("isVibeCoding", checked)}
                  />
                  <label
                    htmlFor="isVibeCoding"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                  >
                    <Cpu className="h-4 w-4 text-primary" />
                    {locale === "zh-cn" ? "这是Vibe Coding相关职位" : "This is a Vibe Coding related position"}
                  </label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {locale === "zh-cn" ? "职位描述" : "Job Description"} *
                  </Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleChange}
                    placeholder={locale === "zh-cn" ? "描述AI编程工作内容、职责和期望..." : "Describe the AI job, responsibilities, and expectations..."}
                    rows={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="requirements" className="flex items-center gap-1">
                    <ListChecks className="h-4 w-4" />
                    {locale === "zh-cn" ? "岗位要求" : "Requirements"}
                  </Label>
                  <Textarea 
                    id="requirements"
                    name="requirements"
                    value={formState.requirements}
                    onChange={handleChange}
                    placeholder={locale === "zh-cn" ? "列出AI编程人才需要具备的条件..." : "List the requirements for AI programming candidates..."}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    {locale === "zh-cn" ? "技能要求" : "Skills"} *
                  </Label>
                  <Input 
                    id="skills"
                    name="skills"
                    value={formState.skills}
                    onChange={handleChange}
                    placeholder={locale === "zh-cn" ? "例如：Prompt Engineering, LLM, VQL, AI Ethics" : "e.g., Prompt Engineering, LLM, VQL, AI Ethics"}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {locale === "zh-cn" 
                      ? "使用逗号分隔多个技能。AI编程相关技能示例：Prompt Engineering, LLM, VQL, AI Ethics" 
                      : "Separate multiple skills with commas. AI coding skills example: Prompt Engineering, LLM, VQL, AI Ethics"}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {locale === "zh-cn" ? "联系邮箱" : "Contact Email"} *
                  </Label>
                  <Input 
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formState.contactEmail}
                    onChange={handleChange}
                    placeholder={locale === "zh-cn" ? "用于接收申请通知的邮箱" : "Email to receive applications"}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting 
                    ? (locale === "zh-cn" ? "发布中..." : "Posting...") 
                    : (locale === "zh-cn" ? "发布AI工作" : "Post AI Job")}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </>
      )}
    </div>
  )
} 