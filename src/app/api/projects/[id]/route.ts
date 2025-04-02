import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { ProjectFile } from '@/db/schema'

export const dynamic = 'force-dynamic'

interface ProjectData {
  id: string;
  title: string;
  description?: string;
  external_url?: string;
  external_embed?: boolean;
  external_author?: string;
  type?: string;
  files: any;
  main_file?: string;
  views?: number;
  created_at?: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
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
        UPDATE projects SET views = ${(project.views || 0) + 1} WHERE id = ${id}
      `
    } catch (updateError) {
      console.error('更新访问量失败:', updateError)
    }
    
    let files: string[] = []
    let mainFileContent: string | null = null
    let hasTsxFiles = false
    
    if (project.files) {
      let projectFiles: any[] = []
      
      if (Array.isArray(project.files)) {
        projectFiles = project.files
      } else if (typeof project.files === 'string') {
        try {
          const parsedFiles = JSON.parse(project.files)
          if (Array.isArray(parsedFiles)) {
            projectFiles = parsedFiles
          } else {
            console.error('项目文件格式错误 (解析后不是数组):', project.files)
          }
        } catch (error) {
          console.error('解析项目文件失败:', error)
        }
      } else if (typeof project.files === 'object' && project.files !== null) {
        try {
          if (Object.keys(project.files).length > 0) {
            projectFiles = Object.entries(project.files).map(([path, fileData]: [string, any]) => {
              const normalizedPath = path.startsWith('/') ? path.substring(1) : path
              return {
                pathname: normalizedPath,
                ...fileData,
                url: fileData.url || '',
                filename: fileData.filename || normalizedPath.split('/').pop() || 'index.html',
                size: fileData.size || 0,
                type: fileData.type || 'text/html'
              }
            })
            console.log('已将对象格式的文件转换为数组格式', projectFiles.length)
          }
        } catch (error) {
          console.error('转换项目文件对象格式失败:', error)
        }
      } else {
        console.error('未知的项目文件格式:', typeof project.files)
      }
      
      if (projectFiles.length > 0) {
        files = projectFiles.map((file: any) => file.pathname)
        hasTsxFiles = files.some(file => file.toLowerCase().endsWith('.tsx'))
        
        const mainFile = projectFiles.find(file => file.pathname === project.main_file)
        
        if (mainFile) {
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
    
    const responseData = {
      projectId: project.id,
      title: project.title,
      description: project.description,
      externalUrl: project.external_url,
      externalEmbed: project.external_embed,
      externalAuthor: project.external_author,
      type: project.type,
      files,
      mainFile: project.main_file,
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
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
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