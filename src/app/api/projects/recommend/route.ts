import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

type ProjectResponse = {
  projectId: string
  title?: string
  description?: string
  externalUrl?: string
  files: string[]
  mainFile: string
  views?: number
  createdAt?: string
}

// 简单的项目ID缓存，减少数据库负载
const projectCache = {
  ids: [] as string[],
  lastFetched: 0,
  ttl: 1000 * 60 * 5, // 5分钟缓存过期
  hits: 0,
  misses: 0,
  maxSize: 100
}

export async function GET(request: Request) {
  const startTime = Date.now()
  console.log('[RecommendAPI] Request received')
  
  try {
    // 从URL获取当前项目ID
    const url = new URL(request.url)
    const currentId = url.searchParams.get('currentId')
    
    // 如果没有提供当前项目ID，回退到随机项目
    if (!currentId) {
      console.log('[RecommendAPI] No currentId provided, falling back to random project')
      return getRandomProject()
    }
    
    // 获取当前项目信息，用于找到类似项目
    const currentProject = await getCurrentProject(currentId)
    
    // 如果无法获取当前项目，回退到随机项目
    if (!currentProject) {
      console.log('[RecommendAPI] Cannot find current project, falling back to random project')
      return getRandomProject()
    }
    
    // 获取推荐项目
    const recommendedProject = await getRecommendedProject(currentProject)
    
    // 异步更新浏览量
    updateViewCount(recommendedProject.projectId).catch(error => {
      console.error('[RecommendAPI] Failed to update view count:', error)
    })
    
    // 计算并记录响应时间
    const responseTime = Date.now() - startTime
    console.log(`[RecommendAPI] Response prepared in ${responseTime}ms (cache ${projectCache.hits}/${projectCache.hits + projectCache.misses})`)
    
    return NextResponse.json(recommendedProject)
  } catch (error) {
    console.error('[RecommendAPI] Error:', error)
    return NextResponse.json({ error: 'Failed to recommend project' }, { status: 500 })
  }
}

// 获取当前项目详情
async function getCurrentProject(projectId: string): Promise<ProjectResponse | null> {
  try {
    const result = await sql`
      SELECT 
        id as "projectId",
        title,
        description,
        external_url as "externalUrl",
        files,
        main_file as "mainFile",
        views,
        created_at as "createdAt"
      FROM projects
      WHERE id = ${projectId}
    `
    
    if (result.rows.length === 0) {
      return null
    }
    
    return result.rows[0] as ProjectResponse
  } catch (error) {
    console.error('[RecommendAPI] Error getting current project:', error)
    return null
  }
}

// 获取随机项目（作为后备方案）
async function getRandomProject(): Promise<NextResponse> {
  try {
    const randomId = await getRandomProjectId()
    
    // 异步更新浏览量
    updateViewCount(randomId).catch(error => {
      console.error('[RecommendAPI] Failed to update random project view count:', error)
    })
    
    return NextResponse.json({
      projectId: randomId
    })
  } catch (error) {
    console.error('[RecommendAPI] Random fallback error:', error)
    return NextResponse.json({ error: 'Failed to get random project' }, { status: 500 })
  }
}

// 从缓存或数据库获取随机项目ID
async function getRandomProjectId(): Promise<string> {
  const now = Date.now()
  
  // 检查缓存是否过期
  if (projectCache.ids.length === 0 || now - projectCache.lastFetched > projectCache.ttl) {
    console.log('[RecommendAPI] Cache miss, fetching project IDs')
    projectCache.misses++
    
    // 从数据库获取所有公开项目的ID
    const result = await sql`
      SELECT id FROM projects WHERE is_public = true
    `
    
    // 更新缓存
    projectCache.ids = result.rows.map(row => row.id)
    projectCache.lastFetched = now
    
    // 限制缓存大小
    if (projectCache.ids.length > projectCache.maxSize) {
      projectCache.ids = projectCache.ids.slice(0, projectCache.maxSize)
    }
    
    console.log(`[RecommendAPI] Cached ${projectCache.ids.length} project IDs`)
  } else {
    projectCache.hits++
  }
  
  // 如果没有项目，抛出错误
  if (projectCache.ids.length === 0) {
    throw new Error('No projects available')
  }
  
  // 返回随机项目
  const randomIndex = Math.floor(Math.random() * projectCache.ids.length)
  return projectCache.ids[randomIndex]
}

// 获取推荐项目
async function getRecommendedProject(currentProject: ProjectResponse): Promise<ProjectResponse> {
  try {
    // 为了创建更好的推荐，我们需要根据当前项目的特征查找相似项目
    // 这里使用一个简单的策略:
    // 1. 有20%的可能性返回最新创建的项目
    // 2. 有30%的可能性返回最受欢迎的项目
    // 3. 有50%的可能性返回与当前项目相似的项目（基于标题和描述的相似性）
    
    const strategy = Math.random()
    let result
    
    if (strategy < 0.2) {
      // 策略1: 返回最新项目
      console.log('[RecommendAPI] Using newest project strategy')
      result = await sql`
        SELECT 
          id as "projectId",
          title,
          description,
          external_url as "externalUrl",
          files,
          main_file as "mainFile",
          views,
          created_at as "createdAt"
        FROM projects
        WHERE is_public = true
        AND id != ${currentProject.projectId}
        ORDER BY created_at DESC
        LIMIT 1
      `
    } else if (strategy < 0.5) {
      // 策略2: 返回最受欢迎的项目
      console.log('[RecommendAPI] Using most popular project strategy')
      result = await sql`
        SELECT 
          id as "projectId",
          title,
          description,
          external_url as "externalUrl",
          files,
          main_file as "mainFile",
          views,
          created_at as "createdAt"
        FROM projects
        WHERE is_public = true
        AND id != ${currentProject.projectId}
        ORDER BY views DESC
        LIMIT 1
      `
    } else {
      // 策略3: 返回相似项目（基于简单的文本匹配）
      console.log('[RecommendAPI] Using similar project strategy')
      // 如果项目有标题，找标题相似的项目
      if (currentProject.title) {
        result = await sql`
          SELECT 
            id as "projectId",
            title,
            description,
            external_url as "externalUrl",
            files,
            main_file as "mainFile",
            views,
            created_at as "createdAt"
          FROM projects
          WHERE is_public = true
          AND id != ${currentProject.projectId}
          AND (
            title ILIKE ${'%' + currentProject.title + '%'}
            OR description ILIKE ${'%' + currentProject.title + '%'}
          )
          ORDER BY RANDOM()
          LIMIT 1
        `
      }
    }
    
    // 如果找到推荐项目，返回第一个
    if (result && result.rows.length > 0) {
      return result.rows[0] as ProjectResponse
    }
    
    // 如果没有找到推荐项目，回退到随机项目
    console.log('[RecommendAPI] No recommendations found, using random project')
    const randomId = await getRandomProjectId()
    const randomProject = await getCurrentProject(randomId)
    
    if (!randomProject) {
      throw new Error('Failed to get random project')
    }
    
    return randomProject
  } catch (error) {
    console.error('[RecommendAPI] Error getting recommended project:', error)
    
    // 如果推荐失败，回退到随机项目
    const randomId = await getRandomProjectId()
    const randomProject = await getCurrentProject(randomId)
    
    if (!randomProject) {
      return {
        projectId: randomId,
        files: [],
        mainFile: ''
      }
    }
    
    return randomProject
  }
}

// 异步更新项目浏览量
async function updateViewCount(projectId: string): Promise<void> {
  try {
    await sql`
      UPDATE projects
      SET views = views + 1
      WHERE id = ${projectId}
    `
    console.log(`[RecommendAPI] View count updated for project ${projectId}`)
  } catch (error) {
    console.error('[RecommendAPI] Error updating view count:', error)
  }
} 