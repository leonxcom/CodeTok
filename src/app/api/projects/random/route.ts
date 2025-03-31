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

// Simple in-memory cache for project IDs
// This significantly reduces database load by avoiding repeated project ID queries
const projectIdsCache = {
  ids: [] as string[],
  lastFetched: 0,
  ttl: 10000, // Cache time-to-live in ms (10 seconds)
  hits: 0,
  misses: 0,
  maxSize: 100 // Maximum number of IDs to cache
};

/**
 * GET handler for random project API endpoint
 * Enhanced with improved error handling, fallbacks, caching, and performance logging
 */
export async function GET() {
  // Performance measurement
  const startTime = Date.now();
  console.log(`[RandomAPI] Request received`);
  
  try {
    // Get a random project ID, preferably from cache
    const projectId = await getRandomProjectId();
    
    if (!projectId) {
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
    
    // Fetch only the specific project by ID (much faster than random ordering)
    const projectResult = await sql`
      SELECT * FROM projects WHERE id = ${projectId} LIMIT 1
    `;
    
    if (projectResult.rowCount === 0) {
      // ID from cache is no longer valid, refresh cache and try again next time
      projectIdsCache.lastFetched = 0;
      console.log(`[RandomAPI] Project ID ${projectId} not found, cache invalidated`);
      
      // Fallback to any project
      const fallbackProject = await sql`
        SELECT * FROM projects LIMIT 1
      `;
      
      if (fallbackProject.rowCount === 0) {
        console.log(`[RandomAPI] No projects found in fallback, returning 404`);
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
      
      const project = fallbackProject.rows[0];
      const response = prepareProjectResponse(project);
      
      // Log performance metrics
      const duration = Date.now() - startTime;
      console.log(`[RandomAPI] Fallback response prepared in ${duration}ms`);
      
      // Update views in background (don't await this)
      updateViewCount(project.id, project.views || 0)
        .catch(err => console.error(`[RandomAPI] View update error (silent):`, err));
      
      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'private, max-age=10'
        }
      });
    }
    
    // Process the found project
    const project = projectResult.rows[0];
    
    // Update views in background (don't await this - fire and forget)
    updateViewCount(project.id, project.views || 0)
      .catch(err => console.error(`[RandomAPI] View update error (silent):`, err));
    
    // Prepare response with project data (minimal processing)
    const response = prepareProjectResponse(project);
    
    // Log performance metrics
    const duration = Date.now() - startTime;
    console.log(`[RandomAPI] Response prepared in ${duration}ms (cache ${projectIdsCache.hits}/${projectIdsCache.hits + projectIdsCache.misses})`);
    
    // Return the response with short cache time to improve performance
    return NextResponse.json(response, {
      headers: {
        // Allow browser caching for 10 seconds
        'Cache-Control': 'private, max-age=10'
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
 * Get a random project ID, using cache when possible
 */
async function getRandomProjectId(): Promise<string | null> {
  const now = Date.now();
  
  // Check if cache is valid
  if (projectIdsCache.ids.length > 0 && now - projectIdsCache.lastFetched < projectIdsCache.ttl) {
    projectIdsCache.hits++;
    // Return a random ID from cache
    const randomIndex = Math.floor(Math.random() * projectIdsCache.ids.length);
    return projectIdsCache.ids[randomIndex];
  }
  
  // Cache miss - need to refresh
  projectIdsCache.misses++;
  console.log(`[RandomAPI] Cache miss, fetching project IDs`);
  
  try {
    // Get only public project IDs for better performance
    const result = await sql`
      SELECT id FROM projects 
      WHERE is_public = true 
      LIMIT ${projectIdsCache.maxSize}
    `;
    
    if (result.rowCount === 0) {
      // No projects found
      return null;
    }
    
    // Update cache
    projectIdsCache.ids = result.rows.map(project => project.id);
    projectIdsCache.lastFetched = now;
    
    // Return a random ID
    const randomIndex = Math.floor(Math.random() * projectIdsCache.ids.length);
    return projectIdsCache.ids[randomIndex];
  } catch (error) {
    console.error(`[RandomAPI] Error fetching project IDs:`, error);
    return null;
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
    console.log(`[RandomAPI] View count updated for project ${projectId}`);
  } catch (error) {
    console.error(`[RandomAPI] Error updating view count for project ${projectId}:`, error);
  }
}

/**
 * Helper function to prepare project response with minimal processing
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