'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Mock project type (same as in other components)
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

// This would be a server action in production
const getRandomProject = async (): Promise<Project> => {
  // Mock data for demonstration
  return {
    id: 'example-project',
    title: 'Welcome to CodeTok',
    description: 'A code sharing platform without login requirements',
    codeFiles: [
      {
        id: '1',
        filename: 'index.html',
        content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n</head>\n<body>\n  <h1>Welcome to CodeTok</h1>\n  <p>Share your code with the world!</p>\n</body>\n</html>',
        language: 'html',
        isEntryPoint: true
      }
    ]
  }
}

export default function Home() {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    const loadRandomProject = async () => {
      try {
        setLoading(true)
        const data = await getRandomProject()
        setProject(data)
      } catch (error) {
        console.error('Failed to load random project:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadRandomProject()
  }, [])
  
  const handleRandomProject = () => {
    setLoading(true)
    window.location.reload()
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CodeTok</h1>
        <div className="flex space-x-4">
          <Link 
            href="/upload" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Upload Code
          </Link>
        </div>
      </header>
      
      {project && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {project.title || 'Untitled Project'}
          </h2>
          {project.description && (
            <p className="text-gray-600 mb-6">{project.description}</p>
          )}
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 border-b flex justify-between items-center">
              <span className="text-sm font-medium">{project.codeFiles[0].filename}</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {project.codeFiles[0].language.toUpperCase()}
              </span>
            </div>
            <pre className="p-4 overflow-x-auto bg-white text-sm">
              <code>{project.codeFiles[0].content}</code>
            </pre>
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-12">
        <div className="relative inline-block">
          <Button
            variant="outline"
            onClick={handleRandomProject}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="rounded-full p-6 transition-all duration-300 flex items-center justify-center text-2xl hover:bg-primary/10"
          >
            <span className="text-3xl">🎲</span>
          </Button>
          
          {isHovered && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-3 py-1 rounded-md text-sm">
              随机前往下一个项目
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-16 pt-8 border-t text-center text-gray-500 text-sm">
        <p>Don&apos;t Keep Your Code to Yourself - Share It With the World</p>
      </footer>
    </div>
  )
} 