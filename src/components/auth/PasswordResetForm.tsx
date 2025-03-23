'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'

// Component imports
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
import { Card } from '@/components/shadcnui/card'
import { Meteors } from '@/components/magicui/meteors'

// Define form schemas
const requestResetSchema = z.object({
  email: z.string().email({
    message: '请输入有效的电子邮件地址。',
  }),
})

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: '密码长度至少为8个字符。',
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
          message: '密码必须包含大小写字母、数字和特殊字符。',
        },
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不匹配。',
    path: ['confirmPassword'],
  })

// Define props
interface PasswordResetFormProps {
  locale?: string
  labels?: {
    resetPassword: string
    email: string
    password: string
    confirmPassword: string
    sendResetLink: string
    sending: string
    resetNow: string
    resetting: string
    backToLogin: string
    signIn: string
    checkEmail: string
    resetSuccess: string
  }
}

export function PasswordResetForm({
  locale = 'zh',
  labels = {
    resetPassword: '重置密码',
    email: '电子邮箱',
    password: '新密码',
    confirmPassword: '确认新密码',
    sendResetLink: '发送重置链接',
    sending: '正在发送...',
    resetNow: '重置密码',
    resetting: '正在重置...',
    backToLogin: '返回登录页面',
    signIn: '登录',
    checkEmail: '请检查您的邮箱，我们已经发送了重置密码的链接。',
    resetSuccess: '密码重置成功！请使用新密码登录。',
  },
}: PasswordResetFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Define request reset form
  const requestResetForm = useForm<z.infer<typeof requestResetSchema>>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: '',
    },
  })

  // Define reset password form
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  // Handle request reset form submission
  async function onRequestReset(values: z.infer<typeof requestResetSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          locale,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '请求重置密码失败')
      }

      // Show success message
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生错误')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle reset password form submission
  async function onResetPassword(values: z.infer<typeof resetPasswordSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '重置密码失败')
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
    <div className="relative w-full max-w-md px-8 py-12">
      <Meteors number={20} />

      <Card className="w-full bg-background/90 backdrop-blur-sm">
        <div className="px-8 py-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{labels.resetPassword}</h2>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="rounded-md bg-green-50 p-4 text-center text-green-800">
                <p className="text-lg font-medium">
                  {token ? labels.resetSuccess : labels.checkEmail}
                </p>
              </div>

              <div className="text-center">
                <Link
                  href={`/${locale}/auth/signin`}
                  className="inline-block font-medium text-primary hover:underline"
                >
                  {labels.backToLogin}
                </Link>
              </div>
            </div>
          ) : token ? (
            // Reset password form (with token)
            <Form {...resetPasswordForm}>
              <form
                onSubmit={resetPasswordForm.handleSubmit(onResetPassword)}
                className="space-y-6"
              >
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <FormField
                  control={resetPasswordForm.control}
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
                  control={resetPasswordForm.control}
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
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? labels.resetting : labels.resetNow}
                </ShimmerButton>

                <div className="text-center text-sm text-muted-foreground">
                  <Link
                    href={`/${locale}/auth/signin`}
                    className="font-medium text-primary hover:underline"
                  >
                    {labels.backToLogin}
                  </Link>
                </div>
              </form>
            </Form>
          ) : (
            // Request reset form (no token)
            <Form {...requestResetForm}>
              <form
                onSubmit={requestResetForm.handleSubmit(onRequestReset)}
                className="space-y-6"
              >
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <FormField
                  control={requestResetForm.control}
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

                <ShimmerButton
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? labels.sending : labels.sendResetLink}
                </ShimmerButton>

                <div className="text-center text-sm text-muted-foreground">
                  <Link
                    href={`/${locale}/auth/signin`}
                    className="font-medium text-primary hover:underline"
                  >
                    {labels.backToLogin}
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
