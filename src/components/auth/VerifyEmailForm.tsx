'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/shadcnui/card'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { ShineBorderCard } from '@/components/magicui/shine-border-card'
import { SpinningText } from '@/components/magicui/spinning-text'

interface VerifyEmailFormProps {
  locale?: string
  labels?: {
    verifyEmail: string
    verifying: string
    verifySuccess: string
    verifyFailed: string
    backToLogin: string
    signIn: string
    sendAgain: string
    sending: string
    emailSent: string
  }
}

export function VerifyEmailForm({
  locale = 'zh',
  labels = {
    verifyEmail: '验证邮箱',
    verifying: '正在验证...',
    verifySuccess: '邮箱验证成功！',
    verifyFailed: '邮箱验证失败。',
    backToLogin: '返回登录页面',
    signIn: '登录',
    sendAgain: '重新发送验证邮件',
    sending: '正在发送...',
    emailSent: '验证邮件已发送，请检查您的邮箱。',
  },
}: VerifyEmailFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>(
    'verifying',
  )
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verify email token on component mount
  useEffect(() => {
    if (token) {
      verifyEmail()
    } else {
      setIsLoading(false)
      setStatus('failed')
    }
  }, [token])

  // Verify email token
  async function verifyEmail() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '验证失败')
      }

      // Set success status
      setStatus('success')

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/${locale}/auth/signin`)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生错误')
      setStatus('failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend verification email
  async function resendVerification() {
    if (!email) return

    setIsSending(true)
    setError(null)
    setEmailSent(false)

    try {
      const response = await fetch('/api/auth/verify-email/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '发送失败')
      }

      // Set email sent status
      setEmailSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生错误')
    } finally {
      setIsSending(false)
    }
  }

  // Render content based on status
  const renderContent = () => {
    if (isLoading && status === 'verifying') {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 py-6">
          <div className="relative h-24 w-24">
            <SpinningText className="text-primary" fontSize={24}>
              {labels.verifying}
            </SpinningText>
          </div>
          <p className="text-center text-muted-foreground">
            {labels.verifying}
          </p>
        </div>
      )
    }

    if (status === 'success') {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 py-6">
          <ShineBorderCard className="w-full p-6 text-center">
            <h3 className="mb-2 text-xl font-bold text-green-600">
              {labels.verifySuccess}
            </h3>
            <p className="text-muted-foreground">{labels.backToLogin}</p>
          </ShineBorderCard>

          <div className="text-center">
            <Link
              href={`/${locale}/auth/signin`}
              className="inline-block font-medium text-primary hover:underline"
            >
              {labels.signIn}
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col space-y-6 py-6">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="rounded-md bg-amber-50 p-4 text-amber-800">
          <p className="font-medium">{labels.verifyFailed}</p>
        </div>

        {email && (
          <div className="space-y-4">
            {emailSent && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                {labels.emailSent}
              </div>
            )}

            <ShimmerButton
              onClick={resendVerification}
              className="w-full"
              disabled={isSending}
            >
              {isSending ? labels.sending : labels.sendAgain}
            </ShimmerButton>
          </div>
        )}

        <div className="text-center">
          <Link
            href={`/${locale}/auth/signin`}
            className="inline-block font-medium text-primary hover:underline"
          >
            {labels.backToLogin}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md px-8 py-12">
      <Card className="w-full overflow-hidden bg-background/80 backdrop-blur-sm">
        <div className="px-8 py-10">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold">{labels.verifyEmail}</h2>
          </div>

          {renderContent()}
        </div>
      </Card>
    </div>
  )
}
