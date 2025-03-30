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
    
    // 更新访问量
    await safeQuery(async () => {
      if (db) {
        await db.update(projects)
          .set({ views: (randomProject.views || 0) + 1 })
          .where(eq(projects.id, randomProject.id))
      }
    }, null)
    
    // 获取文件列表
    let files: string[] = []
    let fileContents: Record<string, string> = {}
    
    if (randomProject.files) {
      const projectFiles = randomProject.files as ProjectFile[]
      files = projectFiles.map((file: ProjectFile) => file.pathname)
      
      // 对于小型项目，预加载文件内容
      if (files.length <= 5) {
        for (const file of projectFiles) {
          try {
            const response = await fetch(file.url)
            if (response.ok) {
              const content = await response.text()
              fileContents[file.pathname] = content
            }
          } catch (error) {
            console.error(`Error fetching file ${file.pathname}:`, error)
          }
        }
      }
    }
    
    return NextResponse.json({
      projectId: randomProject.id,
      title: randomProject.title,
      description: randomProject.description,
      files,
      mainFile: randomProject.mainFile,
      fileContents,
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