'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { Locale } from '../../../../i18n/config'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { t } from '@/utils/language-utils'

// 添加动态加载标记，防止静态预渲染
export const dynamic = 'force-dynamic'

// 扩展Input HTML属性类型以支持webkitdirectory
declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

// 扩展 InputHTMLAttributes 接口以支持目录选择属性
interface CustomInputAttributes extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
}

interface UploadPageProps {
  className?: string;
  multiple?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as Locale
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [codeInput, setCodeInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  
  const handleFilesUpload = useCallback(async (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await fetch('/api/projects', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const result = await response.json()
    return result
  }, [])
  
  const submitCode = useCallback(async (code: string) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        filename: 'index.html'
      })
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const result = await response.json()
    return result
  }, [])
  
  const handleFileInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    
    setIsUploading(true)
    setErrorMessage(null)
    
    try {
      const files = Array.from(e.target.files)
      await handleFilesUpload(files)
    } catch (error) {
      console.error('Upload error:', error)
      setErrorMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setIsUploading(false)
    }
  }, [handleFilesUpload])
  
  const handleSubmitCode = useCallback(async () => {
    if (!codeInput.trim()) {
      setErrorMessage(t(locale, {
        zh: '请输入代码',
        en: 'Please enter code',
        fr: 'Veuillez entrer du code'
      }))
      return
    }
    
    setIsUploading(true)
    setErrorMessage(null)
    
    try {
      await submitCode(codeInput)
    } catch (error) {
      console.error('Upload error:', error)
      setErrorMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setIsUploading(false)
    }
  }, [codeInput, locale, submitCode])
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        {t(locale, {
          zh: '分享你的代码',
          en: 'Share Your Code',
          fr: 'Partagez votre code'
        })}
      </h1>
      
      <div className="bg-white shadow-md rounded-lg">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-12 rounded-t-lg rounded-b-none bg-gray-100">
            <TabsTrigger value="upload" className="text-base">
              {t(locale, {
                zh: '上传文件',
                en: 'Upload',
                fr: 'Télécharger'
              })}
            </TabsTrigger>
            <TabsTrigger value="paste" className="text-base">
              {t(locale, {
                zh: '粘贴代码',
                en: 'Paste Code',
                fr: 'Coller le code'
              })}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="p-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center h-72 ${
                isUploading ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-4">
                  {t(locale, {
                    zh: '拖放你的创作',
                    en: 'Drag & Drop Your Creation',
                    fr: 'Glissez-déposez votre création'
                  })}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t(locale, {
                    zh: 'HTML或TSX文件 | 包含HTML、CSS和JS文件的文件夹（＜10 MB）',
                    en: 'HTML or TSX file | Folder with HTML, CSS, and JS files (＜10 MB)',
                    fr: 'Fichier HTML ou TSX | Dossier avec HTML, CSS et JS (＜10 MB)'
                  })}
                </p>
                
                <div className="flex flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {t(locale, {
                      zh: '选择文件',
                      en: 'Select File',
                      fr: 'Sélectionner un fichier'
                    })}
                  </Button>
                  <Button variant="outline" onClick={() => folderInputRef.current?.click()} disabled={isUploading}>
                    {t(locale, {
                      zh: '选择文件夹',
                      en: 'Select Folder',
                      fr: 'Sélectionner un dossier'
                    })}
                  </Button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".html,.tsx,.css,.js"
                  onChange={handleFileInputChange}
                />
                <input 
                  type="file" 
                  ref={folderInputRef} 
                  className="hidden" 
                  // @ts-ignore - 这些是标准但TypeScript不识别的属性
                  webkitdirectory=""
                  directory=""
                  multiple
                  onChange={handleFileInputChange}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paste" className="p-6">
            <textarea
              className="w-full h-72 p-4 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t(locale, {
                zh: '在此粘贴你的代码...',
                en: 'Paste your code here...',
                fr: 'Collez votre code ici...'
              })}
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
            <Button 
              className="w-full mt-4" 
              onClick={handleSubmitCode}
              disabled={isUploading}
            >
              {isUploading ? 
                t(locale, {
                  zh: '处理中...',
                  en: 'Processing...',
                  fr: 'Traitement en cours...'
                }) : 
                t(locale, {
                  zh: '提交',
                  en: 'Submit',
                  fr: 'Soumettre'
                })}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* 错误信息 */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-6">
          {errorMessage}
        </div>
      )}
      
      {/* 上传状态 */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-lg font-medium mb-2">
                {t(locale, {
                  zh: '处理中...',
                  en: 'Processing...',
                  fr: 'Traitement en cours...'
                })}
              </h3>
              <p className="text-gray-600">
                {t(locale, {
                  zh: '请稍候，我们正在处理您的文件',
                  en: 'Please wait while we process your files',
                  fr: 'Veuillez patienter pendant que nous traitons vos fichiers'
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}