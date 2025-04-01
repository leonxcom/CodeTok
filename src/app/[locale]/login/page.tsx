'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Locale } from '../../../../i18n/config'

export default function LoginPage() {
  const params = useParams()
  const locale = params.locale as Locale
  
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // 模拟登录请求
    setTimeout(() => {
      alert(locale === 'zh-cn' ? '登录功能尚未实现' : 'Login functionality not implemented yet')
      setLoading(false)
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // 模拟注册请求
    setTimeout(() => {
      alert(locale === 'zh-cn' ? '注册功能尚未实现' : 'Registration functionality not implemented yet')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 标签切换 */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 font-medium transition-colors ${
                isLogin 
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsLogin(true)}
            >
              {locale === 'zh-cn' ? '登录' : 'Login'}
            </button>
            <button
              className={`flex-1 py-3 font-medium transition-colors ${
                !isLogin 
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsLogin(false)}
            >
              {locale === 'zh-cn' ? '注册' : 'Register'}
            </button>
          </div>
          
          <div className="p-6">
            {isLogin ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">
                    {locale === 'zh-cn' ? '登录到CodeTok' : 'Login to CodeTok'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {locale === 'zh-cn' 
                      ? '输入您的电子邮件和密码登录您的账户' 
                      : 'Enter your email and password to login to your account'}
                  </p>
                </div>
                
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      {locale === 'zh-cn' ? '电子邮件' : 'Email'}
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="example@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium" htmlFor="password">
                        {locale === 'zh-cn' ? '密码' : 'Password'}
                      </label>
                      <Link 
                        href={`/${locale}/forgot-password`} 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {locale === 'zh-cn' ? '忘记密码?' : 'Forgot password?'}
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading 
                      ? (locale === 'zh-cn' ? '登录中...' : 'Logging in...') 
                      : (locale === 'zh-cn' ? '登录' : 'Login')}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">
                    {locale === 'zh-cn' ? '创建账户' : 'Create an account'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {locale === 'zh-cn' 
                      ? '输入您的信息创建一个新账户' 
                      : 'Enter your information to create a new account'}
                  </p>
                </div>
                
                <form onSubmit={handleRegister}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="reg-email">
                      {locale === 'zh-cn' ? '电子邮件' : 'Email'}
                    </label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="example@example.com" 
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="username">
                      {locale === 'zh-cn' ? '用户名' : 'Username'}
                    </label>
                    <Input 
                      id="username" 
                      type="text" 
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="reg-password">
                      {locale === 'zh-cn' ? '密码' : 'Password'}
                    </label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">
                      {locale === 'zh-cn' ? '确认密码' : 'Confirm Password'}
                    </label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading 
                      ? (locale === 'zh-cn' ? '注册中...' : 'Registering...') 
                      : (locale === 'zh-cn' ? '注册' : 'Register')}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 