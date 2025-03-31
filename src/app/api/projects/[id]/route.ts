import { NextRequest, NextResponse } from 'next/server'
import { db, safeQuery, projects } from '@/db'
import { eq } from 'drizzle-orm'
import { ProjectFile } from '@/db/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 先使用await处理params对象
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
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
    
    // 异步更新访问量，不阻塞响应
    void (async () => {
      await safeQuery(async () => {
        if (db) {
          await db.update(projects)
            .set({ views: (project.views || 0) + 1 })
            .where(eq(projects.id, id))
        }
      }, null)
    })()
    
    // 获取文件列表
    let files: string[] = []
    let mainFileContent: string | null = null
    let hasTsxFiles = false
    
    if (project.files) {
      const projectFiles = project.files as ProjectFile[]
      files = projectFiles.map((file: ProjectFile) => file.pathname)
      
      // 检测是否包含TSX文件
      hasTsxFiles = files.some(file => file.toLowerCase().endsWith('.tsx'))
      
      // 先返回基本项目信息和主文件内容
      const mainFile = projectFiles.find(file => file.pathname === project.mainFile)
      
      if (mainFile) {
        try {
          const response = await fetch(mainFile.url)
          if (response.ok) {
            mainFileContent = await response.text()
          }
        } catch (error: any) {
          console.error(`Error fetching main file ${mainFile.pathname}:`, error)
          mainFileContent = `// Error loading content: ${error}`
        }
      }
      
      // 构建初始响应对象
      const initialResponse = {
        projectId: project.id,
        title: project.title,
        description: project.description,
        externalUrl: project.externalUrl,
        externalEmbed: project.externalEmbed,
        externalAuthor: project.externalAuthor,
        type: project.type,
        files,
        mainFile: project.mainFile,
        fileContents: mainFileContent 
          ? { [project.mainFile as string]: mainFileContent } 
          : {},
        hasTsxFiles,
        views: project.views,
        createdAt: project.createdAt
      }
      
      // 先返回基本信息和主文件内容
      return NextResponse.json(initialResponse)
    }
    
    // 如果没有文件，则返回基本项目信息
    return NextResponse.json({
      projectId: project.id,
      title: project.title,
      description: project.description,
      externalUrl: project.externalUrl,
      externalEmbed: project.externalEmbed,
      externalAuthor: project.externalAuthor,
      type: project.type,
      files: [],
      mainFile: project.mainFile || '',
      fileContents: {},
      hasTsxFiles: false,
      views: project.views,
      createdAt: project.createdAt
    })
  } catch (error: any) {
    // 在错误处理中也使用await处理params
    const resolvedParams = await params;
    console.error(`Error fetching project ${resolvedParams.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch project' }, 
      { status: 500 }
    )
  }
} 