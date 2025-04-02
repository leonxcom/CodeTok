'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// This type will be replaced by the actual Project type from your DB schema
type Project = {
  projectId: string
  title?: string
  description?: string
  externalUrl?: string
  externalEmbed?: boolean
  externalAuthor?: string
  type?: string
  files: string[]
  mainFile: string
  fileContents: Record<string, string>
  hasTsxFiles: boolean
  views: number
  createdAt: string
}

// Mock API call - will be replaced by actual DB query
const fetchProject = async (id: string): Promise<Project | null> => {
  try {
    const response = await fetch(`/api/projects/${id}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch project')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

// This will update project view count
const incrementViewCount = async (id: string) => {
  try {
    await fetch(`/api/projects/${id}`, {
      method: 'GET'
    })
  } catch (error) {
    console.error('Error incrementing view count:', error)
  }
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFile, setActiveFile] = useState<string | null>(null)
  
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true)
        const data = await fetchProject(params.id)
        
        if (!data) {
          notFound()
          return
        }
        
        setProject(data)
        // Set active file to main file or first file
        setActiveFile(data.mainFile || data.files[0] || null)
        // Increment view count
        incrementViewCount(params.id)
      } catch (error) {
        console.error('Failed to load project:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    
    loadProject()
  }, [params.id])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  if (!project) {
    return notFound()
  }

  const currentFileContent = activeFile ? project.fileContents[activeFile] : ''
  const currentFileLanguage = activeFile?.endsWith('.tsx') ? 'tsx' : 
                            activeFile?.endsWith('.ts') ? 'ts' :
                            activeFile?.endsWith('.jsx') ? 'jsx' :
                            activeFile?.endsWith('.js') ? 'js' :
                            activeFile?.endsWith('.html') ? 'html' :
                            activeFile?.endsWith('.css') ? 'css' : 'text'
  
  return (
    <div className="container mx-auto px-4 py-8">
      {project.title && (
        <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
      )}
      
      {project.description && (
        <p className="text-gray-600 mb-8">{project.description}</p>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        {project.files.length > 1 && (
          <div className="bg-muted p-2 border-b flex gap-2">
            {project.files.map(file => (
              <button
                key={file}
                className={`px-3 py-1 rounded text-sm ${file === activeFile ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                onClick={() => setActiveFile(file)}
              >
                {file}
              </button>
            ))}
          </div>
        )}
        
        <div className="relative">
          <div className="flex items-center justify-between p-2 bg-muted border-b">
            <div className="text-xs text-muted-foreground">
              {currentFileLanguage.toUpperCase()}
            </div>
            <div className="text-xs text-muted-foreground">
              Views: {project.views}
            </div>
          </div>
          
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{currentFileContent}</code>
          </pre>
        </div>
      </div>
    </div>
  )
} 