import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Locale } from '@/i18n/routing'
import { getSiteConfig } from '@/config/site-i18n'
import { setRequestLocale } from 'next-intl/server'

type PageParamsPromise = Promise<{ locale: Locale }>

export async function generateMetadata({
  params,
}: {
  params: PageParamsPromise
}): Promise<Metadata> {
  const { locale } = await params
  await setRequestLocale(locale)

  const siteConfig = getSiteConfig(locale)
  return {
    title: 'About',
    description: siteConfig.description,
  }
}

export default async function AboutPage({
  params,
}: {
  params: PageParamsPromise
}) {
  const { locale } = await params
  await setRequestLocale(locale)
  
  const t = await getTranslations({ locale, namespace: 'About' })
  
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-4">{t('description')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('mission.title')}</h2>
        <p>{t('mission.description')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('contact.title')}</h2>
        <p>{t('contact.description')}</p>
      </div>
    </main>
  )
}

