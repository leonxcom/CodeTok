import { NextResponse } from 'next/server'
import { db, safeQuery, projects } from '@/db'
import { sql, eq } from 'drizzle-orm'
import { ProjectFile } from '@/db/schema'

export async function GET() {
  try {
    // 从数据库获取随机项目
    const randomProject = await safeQuery(async () => {
      if (!db) return null
      
      // 使用SQL随机获取一个公开项目
      const results = await db.select().from(projects)
        .where(eq(projects.isPublic, true))
        .orderBy(sql`RANDOM()`)
        .limit(1)
        
      return results[0] || null
    }, null)
    
    // 如果没有找到项目
    if (!randomProject) {
      return NextResponse.json({ 
        error: 'No projects available' 
      }, { status: 404 })
    }
    
    // 异步更新访问量，不阻塞响应
    void (async () => {
      await safeQuery(async () => {
        if (db) {
          await db.update(projects)
            .set({ views: (randomProject.views || 0) + 1 })
            .where(eq(projects.id, randomProject.id))
        }
      }, null)
    })()
    
    // 获取文件列表
    let files: string[] = []
    let mainFileContent: string | null = null
    
    if (randomProject.files) {
      const projectFiles = randomProject.files as ProjectFile[]
      files = projectFiles.map((file: ProjectFile) => file.pathname)
      
      // 只获取主文件内容
      const mainFile = projectFiles.find(file => file.pathname === randomProject.mainFile)
      
      if (mainFile) {
        try {
          const response = await fetch(mainFile.url)
          if (response.ok) {
            mainFileContent = await response.text()
          }
        } catch (error) {
          console.error(`Error fetching main file ${mainFile.pathname}:`, error)
        }
      }
    }
    
    // 构建响应对象 - 只包含必要信息，减少传输数据量
    return NextResponse.json({
      projectId: randomProject.id,
      title: randomProject.title,
      description: randomProject.description,
      files,
      mainFile: randomProject.mainFile,
      fileContents: mainFileContent 
        ? { [randomProject.mainFile as string]: mainFileContent } 
        : {},
      views: randomProject.views
    })
  } catch (error) {
    console.error('Error fetching random project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch random project' }, 
      { status: 500 }
    )
  }
} 