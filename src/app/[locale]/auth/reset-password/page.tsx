import { Metadata } from 'next'
import { PasswordResetForm } from '@/components/auth'
import { getTranslations } from 'next-intl/server'
import { Locale } from '@/i18n/routing'

type Params = Promise<{
  locale: Locale
  [key: string]: string | string[]
}>

type SearchParams = Promise<{
  token?: string
  [key: string]: string | string[] | undefined
}>

interface PasswordResetPageProps {
  params: Params
  searchParams: SearchParams
}

export async function generateMetadata({
  params,
  searchParams,
}: PasswordResetPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Auth' })

  return {
    title: t('resetPassword'),
    description: t('resetPasswordDescription'),
  }
}

export default async function PasswordResetPage({
  params,
  searchParams,
}: PasswordResetPageProps) {
  const { locale } = await params
  const { token } = await searchParams
  const t = await getTranslations({ locale, namespace: 'Auth' })

  const labels = {
    resetPassword: t('resetPassword'),
    email: t('email'),
    password: t('password'),
    confirmPassword: t('confirmPassword'),
    sendResetLink: t('sendResetLink'),
    sending: t('sending'),
    resetNow: t('resetNow'),
    resetting: t('resetting'),
    backToLogin: t('backToLogin'),
    signIn: t('signIn'),
    checkEmail: t('checkEmail'),
    resetSuccess: t('resetSuccess'),
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <PasswordResetForm locale={locale} labels={labels} />
    </div>
  )
}
