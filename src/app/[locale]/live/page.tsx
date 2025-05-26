"use client"

import { useParams } from "next/navigation"
import { Locale } from "../../../../i18n/config"
import { 
  Radio, 
  Users, 
  Clock, 
  Calendar,
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Video,
  Mic,
  Settings,
  Zap,
  Code2,
  Laptop
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LivePage() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"

  // 正在直播
  const liveStreams = [
    {
      id: 1,
      title: locale === "zh-cn" ? "React 18 新特性深度解析" : "React 18 New Features Deep Dive",
      streamer: "Sarah Chen",
      avatar: "",
      viewers: 1240,
      duration: "2:34:12",
      category: "Frontend",
      tags: ["React", "JavaScript", "Live Coding"],
      isLive: true,
      thumbnail: "",
      description: locale === "zh-cn" ? "深入探讨React 18的并发特性、Suspense和新的Hooks API" : "Deep dive into React 18 concurrent features, Suspense and new Hooks API"
    },
    {
      id: 2,
      title: locale === "zh-cn" ? "Python AI 项目实战" : "Python AI Project Workshop",
      streamer: "Alex Johnson",
      avatar: "",
      viewers: 890,
      duration: "1:15:30",
      category: "AI/ML",
      tags: ["Python", "Machine Learning", "Tutorial"],
      isLive: true,
      thumbnail: "",
      description: locale === "zh-cn" ? "使用TensorFlow构建图像识别模型，从零到部署" : "Building image recognition model with TensorFlow, from zero to deployment"
    }
  ]

  // 即将开始
  const upcomingStreams = [
    {
      id: 3,
      title: locale === "zh-cn" ? "Vue 3 组合式API实战" : "Vue 3 Composition API in Action", 
      streamer: "Mike Rodriguez",
      avatar: "",
      scheduledTime: "18:00",
      date: locale === "zh-cn" ? "今天" : "Today",
      category: "Frontend",
      tags: ["Vue", "JavaScript"],
      followers: 2340
    },
    {
      id: 4,
      title: locale === "zh-cn" ? "Node.js 微服务架构" : "Node.js Microservices Architecture",
      streamer: "Emma Wilson", 
      avatar: "",
      scheduledTime: "20:30",
      date: locale === "zh-cn" ? "今天" : "Today",
      category: "Backend",
      tags: ["Node.js", "Microservices"],
      followers: 1890
    },
    {
      id: 5,
      title: locale === "zh-cn" ? "DevOps 工具链实践" : "DevOps Toolchain Practice",
      streamer: "David Kim",
      avatar: "",
      scheduledTime: "15:00",
      date: locale === "zh-cn" ? "明天" : "Tomorrow", 
      category: "DevOps",
      tags: ["Docker", "Kubernetes"],
      followers: 3200
    }
  ]

  // 热门回放
  const popularReplays = [
    {
      id: 6,
      title: locale === "zh-cn" ? "全栈应用开发马拉松" : "Full-Stack App Development Marathon",
      streamer: "Team CodeTok",
      views: 15600,
      duration: "8:24:15",
      uploadDate: locale === "zh-cn" ? "3天前" : "3 days ago",
      tags: ["Full-Stack", "React", "Node.js"],
      rating: 4.9
    },
    {
      id: 7,
      title: locale === "zh-cn" ? "算法与数据结构系列" : "Algorithms & Data Structures Series",
      streamer: "Prof. Zhang",
      views: 8900,
      duration: "4:12:30", 
      uploadDate: locale === "zh-cn" ? "1周前" : "1 week ago",
      tags: ["Algorithms", "Data Structures", "Interview"],
      rating: 4.8
    }
  ]

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Radio className="h-6 w-6 text-red-500" />
          <h1 className="text-3xl font-bold tracking-tight">
            {locale === "zh-cn" ? "直播中心" : "Live Streaming Hub"}
          </h1>
        </div>
        <Button className="bg-red-500 hover:bg-red-600">
          <Video className="h-4 w-4 mr-2" />
          {locale === "zh-cn" ? "开始直播" : "Start Streaming"}
        </Button>
      </div>

      {/* 直播统计 */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "zh-cn" ? "正在直播" : "Live Now"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">8.5K</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "zh-cn" ? "在线观众" : "Online Viewers"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "zh-cn" ? "今日预定" : "Scheduled Today"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">245</p>
                <p className="text-xs text-muted-foreground">
                  {locale === "zh-cn" ? "本周精选" : "Featured This Week"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="live" className="space-y-6">
        <TabsList>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            {locale === "zh-cn" ? "正在直播" : "Live Now"}
            <Badge variant="destructive" className="ml-1">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {locale === "zh-cn" ? "即将开始" : "Upcoming"}
            <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="replays" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            {locale === "zh-cn" ? "热门回放" : "Popular Replays"}
          </TabsTrigger>
        </TabsList>

        {/* 正在直播 */}
        <TabsContent value="live" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {liveStreams.map((stream) => (
              <Card key={stream.id} className="overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-red-500 to-pink-600 relative">
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white border-red-400 animate-pulse">
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 bg-black/50 rounded-lg px-2 py-1">
                        <Eye className="h-3 w-3 text-white" />
                        <span className="text-white text-sm">{stream.viewers.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary">{stream.category}</Badge>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="text-white text-sm bg-black/50 rounded px-2 py-1">
                        {stream.duration}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="lg" className="bg-white/20 hover:bg-white/30 border border-white/30">
                        <Play className="h-6 w-6 text-white mr-2" />
                        {locale === "zh-cn" ? "观看直播" : "Watch Live"}
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                        {stream.streamer.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">{stream.streamer}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{stream.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {stream.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="sm">
                      {locale === "zh-cn" ? "加入直播" : "Join Stream"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 即将开始 */}
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {upcomingStreams.map((stream) => (
              <Card key={stream.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{stream.scheduledTime}</p>
                      <p className="text-xs text-muted-foreground">{stream.date}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
                            {stream.streamer.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{stream.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{stream.streamer}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="secondary">{stream.category}</Badge>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {stream.followers.toLocaleString()} {locale === "zh-cn" ? "关注者" : "followers"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        {locale === "zh-cn" ? "提醒我" : "Remind Me"}
                      </Button>
                      <Button>
                        {locale === "zh-cn" ? "预约观看" : "Schedule Watch"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 热门回放 */}
        <TabsContent value="replays" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {popularReplays.map((replay) => (
              <Card key={replay.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 relative">
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 bg-black/50 rounded-lg px-2 py-1">
                      <Eye className="h-3 w-3 text-white" />
                      <span className="text-white text-sm">{replay.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="text-white text-sm bg-black/50 rounded px-2 py-1">
                      {replay.duration}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 border border-white/30">
                      <Play className="h-6 w-6 text-white mr-2" />
                      {locale === "zh-cn" ? "播放回放" : "Watch Replay"}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{replay.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">by {replay.streamer}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {replay.rating}
                    </div>
                    <span>{replay.uploadDate}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {replay.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
 