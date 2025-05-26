"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { Locale } from '../../../../i18n/config'

// 语言名称映射
const languageNames: Record<string, string> = {
  'en': 'English',
  'zh-cn': '简体中文',
  'fr': 'Français'
}

export default function LanguagePage() {
  const router = useRouter()
  const params = useParams()
  const currentLocale = params.locale as string
  
  const handleLanguageChange = (locale: string) => {
    // 替换当前URL中的语言部分
    const newPath = window.location.pathname.replace(`/${currentLocale}`, `/${locale}`)
    router.push(newPath)
  }
  
  return (
    <div className="container max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold">语言切换</h1>
      </div>
      
      <div className="flex flex-col gap-4">
        {Object.entries(languageNames).map(([code, name]) => (
          <Button 
            key={code}
            variant={code === currentLocale ? 'default' : 'outline'} 
            className="w-full flex items-center justify-between py-6"
            onClick={() => handleLanguageChange(code)}
          >
            <span>{name}</span>
            {code === currentLocale && <span className="text-primary">✓</span>}
          </Button>
        ))}
      </div>
    </div>
  )
} 