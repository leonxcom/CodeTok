import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { ProjectFile } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 查询要更新的项目
    const projectResult = await sql`
      SELECT * FROM projects WHERE id = ${'dbjs2m89'}
    `;
    
    if (projectResult.rows.length === 0) {
      return NextResponse.json({ 
        error: '未找到项目' 
      }, { status: 404 });
    }
    
    // 获取项目数据
    const project = projectResult.rows[0];
    console.log('找到项目需要修复:', project.title);
    
    // 修复URL：替换 firstpersonflappv.com 为 firstpersonflappy.com
    const correctUrl = 'https://firstpersonflappy.com';
    const oldUrl = 'https://firstpersonflappv.com';
    
    // 首先更新external_url字段
    await sql`
      UPDATE projects 
      SET external_url = ${correctUrl}
      WHERE id = ${'dbjs2m89'}
    `;
    
    // 然后更新files字段中的URL
    if (project.files) {
      const projectFiles = project.files as ProjectFile[];
      
      // 更新每个文件的URL
      projectFiles.forEach(file => {
        if (file.url === oldUrl) {
          file.url = correctUrl;
        }
      });
      
      // 更新数据库中的files字段
      await sql`
        UPDATE projects 
        SET files = ${JSON.stringify(projectFiles)}::jsonb
        WHERE id = ${'dbjs2m89'}
      `;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'URL已修复',
      oldUrl,
      newUrl: correctUrl
    });
    
  } catch (error) {
    console.error('修复URL失败:', error);
    return NextResponse.json(
      { error: '修复URL失败', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 