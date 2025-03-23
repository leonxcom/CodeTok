'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'

// Component imports
import { Button } from '@/components/shadcnui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcnui/form'
import { Input } from '@/components/shadcnui/input'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { AnimatedBeam } from '@/components/magicui/animated-beam'
import { Card } from '@/components/shadcnui/card'

// Define form schema
const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
})

// Define props
interface SignInFormProps {
  callbackUrl?: string
  locale?: string
  labels?: {
    signIn: string
    email: string
    password: string
    forgotPassword: string
    noAccount: string
    signUp: string
    invalidCredentials?: string
    emailNotVerified?: string
    signInSuccess?: string
    generalError?: string
  }
}

export function SignInForm({
  callbackUrl = '/',
  locale = 'en',
  labels = {
    signIn: 'Sign In',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
  },
}: SignInFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string>('')

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Create refs for AnimatedBeam
  const containerRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<HTMLDivElement>(null)
  const toRef = useRef<HTMLDivElement>(null)

  // 在组件挂载时获取CSRF令牌
  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const response = await fetch('/api/auth/csrf')
        const data = await response.json()
        setCsrfToken(data.csrfToken)
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err)
      }
    }

    fetchCsrfToken()
  }, [])

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'Invalid credentials') {
          throw new Error(labels?.invalidCredentials || '邮箱或密码不正确')
        } else if (data.error === 'Email not verified') {
          throw new Error(labels?.emailNotVerified || '请先验证您的邮箱')
        } else {
          throw new Error(data.error || data.message || '登录失败，请稍后重试')
        }
      }

      const successMessage = labels?.signInSuccess || '登录成功'
      console.log(successMessage)

      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 在表单重置时清除错误
  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) setError(null)
    })
    return () => subscription.unsubscribe()
  }, [form, error])

  return (
    <div className="relative w-full max-w-md px-8" ref={containerRef}>
      <div className="hidden" ref={fromRef}></div>
      <div className="hidden" ref={toRef}></div>

      <AnimatedBeam
        className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2"
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}
      />

      <Card className="border-gray-200 bg-white/95 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-gray-900/90">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6"
          >
            <div className="mb-4 space-y-2 text-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {labels?.signIn || '登录'}
              </h1>
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    {labels.email}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      {labels.password}
                    </FormLabel>
                    <Link
                      href={`/${locale}/auth/reset-password`}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-white"
                    >
                      {labels.forgotPassword}
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <ShimmerButton
              type="submit"
              className="w-full bg-blue-600 font-medium text-white hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : labels.signIn}
            </ShimmerButton>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {labels.noAccount}{' '}
              <Link
                href={`/${locale}/auth/signup`}
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {labels.signUp}
              </Link>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}
