import { Metadata } from 'next'
import { VerifyEmailForm } from '@/components/auth'
import { getTranslations } from 'next-intl/server'
import { Locale } from '@/i18n/routing'

interface VerifyEmailPageProps {
  params: {
    locale: Locale
    [key: string]: string | string[]
  }
  searchParams: {
    token?: string
    email?: string
    [key: string]: string | string[] | undefined
  }
}

export async function generateMetadata({
  params: { locale },
}: VerifyEmailPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Auth' })

  return {
    title: t('verifyEmail'),
    description: t('verifyEmailDescription'),
  }
}

export default async function VerifyEmailPage({
  params: { locale },
  searchParams: { token, email },
}: VerifyEmailPageProps) {
  const t = await getTranslations({ locale, namespace: 'Auth' })

  const labels = {
    verifyEmail: t('verifyEmail'),
    verifying: t('verifying'),
    verifySuccess: t('verificationSuccess'),
    verifyFailed: t('verificationFailed'),
    backToLogin: t('backToLogin'),
    signIn: t('signIn'),
    sendAgain: t('resendVerification'),
    sending: t('resending'),
    emailSent: t('emailSent'),
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <VerifyEmailForm locale={locale} labels={labels} />
    </div>
  )
}
