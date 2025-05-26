import { NextRequest, NextResponse } from 'next/server'
import { generateProjectId, uploadFile, uploadCode, MAX_FILE_SIZE } from '@/lib/storage'
import { sql } from '@vercel/postgres'
import { ProjectFile } from '@/db/schema'

export const revalidate = 300; // 5分钟缓存

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get('type') || 'public';
    const limitParam = parseInt(searchParams.get('limit') || '20', 10);

    // 根据类型参数构建SQL查询
    let query;
    if (typeParam === 'all') {
      // 获取所有项目
      query = sql`
        SELECT * FROM projects 
        ORDER BY created_at DESC 
        LIMIT ${limitParam}
      `;
    } else {
      // 默认只获取公开项目
      query = sql`
        SELECT * FROM projects 
        WHERE is_public = true 
        ORDER BY created_at DESC 
        LIMIT ${limitParam}
      `;
    }
    
    // 执行查询
    const result = await query;
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
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
    
    // 将项目元数据保存到数据库 - 使用SQL直接插入
    await sql`
      INSERT INTO projects (
        id, 
        files, 
        main_file, 
        is_public, 
        created_at, 
        updated_at
      ) 
      VALUES (
        ${projectId}, 
        ${JSON.stringify(files)}::jsonb, 
        ${mainFile}, 
        true, 
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
      )
    `;
    
    return NextResponse.json({ 
      success: true, 
      projectId, 
      mainFile,
      files
    })
  } catch (error) {
    console.error('Error saving project:', error)
    return NextResponse.json(
      { error: 'Failed to process upload', details: error instanceof Error ? error.message : 'Unknown error' }, 
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