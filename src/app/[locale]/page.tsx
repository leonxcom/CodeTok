import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { Project } from '@/db/schema';
import { generateProjectId } from '@/lib/storage';

// Force dynamic rendering for this page to ensure fresh redirects
export const dynamic = 'force-dynamic';
// Add revalidate to 0 to prevent caching
export const revalidate = 0;

// Shared cache for project IDs to improve performance across requests
// This significantly reduces database load on frequently visited pages
const projectIdsCache = {
  ids: [] as string[],
  lastFetched: 0,
  ttl: 15000, // Cache time-to-live in ms (15 seconds)
  hits: 0,
  misses: 0,
  maxSize: 100 // Maximum number of IDs to cache
};

/**
 * Homepage component - Always redirects to a random project
 * Enhanced with improved error handling, fallbacks, and caching for better performance
 */
export default async function IndexPage({
  params
}: {
  params: { locale: string };
}) {
  // Safely get locale parameter - must await dynamic params in Next.js 15
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  let redirectUrl = `/${locale}/upload`;

  // Performance measurement for debugging
  const startTime = Date.now();
  
  console.log(`[HomePage] Starting redirection process, locale: ${locale}`);

  try {
    // Try to get a random project ID from cache first (fastest path)
    const projectId = await getRandomProjectId();
    
    if (projectId) {
      // Success path - we have a project ID
      redirectUrl = `/${locale}/project/${projectId}`;
      
      // Log performance data before redirecting
      const totalTime = Date.now() - startTime;
      console.log(`[HomePage] Redirection ready in ${totalTime}ms to: ${redirectUrl} (cache ${projectIdsCache.hits}/${projectIdsCache.hits + projectIdsCache.misses})`);
      
      // Execute redirection immediately for best performance
      redirect(redirectUrl);
    }
    
    // If we get here, we couldn't find a project ID in cache or database
    // Fall back to creating an example project
    console.log(`[HomePage] No projects found, creating example project`);
    
    try {
      // Generate unique project ID
      const projectId = generateProjectId();
      
      // Create an example external project with minimal processing
      const exampleProject = {
        id: projectId,
        title: 'ThreeJS 3D Demo',
        description: 'Interactive 3D scene built with Three.js',
        files: JSON.stringify([
          {
            url: 'https://threejs-demo.vercel.app',
            pathname: 'index.html',
            filename: 'index.html',
            size: 0,
            type: 'text/html',
            isEntryPoint: true
          }
        ]),
        main_file: 'index.html',
        is_public: true,
        external_url: 'https://threejs-demo.vercel.app',
        external_embed: true,
        external_author: 'ThreeJS Team',
        type: 'external'
      };
      
      // Insert example project into database
      await sql`
        INSERT INTO projects (
          id, title, description, files, main_file, is_public, 
          external_url, external_embed, external_author, type
        ) 
        VALUES (
          ${exampleProject.id}, 
          ${exampleProject.title}, 
          ${exampleProject.description}, 
          ${exampleProject.files}::jsonb, 
          ${exampleProject.main_file}, 
          ${exampleProject.is_public},
          ${exampleProject.external_url},
          ${exampleProject.external_embed},
          ${exampleProject.external_author},
          ${exampleProject.type}
        )
      `;
      
      // Clear cache to include the new project next time
      projectIdsCache.lastFetched = 0;
      
      // Set redirect to the newly created project
      redirectUrl = `/${locale}/project/${projectId}`;
      console.log(`[HomePage] Created example project, ID: ${projectId} in ${Date.now() - startTime}ms`);
    } catch (insertError) {
      // Handle example project creation failure
      console.error(`[HomePage] Failed to create example project:`, insertError);
      console.log(`[HomePage] Falling back to upload page`);
      // Maintain default fallback to upload page
    }
  } catch (error) {
    // Enhanced error logging with error details
    console.error(`[HomePage] Error during redirection:`, error);
    console.log(`[HomePage] Falling back to upload page due to error`);
  }

  // Log final performance metrics
  const totalTime = Date.now() - startTime;
  console.log(`[HomePage] Redirection process completed in ${totalTime}ms, redirecting to: ${redirectUrl}`);
  
  // Execute redirection outside try-catch blocks
  redirect(redirectUrl);
} 

/**
 * Get a random project ID efficiently, using cache when possible
 */
async function getRandomProjectId(): Promise<string | null> {
  const now = Date.now();
  
  // Check if cache is valid
  if (projectIdsCache.ids.length > 0 && now - projectIdsCache.lastFetched < projectIdsCache.ttl) {
    projectIdsCache.hits++;
    // Return a random ID from cache (extremely fast path)
    const randomIndex = Math.floor(Math.random() * projectIdsCache.ids.length);
    return projectIdsCache.ids[randomIndex];
  }
  
  // Cache miss - need to refresh from database
  projectIdsCache.misses++;
  console.log(`[HomePage] Cache miss, fetching project IDs from database`);
  
  try {
    // Optimized query to get just the IDs we need (much faster)
    const result = await sql`
      SELECT id FROM projects 
      WHERE is_public = true 
      LIMIT ${projectIdsCache.maxSize}
    `;
    
    if (result.rowCount === 0) {
      console.log(`[HomePage] No projects found in database`);
      return null;
    }
    
    // Update cache
    projectIdsCache.ids = result.rows.map(project => project.id);
    projectIdsCache.lastFetched = now;
    
    // Return a random ID
    const randomIndex = Math.floor(Math.random() * projectIdsCache.ids.length);
    console.log(`[HomePage] Cached ${projectIdsCache.ids.length} project IDs`);
    return projectIdsCache.ids[randomIndex];
  } catch (error) {
    console.error(`[HomePage] Error fetching project IDs:`, error);
    return null;
  }
} 