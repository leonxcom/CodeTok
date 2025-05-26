'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

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
  const t = useTranslations('Navigation')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeContent, setCodeContent] = useState('')
  const [codeLanguage, setCodeLanguage] = useState('javascript')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // 模拟API请求
    setTimeout(() => {
      console.log({
        title,
        description,
        codeContent,
        codeLanguage
      })
      
      setIsSubmitting(false)
      // 重置表单
      setTitle('')
      setDescription('')
      setCodeContent('')
      setCodeLanguage('javascript')
      
      // 显示成功消息或重定向
      alert('代码片段上传成功！')
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">{t('upload')}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>上传代码片段</CardTitle>
            <CardDescription>
              分享你的代码以帮助其他开发者学习
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  placeholder="代码片段的标题"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  placeholder="简要描述你的代码片段的功能和用途"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Tabs defaultValue="code" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="code">编写代码</TabsTrigger>
                  <TabsTrigger value="upload">上传文件</TabsTrigger>
                </TabsList>
                
                <TabsContent value="code" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="code-language">编程语言</Label>
                      <select
                        id="code-language"
                        className="bg-background text-sm border rounded p-1"
                        value={codeLanguage}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCodeLanguage(e.target.value)}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="cpp">C++</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="php">PHP</option>
                      </select>
                    </div>
                    
                    <div className="border rounded-md">
                      <Textarea
                        className="font-mono text-sm p-4 min-h-[300px] border-0 focus-visible:ring-0 resize-none"
                        placeholder="// 在此处粘贴或编写代码"
                        value={codeContent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCodeContent(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <div className="mt-2">
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".js,.ts,.py,.java,.cs,.cpp,.go,.rs,.php"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          // 实际应用中这里会处理文件上传
                          console.log(e.target.files?.[0])
                        }}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                      >
                        选择文件
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        支持 .js, .ts, .py, .java, .cs, .cpp, .go, .rs, .php 文件
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">上传中</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  '上传代码'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}