import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

/**
 * 项目响应类型
 */
type ProjectResponse = {
  projectId: string;
  title?: string;
  description?: string;
  externalUrl?: string;
  externalEmbed?: boolean;
  externalAuthor?: string;
  type?: string;
  files: string[];
  mainFile: string;
  fileContents?: Record<string, string>;
  hasTsxFiles?: boolean;
  views?: number;
  createdAt?: Date | string;
}

export async function GET() {
  try {
    // 从数据库中随机获取一个公开项目
    const randomProject = await sql`
      SELECT * FROM projects
      WHERE is_public = true
      ORDER BY RANDOM()
      LIMIT 1
    `;
    
    // 如果没有找到项目
    if (randomProject.rowCount === 0) {
      return NextResponse.json({ 
        error: 'No projects found' 
      }, { status: 404 })
    }
    
    const project = randomProject.rows[0];
    
    // 异步更新访问量，不阻塞响应
    void (async () => {
      try {
        await sql`
          UPDATE projects
          SET views = ${(project.views || 0) + 1}
          WHERE id = ${project.id}
        `;
      } catch (error) {
        console.error(`Error updating view count for project ${project.id}:`, error);
      }
    })();
    
    // 构建响应对象
    const response: ProjectResponse = {
      projectId: project.id,
      title: project.title,
      description: project.description,
      externalUrl: project.external_url,
      externalEmbed: project.external_embed,
      externalAuthor: project.external_author,
      type: project.type,
      files: project.files ? project.files.map((file: any) => file.pathname) : [],
      mainFile: project.main_file || '',
      views: project.views,
      createdAt: project.created_at
    }
    
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching random project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch random project' }, 
      { status: 500 }
    )
  }
} 