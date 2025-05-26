import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ErrorTypes, logError, createErrorResponse, withErrorHandling } from '@/lib/error-handler';
import { getEnvironmentInfo, validateEnvironment, logEnvironmentInfo } from '@/lib/env-config';

interface ProjectInfo {
  id: string;
  title: string;
  description: string;
  language: string;
  createdAt: string;
  size: number;
  files: Array<{ name: string; isEntry: boolean }>;
  entryFile: string;
}

// 获取所有本地项目
const getAllProjects = withErrorHandling(async (): Promise<ProjectInfo[]> => {
  const projectsDir = path.join(process.cwd(), 'tmp', 'generated-projects');
  
  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const projectDirs = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const projects: ProjectInfo[] = [];

  for (const projectId of projectDirs) {
    try {
      const projectDir = path.join(projectsDir, projectId);
      const metadataPath = path.join(projectDir, 'metadata.json');
      
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        
        // 计算项目大小
        const stats = fs.statSync(projectDir);
        let totalSize = 0;
        
        const calculateDirSize = (dirPath: string): number => {
          let size = 0;
          const items = fs.readdirSync(dirPath);
          
          for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const itemStats = fs.statSync(itemPath);
            
            if (itemStats.isDirectory()) {
              size += calculateDirSize(itemPath);
            } else {
              size += itemStats.size;
            }
          }
          
          return size;
        };
        
        totalSize = calculateDirSize(projectDir);
        
        projects.push({
          id: projectId,
          title: metadata.title,
          description: metadata.description,
          language: metadata.language,
          createdAt: metadata.createdAt,
          size: totalSize,
          files: metadata.files,
          entryFile: metadata.entryFile,
        });
      }
    } catch (error) {
      console.warn(`跳过无效项目 ${projectId}:`, error);
    }
  }

  // 按创建时间倒序排列
  return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}, { component: 'dev-tools', action: 'get_all_projects' });

// 清理旧项目
const cleanupOldProjects = withErrorHandling(async (daysOld: number = 7) => {
  const projectsDir = path.join(process.cwd(), 'tmp', 'generated-projects');
  
  if (!fs.existsSync(projectsDir)) {
    return { cleaned: 0, message: '项目目录不存在' };
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  let cleanedCount = 0;
  const projectDirs = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const projectId of projectDirs) {
    try {
      const projectDir = path.join(projectsDir, projectId);
      const metadataPath = path.join(projectDir, 'metadata.json');
      
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        const createdAt = new Date(metadata.createdAt);
        
        if (createdAt < cutoffDate) {
          // 删除整个项目目录
          fs.rmSync(projectDir, { recursive: true, force: true });
          cleanedCount++;
          console.log(`🗑️ 清理旧项目: ${projectId} (${metadata.title})`);
        }
      } else {
        // 如果没有元数据文件，检查目录创建时间
        const stats = fs.statSync(projectDir);
        if (stats.birthtime < cutoffDate) {
          fs.rmSync(projectDir, { recursive: true, force: true });
          cleanedCount++;
          console.log(`🗑️ 清理无元数据项目: ${projectId}`);
        }
      }
    } catch (error) {
      console.warn(`清理项目 ${projectId} 时出错:`, error);
    }
  }

  return { 
    cleaned: cleanedCount, 
    message: `已清理 ${cleanedCount} 个超过 ${daysOld} 天的项目` 
  };
}, { component: 'dev-tools', action: 'cleanup_old_projects' });

// 获取系统统计信息
const getSystemStats = withErrorHandling(async () => {
  const projectsDir = path.join(process.cwd(), 'tmp', 'generated-projects');
  const envInfo = getEnvironmentInfo();
  const envValidation = validateEnvironment();
  
  let stats = {
    totalProjects: 0,
    totalSize: 0,
    languageStats: {} as Record<string, number>,
    oldestProject: null as string | null,
    newestProject: null as string | null,
  };

  if (fs.existsSync(projectsDir)) {
    const projects = await getAllProjects();
    
    stats.totalProjects = projects.length;
    stats.totalSize = projects.reduce((sum, p) => sum + p.size, 0);
    
    // 语言统计
    for (const project of projects) {
      stats.languageStats[project.language] = (stats.languageStats[project.language] || 0) + 1;
    }
    
    if (projects.length > 0) {
      stats.oldestProject = projects[projects.length - 1].createdAt;
      stats.newestProject = projects[0].createdAt;
    }
  }

  return {
    environment: envInfo,
    environmentValidation: envValidation,
    projects: stats,
    diskUsage: {
      totalSize: stats.totalSize,
      totalSizeFormatted: formatFileSize(stats.totalSize),
      avgProjectSize: stats.totalProjects > 0 ? Math.round(stats.totalSize / stats.totalProjects) : 0,
    },
  };
}, { component: 'dev-tools', action: 'get_system_stats' });

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function GET(request: NextRequest) {
  try {
    logEnvironmentInfo();
    
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const daysOld = parseInt(url.searchParams.get('daysOld') || '7', 10);
    
    switch (action) {
      case 'projects':
        const projects = await getAllProjects();
        return NextResponse.json({
          success: true,
          projects,
          total: projects.length,
        });
        
      case 'cleanup':
        const cleanupResult = await cleanupOldProjects(daysOld);
        return NextResponse.json({
          success: true,
          ...cleanupResult,
        });
        
      case 'stats':
        const stats = await getSystemStats();
        return NextResponse.json({
          success: true,
          ...stats,
        });
        
      default:
        // 默认返回概览信息
        const [projectList, systemStats] = await Promise.all([
          getAllProjects(),
          getSystemStats(),
        ]);
        
        return NextResponse.json({
          success: true,
          overview: {
            totalProjects: projectList.length,
            recentProjects: projectList.slice(0, 5),
            ...systemStats,
          },
        });
    }
    
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logError(err, { component: 'dev-tools', action: 'GET' });
    return createErrorResponse(err, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    
    if (!projectId) {
      throw ErrorTypes.validation('缺少项目ID', { action: 'delete_project' });
    }
    
    const projectDir = path.join(process.cwd(), 'tmp', 'generated-projects', projectId);
    
    if (!fs.existsSync(projectDir)) {
      throw ErrorTypes.validation('项目不存在', { action: 'delete_project', metadata: { projectId } });
    }
    
    // 删除项目目录
    fs.rmSync(projectDir, { recursive: true, force: true });
    
    return NextResponse.json({
      success: true,
      message: `项目 ${projectId} 已删除`,
    });
    
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logError(err, { component: 'dev-tools', action: 'DELETE' });
    return createErrorResponse(err, 500);
  }
} 