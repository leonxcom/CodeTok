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

/**
 * GET handler for random project API endpoint
 * Enhanced with improved error handling, fallbacks, and performance logging
 */
export async function GET() {
  // Performance measurement
  const startTime = Date.now();
  console.log(`[RandomAPI] Request received`);
  
  try {
    // Primary attempt: Get a random public project with optimized query
    console.log(`[RandomAPI] Executing primary query`);
    const randomProject = await sql`
      SELECT * FROM projects
      WHERE is_public = true
      ORDER BY RANDOM()
      LIMIT 1
    `;
    
    // If no projects found, try a fallback approach
    if (randomProject.rowCount === 0) {
      console.log(`[RandomAPI] No public projects found, attempting fallback`);
      
      // Fallback attempt: Get any project regardless of public status
      const fallbackProject = await sql`
        SELECT * FROM projects
        ORDER BY RANDOM()
        LIMIT 1
      `;
      
      if (fallbackProject.rowCount === 0) {
        console.log(`[RandomAPI] No projects found in database, returning 404`);
        return NextResponse.json({ 
          error: 'No projects found',
          message: 'No projects are currently available in the database'
        }, { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store, max-age=0'
          }
        });
      }
      
      // Use the fallback project if found
      console.log(`[RandomAPI] Using fallback project`);
      const project = fallbackProject.rows[0];
      
      // Prepare response with fallback project
      const response = prepareProjectResponse(project);
      
      // Log performance metrics
      const duration = Date.now() - startTime;
      console.log(`[RandomAPI] Fallback response prepared in ${duration}ms`);
      
      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }
    
    // Use the primary project found
    const project = randomProject.rows[0];
    
    // Asynchronously update view count without blocking response
    void updateViewCount(project.id, project.views || 0);
    
    // Prepare response with project data
    const response = prepareProjectResponse(project);
    
    // Log performance metrics
    const duration = Date.now() - startTime;
    console.log(`[RandomAPI] Primary response prepared in ${duration}ms`);
    
    // Return the response with no-cache headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    // Enhanced error logging with details
    console.error(`[RandomAPI] Error fetching random project:`, error);
    
    // Return a detailed error response
    const duration = Date.now() - startTime;
    console.log(`[RandomAPI] Error response prepared in ${duration}ms`);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch random project',
        message: error?.message || 'An unexpected error occurred',
        status: 'error'
      }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );
  }
}

/**
 * Helper function to update view count asynchronously
 */
async function updateViewCount(projectId: string, currentViews: number): Promise<void> {
  try {
    await sql`
      UPDATE projects
      SET views = ${currentViews + 1}
      WHERE id = ${projectId}
    `;
    console.log(`[RandomAPI] View count updated for project ${projectId}`);
  } catch (error) {
    console.error(`[RandomAPI] Error updating view count for project ${projectId}:`, error);
  }
}

/**
 * Helper function to prepare project response
 */
function prepareProjectResponse(project: any): ProjectResponse {
  return {
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
  };
} 