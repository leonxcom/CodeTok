"use client"

import { useParams } from "next/navigation"
import { Locale } from "../../../../i18n/config"
import { 
  Heart, 
  Users, 
  Star, 
  GitFork, 
  Eye, 
  Clock, 
  Code, 
  Zap,
  TrendingUp,
  User,
  Calendar,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FollowingPage() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"

  // 模拟关注的用户数据
  const followingUsers = [
    {
      id: 1,
      name: "Alex Johnson",
      username: "@alexdev",
      avatar: "",
      bio: locale === "zh-cn" ? "全栈开发者，AI爱好者" : "Full-stack developer, AI enthusiast",
      followers: 2340,
      projects: 23,
      isOnline: true,
      lastActive: "2分钟前"
    },
    {
      id: 2, 
      name: "Sarah Chen",
      username: "@sarahui",
      avatar: "",
      bio: locale === "zh-cn" ? "UI/UX设计师，前端专家" : "UI/UX Designer, Frontend Expert",
      followers: 1890,
      projects: 15,
      isOnline: false,
      lastActive: "1小时前"
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      username: "@mikepy",
      avatar: "",
      bio: locale === "zh-cn" ? "Python后端工程师" : "Python Backend Engineer", 
      followers: 3200,
      projects: 31,
      isOnline: true,
      lastActive: "刚刚"
    }
  ]

  // 模拟关注的项目数据
  const followingProjects = [
    {
      id: 1,
      name: "AI Code Assistant",
      author: "Alex Johnson",
      description: locale === "zh-cn" ? "智能代码补全和生成工具" : "Intelligent code completion and generation tool",
      language: "TypeScript",
      stars: 1240,
      forks: 156,
      lastUpdate: "2小时前",
      trending: true
    },
    {
      id: 2,
      name: "Modern UI Kit",
      author: "Sarah Chen", 
      description: locale === "zh-cn" ? "现代化的React组件库" : "Modern React component library",
      language: "React",
      stars: 890,
      forks: 234,
      lastUpdate: "1天前",
      trending: false
    },
    {
      id: 3,
      name: "FastAPI Starter",
      author: "Mike Rodriguez",
      description: locale === "zh-cn" ? "高性能API快速开发框架" : "High-performance API rapid development framework",
      language: "Python", 
      stars: 567,
      forks: 89,
      lastUpdate: "3天前",
      trending: true
    }
  ]

  // 模拟最新活动
  const recentActivity = [
    {
      id: 1,
      user: "Alex Johnson",
      action: locale === "zh-cn" ? "发布了新项目" : "published a new project",
      target: "AI Code Assistant v2.0",
      time: "10分钟前",
      type: "project"
    },
    {
      id: 2,
      user: "Sarah Chen",
      action: locale === "zh-cn" ? "更新了" : "updated",
      target: "Modern UI Kit",
      time: "1小时前", 
      type: "update"
    },
    {
      id: 3,
      user: "Mike Rodriguez",
      action: locale === "zh-cn" ? "给" : "starred",
      target: "React Native Boilerplate",
      time: "2小时前",
      type: "star"
    },
    {
      id: 4,
      user: "Alex Johnson",
      action: locale === "zh-cn" ? "fork了" : "forked",
      target: "Vue 3 Components",
      time: "4小时前",
      type: "fork" 
    }
  ]

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-6 w-6 text-red-500" />
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "zh-cn" ? "关注" : "Following"}
        </h1>
      </div>
      
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {locale === "zh-cn" ? "用户" : "Users"} 
            <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {locale === "zh-cn" ? "项目" : "Projects"}
            <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {locale === "zh-cn" ? "动态" : "Activity"}
          </TabsTrigger>
        </TabsList>

        {/* 关注的用户 */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {followingUsers.map((user) => (
              <Card key={user.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{user.username}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {locale === "zh-cn" ? "已关注" : "Following"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">{user.bio}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {user.followers.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      {user.projects}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {locale === "zh-cn" ? "最后活跃" : "Last active"}: {user.lastActive}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 关注的项目 */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4">
            {followingProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        {project.trending && (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {locale === "zh-cn" ? "热门" : "Trending"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">by {project.author}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      {locale === "zh-cn" ? "查看" : "View"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="secondary">{project.language}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {project.stars.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {project.forks}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.lastUpdate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 最新动态 */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {locale === "zh-cn" ? "最新动态" : "Recent Activity"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                        <span className="font-medium text-blue-600">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <div className="flex items-center">
                      {activity.type === 'project' && <Zap className="h-4 w-4 text-yellow-500" />}
                      {activity.type === 'update' && <Code className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'star' && <Star className="h-4 w-4 text-yellow-500" />}
                      {activity.type === 'fork' && <GitFork className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 