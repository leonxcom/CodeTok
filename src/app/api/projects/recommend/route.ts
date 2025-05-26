import { NextRequest, NextResponse } from 'next/server'
import { getRandomProject } from '@/services/project-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url)
    const currentId = url.searchParams.get('currentId')
    
    // 使用project-service获取随机项目
    const recommendedProject = await getRandomProject(currentId || undefined)
    
    if (!recommendedProject) {
      return NextResponse.json(
        { error: 'No projects available for recommendation' }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json(recommendedProject)
  } catch (error) {
    console.error('推荐项目失败:', error)
    return NextResponse.json(
      { 
        error: 'Failed to recommend project', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
} 