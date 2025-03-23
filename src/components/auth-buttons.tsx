'use client'

import Link from 'next/link'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { Locale } from '@/i18n/routing'

interface AuthButtonsProps {
  locale: Locale
  labels: {
    signin: string
    signup: string
  }
}

export function AuthButtons({ locale, labels }: AuthButtonsProps) {
  return (
    <div className="hidden items-center space-x-2 md:flex">
      <Link href={`/${locale}/auth/signin`}>
        <ShimmerButton
          className="h-9 border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          shimmerColor="rgba(120, 120, 120, 0.2)"
          background="transparent"
        >
          {labels.signin}
        </ShimmerButton>
      </Link>
      <Link href={`/${locale}/auth/signup`}>
        <ShimmerButton
          className="h-9 bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          shimmerColor="rgba(255, 255, 255, 0.3)"
          background="var(--color-primary, #2563eb)"
        >
          {labels.signup}
        </ShimmerButton>
      </Link>
    </div>
  )
}
