"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Laptop } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ThemePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const t = useTranslations('Common')
  
  // 在客户端渲染时才设置mounted为true
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 防止水合错误
  if (!mounted) {
    return null
  }
  
  const handleBack = () => {
    router.back()
  }
  
  return (
    <div className="container max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold">主题: 跟随系统</h1>
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          variant={theme === 'system' ? 'default' : 'outline'} 
          className="w-full flex items-center justify-between py-6"
          onClick={() => setTheme('system')}
        >
          <div className="flex items-center gap-3">
            <Laptop className="h-5 w-5" />
            <span>系统</span>
          </div>
          {theme === 'system' && <span className="text-primary">✓</span>}
        </Button>
        
        <Button 
          variant={theme === 'light' ? 'default' : 'outline'} 
          className="w-full flex items-center justify-between py-6"
          onClick={() => setTheme('light')}
        >
          <div className="flex items-center gap-3">
            <Sun className="h-5 w-5" />
            <span>亮色</span>
          </div>
          {theme === 'light' && <span className="text-primary">✓</span>}
        </Button>
        
        <Button 
          variant={theme === 'dark' ? 'default' : 'outline'} 
          className="w-full flex items-center justify-between py-6"
          onClick={() => setTheme('dark')}
        >
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5" />
            <span>暗色</span>
          </div>
          {theme === 'dark' && <span className="text-primary">✓</span>}
        </Button>
      </div>
    </div>
  )
} 