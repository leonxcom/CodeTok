import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { migrateAll = false } = body

    // 获取所有项目
    const result = await sql`SELECT * FROM projects`;
    const allProjects = result.rows;

    // 筛选外部项目（根据是否有external_url字段判断）
    const externalProjects = allProjects.filter(project => 
      project.external_url && !project.external_embed
    );

    if (externalProjects.length === 0) {
      return NextResponse.json({
        message: 'No external projects found to migrate'
      });
    }

    // 更新项目记录
    const updateResults = await Promise.all(
      externalProjects.map(async (project) => {
        try {
          await sql`
            UPDATE projects
            SET 
              external_embed = true,
              type = 'external',
              external_author = ${project.external_author || 'External Author'}
            WHERE id = ${project.id}
          `;
          
          return {
            id: project.id,
            success: true
          };
        } catch (error) {
          console.error(`Failed to update project ${project.id}:`, error);
          return {
            id: project.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    const successCount = updateResults.filter(r => r.success).length;
    
    return NextResponse.json({
      success: true,
      migrated: successCount,
      total: externalProjects.length,
      details: updateResults
    });
  } catch (error) {
    console.error('Error migrating external projects:', error);
    return NextResponse.json(
      { error: 'Failed to migrate external projects', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 