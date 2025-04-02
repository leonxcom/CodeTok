import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { ProjectFile, ProjectData } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    console.log('获取项目详情，ID:', id)
    
    const projectResult = await sql<ProjectData>`
      SELECT * FROM projects WHERE id = ${id}
    `
    
    if (projectResult.rows.length === 0) {
      console.log('未找到项目:', id)
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    const project = projectResult.rows[0]
    console.log('成功获取项目:', project.title)
    
    try {
      await sql`
        UPDATE projects 
        SET views = COALESCE(views, 0) + 1 
        WHERE id = ${id}
      `
      console.log('[API] View count updated for project', id)
    } catch (error) {
      console.error('更新浏览量失败:', error)
    }
    
    let files: string[] = []
    let mainFileContent: string | null = null
    let hasTsxFiles = false
    
    if (project.files) {
      let projectFiles: ProjectFile[] = []
      
      if (Array.isArray(project.files)) {
        projectFiles = project.files
      } else if (typeof project.files === 'string') {
        try {
          const parsedFiles = JSON.parse(project.files)
          if (Array.isArray(parsedFiles)) {
            projectFiles = parsedFiles
          } else if (typeof parsedFiles === 'object') {
            // 处理对象格式的文件结构
            projectFiles = Object.entries(parsedFiles).map(([path, fileData]: [string, any]) => {
              const normalizedPath = path.startsWith('/') ? path.substring(1) : path
              return {
                url: '',
                filename: normalizedPath.split('/').pop() || 'index.html',
                pathname: normalizedPath,
                size: fileData.content?.length || 0,
                type: fileData.type || 'text/plain',
                content: fileData.content,
                isEntryPoint: fileData.isEntryPoint || false
              }
            })
          } else {
            console.warn('项目文件格式无效:', parsedFiles)
            projectFiles = []
          }
        } catch (error) {
          console.error('解析项目文件失败:', error)
          projectFiles = []
        }
      }
      
      if (projectFiles.length > 0) {
        files = projectFiles.map(file => file.pathname)
        hasTsxFiles = files.some(file => file.toLowerCase().endsWith('.tsx'))
        
        // 查找入口文件或使用指定的主文件
        const mainFile = projectFiles.find(file => 
          file.pathname === project.main_file || file.isEntryPoint
        )
        
        if (mainFile) {
          mainFileContent = mainFile.content || null
          if (!mainFileContent && mainFile.url) {
            try {
              const response = await fetch(mainFile.url)
              if (response.ok) {
                mainFileContent = await response.text()
              }
            } catch (error) {
              console.error(`获取主文件内容失败 ${mainFile.pathname}:`, error)
              mainFileContent = `// Error loading content: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          }
        }
      }
    }
    
    const responseData = {
      projectId: project.id,
      title: project.title,
      description: project.description,
      externalUrl: project.external_url,
      externalEmbed: project.external_embed,
      externalAuthor: project.external_author,
      type: project.type,
      files,
      mainFile: project.main_file || '',
      fileContents: mainFileContent 
        ? { [project.main_file || '']: mainFileContent } 
        : {},
      hasTsxFiles,
      views: project.views,
      createdAt: project.created_at
    }
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('获取项目失败:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    console.log('删除项目，ID:', id)
    
    const result = await sql`
      DELETE FROM projects WHERE id = ${id}
      RETURNING id
    `
    
    if (result.rowCount === 0) {
      console.log('未找到项目:', id)
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }
    
    console.log('成功删除项目:', id)
    return NextResponse.json({ 
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('删除项目失败:', error)
    return NextResponse.json(
      { error: 'Failed to delete project', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}