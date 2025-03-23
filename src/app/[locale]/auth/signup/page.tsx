import { Metadata } from 'next'
import { SignUpForm } from '@/components/auth'
import { getTranslations } from 'next-intl/server'

interface SignUpPageProps {
  params: {
    locale: string
  }
  searchParams: {
    callbackUrl?: string
  }
}

export async function generateMetadata({
  params: { locale },
}: SignUpPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Auth' })

  return {
    title: t('signUp'),
    description: t('signUpDescription'),
  }
}

export default async function SignUpPage({
  params: { locale },
  searchParams: { callbackUrl = '/' },
}: SignUpPageProps) {
  const t = await getTranslations({ locale, namespace: 'Auth' })

  const labels = {
    signUp: t('signUp'),
    name: t('name'),
    email: t('email'),
    password: t('password'),
    confirmPassword: t('confirmPassword'),
    hasAccount: t('hasAccount'),
    signIn: t('signIn'),
    creating: t('creating'),
    success: t('signUpSuccess'),
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignUpForm locale={locale} callbackUrl={callbackUrl} labels={labels} />
    </div>
  )
}
