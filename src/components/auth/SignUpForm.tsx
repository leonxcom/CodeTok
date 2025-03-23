'use client'

import { useState, useRef } from 'react'
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
import { Confetti } from '@/components/magicui/confetti'

// Define form schema with password validation
const formSchema = (labels: SignUpFormProps['labels']) =>
  z
    .object({
      name: z.string().min(2, {
        message: labels?.nameMinLength || '姓名长度至少为2个字符。',
      }),
      email: z.string().email({
        message: labels?.invalidEmail || '请输入有效的电子邮件地址。',
      }),
      password: z
        .string()
        .min(8, {
          message: labels?.passwordRequirements || '密码长度至少为8个字符。',
        })
        .refine(
          (password) => {
            // Check for at least one lowercase letter
            const hasLowercase = /[a-z]/.test(password)
            // Check for at least one uppercase letter
            const hasUppercase = /[A-Z]/.test(password)
            // Check for at least one number
            const hasNumber = /[0-9]/.test(password)
            // Check for at least one special character
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

            return hasLowercase && hasUppercase && hasNumber && hasSpecial
          },
          {
            message:
              labels?.passwordComplexity ||
              '密码必须包含大小写字母、数字和特殊字符。',
          },
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: labels?.passwordMismatch || '两次输入的密码不匹配。',
      path: ['confirmPassword'],
    })

// Define props
interface SignUpFormProps {
  callbackUrl?: string
  locale?: string
  labels?: {
    signUp: string
    name: string
    nameMinLength?: string
    email: string
    invalidEmail?: string
    password: string
    confirmPassword: string
    hasAccount: string
    signIn: string
    creating: string
    success: string
    passwordRequirements?: string
    passwordComplexity?: string
    passwordMismatch?: string
  }
}

export function SignUpForm({
  callbackUrl = '/',
  locale = 'zh',
  labels = {
    signUp: '注册',
    name: '姓名',
    email: '电子邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    hasAccount: '已有账号？',
    signIn: '登录',
    creating: '正在创建账号...',
    success: '注册成功！请检查您的邮箱进行验证。',
  },
}: SignUpFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Create refs for AnimatedBeam
  const containerRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<HTMLDivElement>(null)
  const toRef = useRef<HTMLDivElement>(null)

  // Define form
  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(labels)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<ReturnType<typeof formSchema>>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '注册失败')
      }

      // Show success message
      setSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/${locale}/auth/signin`)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生错误')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-md px-8 py-12" ref={containerRef}>
      <div className="hidden" ref={fromRef}></div>
      <div className="hidden" ref={toRef}></div>

      <AnimatedBeam
        className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}
      />

      {success && <Confetti />}

      <Card className="w-full bg-background/80 backdrop-blur-sm">
        <div className="px-8 py-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{labels.signUp}</h2>
          </div>

          {success ? (
            <div className="rounded-md bg-green-50 p-4 text-center text-green-800">
              <p className="text-lg font-medium">{labels.success}</p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labels.name}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="张三"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labels.email}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          autoComplete="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labels.password}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete="new-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labels.confirmPassword}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete="new-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ShimmerButton
                  type="submit"
                  className="w-full font-medium text-white"
                  disabled={isLoading}
                >
                  {isLoading ? labels.creating : labels.signUp}
                </ShimmerButton>

                <div className="text-center text-sm text-muted-foreground">
                  {labels.hasAccount}{' '}
                  <Link
                    href={`/${locale}/auth/signin`}
                    className="font-medium text-primary hover:underline"
                  >
                    {labels.signIn}
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </div>
      </Card>
    </div>
  )
}
