import { NextRequest, NextResponse } from 'next/server'
import { generateProjectId } from '@/lib/storage'
import { sql } from '@vercel/postgres'

/**
 * 添加外部项目（通过iframe嵌入）
 */
export async function POST(request: NextRequest) {
  try {
    // 生成随机项目ID
    const projectId = generateProjectId()
    
    // 获取请求数据
    const { url, title, description, author } = await request.json()
    
    console.log('添加外部项目:', { url, title, author });
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    
    // 确保URL是正确格式
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    
    // 移除尾部斜杠以保持一致性
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    
    console.log('处理后的URL:', cleanUrl);
    
    // 构建文件数据
    const files = JSON.stringify([
      {
        filename: 'index.html',
        pathname: 'index.html',
        url: cleanUrl,
        isEntryPoint: true,
        type: 'text/html',
        size: 0
      }
    ]);
    
    // 使用@vercel/postgres直接插入数据
    try {
      const result = await sql`
        INSERT INTO projects (
          id, title, description, files, main_file, is_public, 
          external_url, external_embed, external_author, type
        ) 
        VALUES (
          ${projectId}, 
          ${title || 'External Project'}, 
          ${description || 'Project embedded from external source'}, 
          ${files}::jsonb, 
          ${'index.html'}, 
          ${true},
          ${cleanUrl},
          ${true},
          ${author || 'Unknown'},
          ${'external'}
        )
        RETURNING id, title, description
      `;
      
      console.log('项目已保存到数据库:', result);
      
      // 查询以获取完整数据
      const projectData = await sql`SELECT * FROM projects WHERE id = ${projectId}`;
      const project = projectData.rows[0];
      
      return NextResponse.json({ 
        success: true, 
        projectId,
        project
      })
    } catch (dbError: any) {
      console.error('数据库插入错误:', dbError);
      return NextResponse.json({ 
        error: 'Database insertion failed', 
        details: dbError.message 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error adding external project:', error)
    return NextResponse.json(
      { error: 'Failed to add external project' }, 
      { status: 500 }
    )
  }
} 