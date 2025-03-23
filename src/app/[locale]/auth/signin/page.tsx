import { Metadata } from 'next'
import { SignInForm } from '@/components/auth'
import { getTranslations } from 'next-intl/server'
import { Locale } from '@/i18n/routing'

interface SignInPageProps {
  params: {
    locale: Locale
    [key: string]: string | string[]
  }
  searchParams: {
    callbackUrl?: string
    [key: string]: string | string[] | undefined
  }
}

export async function generateMetadata({
  params: { locale },
}: SignInPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Auth' })

  return {
    title: t('signIn'),
    description: t('signInDescription'),
  }
}

export default async function SignInPage({
  params: { locale },
  searchParams: { callbackUrl = '/' },
}: SignInPageProps) {
  const t = await getTranslations({ locale, namespace: 'Auth' })

  const labels = {
    signIn: t('signIn'),
    email: t('email'),
    password: t('password'),
    forgotPassword: t('forgotPassword'),
    noAccount: t('noAccount'),
    signUp: t('signUp'),
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignInForm locale={locale} callbackUrl={callbackUrl} labels={labels} />
    </div>
  )
}
