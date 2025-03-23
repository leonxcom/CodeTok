'use client'

import { useState } from 'react'
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
  }
}

export function SignInForm({
  callbackUrl = '/',
  locale = 'en',
  labels = {
    signIn: 'Sign In',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
  },
}: SignInFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in')
      }

      // Redirect to callback URL or homepage
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-md px-8 py-12">
      <AnimatedBeam className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2" />

      <Card className="w-full bg-background/80 backdrop-blur-sm">
        <div className="px-8 py-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{labels.signIn}</h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

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
                    <div className="flex items-center justify-between">
                      <FormLabel>{labels.password}</FormLabel>
                      <Link
                        href={`/${locale}/auth/reset-password`}
                        className="text-xs text-muted-foreground hover:text-primary"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ShimmerButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : labels.signIn}
              </ShimmerButton>

              <div className="text-center text-sm text-muted-foreground">
                {labels.noAccount}{' '}
                <Link
                  href={`/${locale}/auth/signup`}
                  className="font-medium text-primary hover:underline"
                >
                  {labels.signUp}
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  )
}
