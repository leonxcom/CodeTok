import { NextRequest, NextResponse } from 'next/server'
import { db, safeQuery, projects } from '@/db'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { migrateAll = false } = body

    // 确保数据库已连接
    if (!db) {
      return NextResponse.json({
        error: 'Database not connected'
      }, { status: 500 })
    }

    // 获取所有项目
    const allProjects = await safeQuery(async () => {
      if (!db) return []
      const results = await db.select().from(projects)
      return results
    }, [])

    // 筛选外部项目（根据是否有externalUrl字段判断）
    const externalProjects = allProjects.filter(project => 
      project.externalUrl && !project.externalEmbed
    )

    if (externalProjects.length === 0) {
      return NextResponse.json({
        message: 'No external projects found to migrate'
      })
    }

    // 更新项目记录
    const updateResults = await Promise.all(
      externalProjects.map(async (project) => {
        try {
          if (!db) throw new Error('Database not connected')
          
          await db.update(projects)
            .set({
              externalEmbed: true,
              type: 'external',
              externalAuthor: project.externalAuthor || 'External Author'
            })
            .where(eq(projects.id, project.id))
          
          return {
            id: project.id,
            success: true
          }
        } catch (error: any) {
          console.error(`Failed to update project ${project.id}:`, error)
          return {
            id: project.id,
            success: false,
            error: error.message
          }
        }
      })
    )

    const successCount = updateResults.filter(r => r.success).length
    
    return NextResponse.json({
      success: true,
      migrated: successCount,
      total: externalProjects.length,
      details: updateResults
    })
  } catch (error: any) {
    console.error('Error migrating external projects:', error)
    return NextResponse.json(
      { error: 'Failed to migrate external projects', details: error.message }, 
      { status: 500 }
    )
  }
} 