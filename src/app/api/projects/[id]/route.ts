import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { ProjectFile } from '@/db/schema'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取项目ID - 先await params对象
    const resolvedParams = await params
    const id = resolvedParams.id
    console.log('获取项目详情，ID:', id)
    
    // 使用SQL查询获取项目
    const projectResult = await sql`
      SELECT * FROM projects WHERE id = ${id}
    `
    
    // 如果没有找到项目
    if (projectResult.rows.length === 0) {
      console.log('未找到项目:', id)
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    // 获取项目数据
    const project = projectResult.rows[0]
    console.log('成功获取项目:', project.title)
    
    // 更新访问量
    try {
      await sql`
        UPDATE projects SET views = ${(project.views || 0) + 1} WHERE id = ${id}
      `
    } catch (updateError) {
      console.error('更新访问量失败:', updateError)
      // 继续处理，不影响响应
    }
    
    // 处理文件内容
    let files: string[] = []
    let mainFileContent: string | null = null
    let hasTsxFiles = false
    
    if (project.files) {
      const projectFiles = project.files as ProjectFile[]
      files = projectFiles.map((file: ProjectFile) => file.pathname)
      
      // 检测是否包含TSX文件
      hasTsxFiles = files.some(file => file.toLowerCase().endsWith('.tsx'))
      
      // 获取主文件内容
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
    
    // 构建响应对象
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
        ? { [project.main_file]: mainFileContent } 
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
    const resolvedParams = await params
    const id = resolvedParams.id
    console.log('删除项目，ID:', id)
    
    // 使用SQL删除项目
    const result = await sql`
      DELETE FROM projects WHERE id = ${id}
      RETURNING id
    `
    
    // 如果没有找到项目
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