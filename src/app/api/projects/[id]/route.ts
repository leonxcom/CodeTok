import { NextRequest, NextResponse } from 'next/server'
import { db, safeQuery, projects } from '@/db'
import { eq } from 'drizzle-orm'
import { ProjectFile } from '@/db/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // 从数据库获取项目
    const project = await safeQuery(async () => {
      if (!db) return null
      
      // 查询项目
      const results = await db.select().from(projects)
        .where(eq(projects.id, id))
        .limit(1)
        
      return results[0] || null
    }, null)
    
    // 如果没有找到项目
    if (!project) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }
    
    // 更新访问量
    await safeQuery(async () => {
      if (db) {
        await db.update(projects)
          .set({ views: (project.views || 0) + 1 })
          .where(eq(projects.id, id))
      }
    }, null)
    
    // 获取文件列表
    let files: string[] = []
    let fileContents: Record<string, string> = {}
    
    if (project.files) {
      const projectFiles = project.files as ProjectFile[]
      files = projectFiles.map((file: ProjectFile) => file.pathname)
      
      // 获取所有文件内容
      for (const file of projectFiles) {
        try {
          const response = await fetch(file.url)
          if (response.ok) {
            const content = await response.text()
            fileContents[file.pathname] = content
          }
        } catch (error) {
          console.error(`Error fetching file ${file.pathname}:`, error)
          fileContents[file.pathname] = `// Error loading content: ${error}`
        }
      }
    }
    
    // 检测是否包含TSX文件
    const hasTsxFiles = files.some(file => file.toLowerCase().endsWith('.tsx'))
    
    return NextResponse.json({
      projectId: project.id,
      title: project.title,
      description: project.description,
      files,
      mainFile: project.mainFile,
      fileContents,
      hasTsxFiles,
      views: project.views,
      createdAt: project.createdAt
    })
  } catch (error) {
    console.error(`Error fetching project ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch project' }, 
      { status: 500 }
    )
  }
} 