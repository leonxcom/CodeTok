import { NextRequest, NextResponse } from 'next/server'
import { ProjectFile, ProjectData } from '@/types'
import { db, sql } from '@/db'
import { getProjectById } from '@/services/project-service'

export const revalidate = 300; // 5分钟缓存

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    console.log('[ProjectAPI] 获取项目详情，ID:', id)
    
    let project = null;
    
    try {
      // 先尝试从数据库查询项目
      const result = await sql`
        SELECT * FROM projects 
        WHERE id = ${id}
      `;
      
      if (result.rowCount && result.rowCount > 0 && result.rows[0]) {
        project = result.rows[0];
        console.log('[ProjectAPI] 从数据库获取项目:', project.title);
      }
    } catch (dbError) {
      console.warn(`[ProjectAPI] 数据库查询失败，使用模拟数据:`, dbError);
    }
    
    // 如果数据库查询失败，使用项目服务的模拟数据
    if (!project) {
      console.log(`[ProjectAPI] 使用模拟数据作为后备方案`);
      const mockProject = await getProjectById(id);
      
      if (mockProject) {
        // 转换为数据库格式
        project = {
          id: mockProject.id,
          title: mockProject.title,
          description: mockProject.description,
          external_url: mockProject.externalUrl,
          external_embed: true,
          external_author: mockProject.authorName,
          type: 'external',
          files: JSON.stringify([{
            filename: 'index.html',
            pathname: 'index.html',
            type: 'text/html',
            url: mockProject.externalUrl
          }]),
          main_file: 'index.html',
          is_public: true,
          views: mockProject.views || 0,
          created_at: mockProject.createdAt
        };
        console.log('[ProjectAPI] 使用模拟项目:', project.title);
      }
    }
    
    if (!project) {
      console.log('[ProjectAPI] 未找到项目:', id)
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }

    console.log('[ProjectAPI] 成功获取项目:', project.title)
    
    // 解析文件
    let fileArray = [];
    try {
      if (project.files) {
        const filesData = typeof project.files === 'string' ? JSON.parse(project.files) : project.files;
        fileArray = Array.isArray(filesData) ? filesData : [];
        
        // 如果不是数组，尝试从对象中提取数组
        if (fileArray.length === 0 && filesData && typeof filesData === 'object') {
          console.log('[ProjectAPI] 尝试从对象中提取文件数组');
          // 处理可能的对象格式
          if (filesData.files && Array.isArray(filesData.files)) {
            fileArray = filesData.files;
          } else {
            // 如果没有数组，创建一个只有index.html的默认文件数组
            fileArray = [{
              filename: 'index.html',
              pathname: 'index.html',
              type: 'text/html'
            }];
          }
        }
      } else {
        // 如果没有文件数据，创建默认文件
        fileArray = [{
          filename: 'index.html',
          pathname: 'index.html',
          type: 'text/html'
        }];
      }
    } catch (e) {
      console.error('[ProjectAPI] 解析文件时出错:', e);
      // 出错时使用默认文件
      fileArray = [{
        filename: 'index.html',
        pathname: 'index.html',
        type: 'text/html'
      }];
    }
    
    // 准备文件内容
    const fileContents: Record<string, string> = {};
    if (fileArray.length > 0) {
      fileArray.forEach((file: any) => {
        const filename = file.filename || file.pathname;
        if (filename) {
          // 对于外部链接，直接使用URL
          if (file.url) {
            fileContents[filename] = file.url;
          } else if (file.content) {
            fileContents[filename] = file.content;
          } else {
            fileContents[filename] = '// 文件内容将在项目详情页面加载';
          }
        }
      });
    }
    
    // 确定主文件
    const mainFile = project.main_file || 
                     (fileArray.length > 0 ? (fileArray[0].filename || fileArray[0].pathname || 'index.html') : 'index.html');
    
    // 构建响应数据
    const responseData = {
      projectId: project.id,
      title: project.title,
      description: project.description,
      externalUrl: project.external_url,
      externalEmbed: project.external_embed,
      externalAuthor: project.external_author,
      type: project.type,
      files: fileArray.map((f: any) => f.filename || f.pathname || 'index.html'),
      mainFile: mainFile,
      fileContents: fileContents,
      hasTsxFiles: fileArray.some((f: any) => (f.filename || '').endsWith('.tsx') || (f.pathname || '').endsWith('.tsx')),
      views: project.views || 0,
      createdAt: project.created_at
    }
    
    // 异步更新浏览量，不等待结果
    updateViewCount(project.id, project.views || 0).catch(e => 
      console.error(`[ProjectAPI] Error updating view count: ${e}`)
    );
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('[ProjectAPI] 获取项目失败:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    console.log('删除项目，ID:', id)
    
    // 从数据库删除项目 - 使用sql标签函数替代db模板字符串
    const result = await sql`
      DELETE FROM projects 
      WHERE id = ${id}
      RETURNING id
    `;
    
    if (result.rowCount === 0) {
      return NextResponse.json({ 
        error: 'Project not found or could not be deleted'
      }, { status: 404 });
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

/**
 * Helper function to update view count asynchronously
 * This runs in the background and doesn't block the response
 */
async function updateViewCount(projectId: string, currentViews: number): Promise<void> {
  try {
    await sql`
      UPDATE projects
      SET views = ${currentViews + 1}
      WHERE id = ${projectId}
    `;
    console.log(`[ProjectAPI] View count updated for project ${projectId}`);
  } catch (error) {
    console.error(`[ProjectAPI] Error updating view count for project ${projectId}:`, error);
  }
}