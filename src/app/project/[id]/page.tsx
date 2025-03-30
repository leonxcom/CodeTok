'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

// This type will be replaced by the actual Project type from your DB schema
type Project = {
  id: string
  title?: string
  description?: string
  codeFiles: {
    id: string
    filename: string
    content: string
    language: string
    isEntryPoint: boolean
  }[]
}

// Mock API call - will be replaced by actual DB query
const fetchProject = async (id: string): Promise<Project | null> => {
  // In production, this will fetch from your database
  // For now, return mock data for demonstration
  return {
    id,
    title: 'Example Project',
    description: 'This is a placeholder for project data',
    codeFiles: [
      {
        id: '1',
        filename: 'index.html',
        content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
        language: 'html',
        isEntryPoint: true
      }
    ]
  }
}

// This will update project view count
const incrementViewCount = async (id: string) => {
  // In production, this will update the view count in your database
  console.log(`Incrementing view count for project: ${id}`)
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  
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
        // Set active file to entry point or first file
        const entryPoint = data.codeFiles.find(file => file.isEntryPoint)
        setActiveFileId(entryPoint?.id || data.codeFiles[0]?.id || null)
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

  const activeFile = project.codeFiles.find(file => file.id === activeFileId) || project.codeFiles[0]
  
  return (
    <div className="container mx-auto px-4 py-8">
      {project.title && (
        <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
      )}
      
      {project.description && (
        <p className="text-gray-600 mb-8">{project.description}</p>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        {project.codeFiles.length > 1 && (
          <div className="bg-muted p-2 border-b flex gap-2">
            {project.codeFiles.map(file => (
              <button
                key={file.id}
                className={`px-3 py-1 rounded text-sm ${file.id === activeFileId ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                onClick={() => setActiveFileId(file.id)}
              >
                {file.filename}
              </button>
            ))}
          </div>
        )}
        
        <div className="relative">
          <div className="flex items-center justify-between p-2 bg-muted border-b">
            <div className="text-xs text-muted-foreground">
              {activeFile.language.toUpperCase()}
            </div>
          </div>
          
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{activeFile.content}</code>
          </pre>
        </div>
      </div>
      
      <div className="mt-8 flex space-x-4">
        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
          Random Next
        </button>
        <a href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
          Home
        </a>
      </div>
    </div>
  )
} 