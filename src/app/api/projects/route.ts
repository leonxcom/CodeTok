import { NextRequest, NextResponse } from 'next/server'
import { generateProjectId, uploadFile, uploadCode, MAX_FILE_SIZE } from '@/lib/storage'
import { eq } from 'drizzle-orm'
import db, { safeQuery, projects } from '@/db'
import { ProjectFile } from '@/db/schema'

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    
    // 从数据库获取项目
    const allProjects = await safeQuery(async () => {
      if (!db) return []
      
      // 根据参数查询项目
      let query = db.select().from(projects);
      
      // 如果类型不是 'all'，只返回公开项目
      if (type !== 'all') {
        query = query.where(eq(projects.isPublic, true));
      }
      
      // 限制返回数量并按创建时间倒序排列
      const results = await query.limit(limit).orderBy(projects.createdAt, 'desc');
      return results;
    }, [])
    
    return NextResponse.json(allProjects)
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 生成随机项目ID
    const projectId = generateProjectId()
    
    // 检查内容类型以确定处理方式
    const contentType = request.headers.get('content-type') || ''
    
    // 存储文件并获取元数据
    let mainFile: string = ''
    let files: ProjectFile[] = []
    
    if (contentType.includes('multipart/form-data')) {
      // 处理文件上传
      const formData = await request.formData()
      const uploadedFiles = formData.getAll('files') as File[]
      
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return NextResponse.json({ error: 'No files provided' }, { status: 400 })
      }
      
      let totalSize = 0
      
      // 处理并保存所有文件
      for (const file of uploadedFiles) {
        totalSize += file.size
        
        if (totalSize > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: 'Files exceed maximum allowed size of 10MB' }, 
            { status: 400 }
          )
        }
        
        // 提取文件路径（如果是文件夹上传）
        let filePath = ''
        if (file.name.includes('/')) {
          filePath = file.name.substring(0, file.name.lastIndexOf('/'))
        }
        
        // 上传到Vercel Blob
        const result = await uploadFile(file, projectId, filePath)
        
        // 将文件添加到列表
        const fileDetails: ProjectFile = {
          url: result.url,
          filename: file.name,
          pathname: filePath ? `${filePath}/${file.name}` : file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          isEntryPoint: isEntryPoint(file.name)
        }
        
        files.push(fileDetails)
        
        // 设置主文件
        if (fileDetails.isEntryPoint && !mainFile) {
          mainFile = fileDetails.pathname
        }
      }
      
      // 如果没有明确的入口文件，选择第一个HTML或TSX文件
      if (!mainFile) {
        const htmlFile = files.find(file => file.pathname.endsWith('.html'))
        const tsxFile = files.find(file => file.pathname.endsWith('.tsx'))
        mainFile = htmlFile?.pathname || tsxFile?.pathname || files[0]?.pathname || ''
      }
    } 
    else if (contentType.includes('application/json')) {
      // 处理代码文本提交
      const { code, filename = 'index.html' } = await request.json()
      
      if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 })
      }
      
      if (Buffer.byteLength(code, 'utf8') > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'Code exceeds maximum allowed size of 10MB' }, 
          { status: 400 }
        )
      }
      
      // 上传到Vercel Blob
      const result = await uploadCode(code, projectId, filename)
      
      // 将文件添加到列表
      const fileDetails: ProjectFile = {
        url: result.url,
        filename: filename,
        pathname: filename,
        size: result.size,
        type: result.type,
        isEntryPoint: true
      }
      
      files.push(fileDetails)
      mainFile = filename
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 })
    }
    
    // 将项目元数据保存到数据库
    await safeQuery(async () => {
      if (db) {
        await db.insert(projects).values({
          id: projectId,
          files,
          mainFile,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }, null)
    
    return NextResponse.json({ 
      success: true, 
      projectId, 
      mainFile,
      files
    })
  } catch (error: any) {
    console.error('Error saving project:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' }, 
      { status: 500 }
    )
  }
}

/**
 * 检查文件是否为入口点
 */
function isEntryPoint(filename: string): boolean {
  return filename === 'index.html' || 
         filename === 'index.tsx' || 
         filename === 'index.jsx' || 
         filename === 'index.js'
} 