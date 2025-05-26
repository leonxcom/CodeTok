"use client"

import { useParams } from "next/navigation"
import { Locale } from "../../../../i18n/config"
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star, 
  Award, 
  Code, 
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Rocket,
  Trophy,
  GraduationCap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LearnPage() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"

  // 推荐课程
  const featuredCourses = [
    {
      id: 1,
      title: locale === "zh-cn" ? "React 18 完整指南" : "Complete React 18 Guide",
      description: locale === "zh-cn" ? "从零开始学习React 18，包含Hooks、Context、Suspense等最新特性" : "Learn React 18 from scratch, including Hooks, Context, Suspense and latest features",
      instructor: "Sarah Chen",
      level: locale === "zh-cn" ? "中级" : "Intermediate",
      duration: "12小时",
      students: 2340,
      rating: 4.8,
      price: "免费",
      image: "",
      tags: ["React", "JavaScript", "Frontend"],
      progress: 0
    },
    {
      id: 2,
      title: locale === "zh-cn" ? "Python AI 开发实战" : "Python AI Development",
      description: locale === "zh-cn" ? "使用Python构建AI应用，涵盖机器学习、深度学习基础" : "Build AI applications with Python, covering machine learning and deep learning basics",
      instructor: "Alex Johnson", 
      level: locale === "zh-cn" ? "高级" : "Advanced",
      duration: "20小时",
      students: 1890,
      rating: 4.9,
      price: "¥199",
      image: "",
      tags: ["Python", "AI", "Machine Learning"],
      progress: 45
    },
    {
      id: 3,
      title: locale === "zh-cn" ? "全栈开发训练营" : "Full-Stack Bootcamp",
      description: locale === "zh-cn" ? "3个月掌握前端到后端的完整开发技能" : "Master frontend to backend development skills in 3 months",
      instructor: "Mike Rodriguez",
      level: locale === "zh-cn" ? "初级" : "Beginner", 
      duration: "120小时",
      students: 5670,
      rating: 4.7,
      price: "¥599",
      image: "",
      tags: ["Full-Stack", "Node.js", "React"],
      progress: 12
    }
  ]

  // 学习路径
  const learningPaths = [
    {
      id: 1,
      title: locale === "zh-cn" ? "前端开发工程师" : "Frontend Developer",
      description: locale === "zh-cn" ? "成为专业的前端开发者" : "Become a professional frontend developer",
      courses: 8,
      duration: "6个月",
      difficulty: locale === "zh-cn" ? "初级到高级" : "Beginner to Advanced",
      skills: ["HTML/CSS", "JavaScript", "React", "Vue", "TypeScript"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2, 
      title: locale === "zh-cn" ? "Python 后端开发" : "Python Backend",
      description: locale === "zh-cn" ? "掌握Python后端开发技术栈" : "Master Python backend development stack",
      courses: 6,
      duration: "4个月", 
      difficulty: locale === "zh-cn" ? "中级" : "Intermediate",
      skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Docker"],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      title: locale === "zh-cn" ? "AI/ML 工程师" : "AI/ML Engineer",
      description: locale === "zh-cn" ? "人工智能和机器学习专家之路" : "Path to becoming AI and ML expert",
      courses: 10,
      duration: "8个月",
      difficulty: locale === "zh-cn" ? "高级" : "Advanced", 
      skills: ["Python", "TensorFlow", "PyTorch", "ML Algorithms", "Deep Learning"],
      color: "from-purple-500 to-pink-500"
    }
  ]

  // 实战项目
  const projects = [
    {
      id: 1,
      title: locale === "zh-cn" ? "构建聊天应用" : "Build Chat App",
      description: locale === "zh-cn" ? "使用React和Socket.io构建实时聊天应用" : "Build real-time chat app with React and Socket.io",
      difficulty: locale === "zh-cn" ? "中级" : "Intermediate",
      time: "2-3天",
      tech: ["React", "Socket.io", "Node.js"],
      completed: 234
    },
    {
      id: 2,
      title: locale === "zh-cn" ? "AI图像识别" : "AI Image Recognition", 
      description: locale === "zh-cn" ? "训练深度学习模型进行图像分类" : "Train deep learning model for image classification",
      difficulty: locale === "zh-cn" ? "高级" : "Advanced",
      time: "1周",
      tech: ["Python", "TensorFlow", "CNN"],
      completed: 89
    },
    {
      id: 3,
      title: locale === "zh-cn" ? "电商网站" : "E-commerce Site",
      description: locale === "zh-cn" ? "全栈电商平台，包含支付和管理后台" : "Full-stack e-commerce platform with payment and admin panel",
      difficulty: locale === "zh-cn" ? "高级" : "Advanced", 
      time: "2周",
      tech: ["Next.js", "Stripe", "PostgreSQL"],
      completed: 156
    }
  ]

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="h-6 w-6 text-blue-500" />
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "zh-cn" ? "学习中心" : "Learning Hub"}
        </h1>
      </div>

      {/* 学习统计 */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "zh-cn" ? "已完成课程" : "Courses Completed"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">48h</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "zh-cn" ? "学习时长" : "Learning Hours"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "zh-cn" ? "获得证书" : "Certificates"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "zh-cn" ? "进行中项目" : "Active Projects"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            {locale === "zh-cn" ? "推荐课程" : "Featured Courses"}
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            {locale === "zh-cn" ? "学习路径" : "Learning Paths"}
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {locale === "zh-cn" ? "实战项目" : "Hands-on Projects"}
          </TabsTrigger>
        </TabsList>

        {/* 推荐课程 */}
        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {course.price}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-lg">{course.title}</h3>
                    <p className="text-white/80 text-sm">by {course.instructor}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  
                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>{locale === "zh-cn" ? "进度" : "Progress"}</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full">
                    {course.progress > 0 ? 
                      (locale === "zh-cn" ? "继续学习" : "Continue Learning") :
                      (locale === "zh-cn" ? "开始学习" : "Start Learning")
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 学习路径 */}
        <TabsContent value="paths" className="space-y-4">
          <div className="grid gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center`}>
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                      <p className="text-muted-foreground mb-4">{path.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {path.courses} {locale === "zh-cn" ? "门课程" : "courses"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {path.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {path.difficulty}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {path.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button>
                      {locale === "zh-cn" ? "开始路径" : "Start Path"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 实战项目 */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="outline" className="mt-2">
                        {project.difficulty}
                      </Badge>
                    </div>
                    <Code className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {project.completed} {locale === "zh-cn" ? "人完成" : "completed"}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {locale === "zh-cn" ? "开始项目" : "Start Project"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 