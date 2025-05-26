'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound, useRouter } from 'next/navigation'
import { Locale } from '../../../../../i18n/config'
import { useSession } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FollowButton } from '@/components/follow-button'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
import { UserIcon, Code, Heart, BookmarkIcon, MessageSquare, Users } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  avatar?: string
  bio?: string
  email?: string
  createdAt: string
  projectsCount: number
  followersCount: number
  followingCount: number
  isFollowing?: boolean
}

interface Project {
  id: string
  title: string
  description?: string
  main_file: string
  views: number
  likes: number
  comments_count: number
  created_at: string
  updated_at: string
}

export default function UserProfilePage() {
  const params = useParams<{ locale: string; id: string }>()
  const locale = params?.locale as Locale || 'zh-cn'
  const userId = params?.id as string
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [likedProjects, setLikedProjects] = useState<Project[]>([])
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Project[]>([])
  const [activeTab, setActiveTab] = useState('projects')
  
  // 加载用户资料
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setIsLoading(true)
        setError(null)
        
        // 获取用户资料
        const profileResponse = await fetch(`/api/users/${userId}`)
        
        if (profileResponse.status === 404) {
          notFound()
          return
        }
        
        if (!profileResponse.ok) {
          throw new Error(
            locale === 'zh-cn' 
              ? '无法加载用户资料' 
              : 'Failed to load user profile'
          )
        }
        
        const profileData = await profileResponse.json()
        setProfile(profileData)
        
        // 获取用户项目
        await loadUserProjects()
        
        // 如果用户已登录且不是查看自己的资料，还需获取关注状态
        if (session?.user && session.user.id !== userId) {
          const followResponse = await fetch(`/api/social/follow?targetUserId=${userId}`)
          if (followResponse.ok) {
            const followData = await followResponse.json()
            setProfile(prev => prev ? {...prev, isFollowing: followData.isFollowing} : null)
          }
        }
      } catch (error) {
        console.error('加载用户资料失败:', error)
        setError(
          locale === 'zh-cn' 
            ? '加载用户资料失败，请稍后重试' 
            : 'Failed to load user profile, please try again later'
        )
      } finally {
        setIsLoading(false)
      }
    }
    
    if (userId) {
      loadUserProfile()
    }
  }, [userId, locale, session?.user])
  
  // 加载用户项目
  const loadUserProjects = async () => {
    try {
      const projectsResponse = await fetch(`/api/users/${userId}/projects`)
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects || [])
      }
      
      // 如果用户已登录，还需获取用户点赞和收藏的项目
      if (session?.user?.id) {
        // 仅当查看自己的资料时才加载这些内容
        if (session.user.id === userId) {
          const likedResponse = await fetch(`/api/users/${userId}/liked`)
          if (likedResponse.ok) {
            const likedData = await likedResponse.json()
            setLikedProjects(likedData.projects || [])
          }
          
          const bookmarkedResponse = await fetch(`/api/users/${userId}/bookmarked`)
          if (bookmarkedResponse.ok) {
            const bookmarkedData = await bookmarkedResponse.json()
            setBookmarkedProjects(bookmarkedData.projects || [])
          }
        }
      }
    } catch (error) {
      console.error('加载用户项目失败:', error)
    }
  }
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale === 'zh-cn' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }
  
  // 渲染项目卡片
  const renderProjectCard = (project: Project) => (
    <Link 
      href={`/${locale}/project/${project.id}`}
      key={project.id}
      className="block p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-medium mb-2">{project.title}</h3>
      {project.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
      )}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Heart className="h-4 w-4 mr-1" />
          <span>{project.likes}</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{project.comments_count}</span>
        </div>
        <div className="flex-1 text-right">
          {formatDate(project.created_at)}
        </div>
      </div>
    </Link>
  )
  
  // 加载中状态
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    )
  }
  
  // 错误状态
  if (error || !profile) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-lg mx-auto text-center p-6 bg-card rounded-lg border">
          <UserIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-xl font-semibold mb-2">
            {locale === 'zh-cn' ? '无法加载用户资料' : 'Failed to load user profile'}
          </h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            {locale === 'zh-cn' ? '返回' : 'Go Back'}
          </Button>
        </div>
      </div>
    )
  }
  
  const isOwnProfile = session?.user?.id === userId
  
  return (
    <div className="container mx-auto py-12">
      {/* 用户资料头部 */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start mb-10">
          {/* 头像和基本信息 */}
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-2xl">
                {profile.name?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
              
              {!isOwnProfile && (
                <FollowButton 
                  targetUserId={userId}
                  locale={locale}
                  size="default"
                  variant="default"
                />
              )}
            </div>
            
            {profile.bio && (
              <p className="text-muted-foreground mb-4">{profile.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>
                  {locale === 'zh-cn' ? '项目：' : 'Projects: '}
                  {profile.projectsCount}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>
                  {locale === 'zh-cn' ? '关注者：' : 'Followers: '}
                  {profile.followersCount}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>
                  {locale === 'zh-cn' ? '正在关注：' : 'Following: '}
                  {profile.followingCount}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <span>
                  {locale === 'zh-cn' ? '加入时间：' : 'Joined: '}
                  {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 项目标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="projects">
              {locale === 'zh-cn' ? '项目' : 'Projects'}
            </TabsTrigger>
            
            {isOwnProfile && (
              <>
                <TabsTrigger value="liked">
                  {locale === 'zh-cn' ? '点赞' : 'Liked'}
                </TabsTrigger>
                <TabsTrigger value="bookmarked">
                  {locale === 'zh-cn' ? '收藏' : 'Bookmarked'}
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="projects" className="mt-0">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(renderProjectCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {locale === 'zh-cn' 
                    ? '暂无项目' 
                    : 'No projects yet'}
                </p>
              </div>
            )}
          </TabsContent>
          
          {isOwnProfile && (
            <>
              <TabsContent value="liked" className="mt-0">
                {likedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {likedProjects.map(renderProjectCard)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {locale === 'zh-cn' 
                        ? '暂无点赞项目' 
                        : 'No liked projects yet'}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="bookmarked" className="mt-0">
                {bookmarkedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarkedProjects.map(renderProjectCard)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookmarkIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {locale === 'zh-cn' 
                        ? '暂无收藏项目' 
                        : 'No bookmarked projects yet'}
                    </p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  )
} 