import Link from 'next/link'

import { getSiteConfig } from '@/config/site-i18n'
import { buttonVariants } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { Locale } from '@/i18n/routing'

type PageParamsPromise = Promise<{ locale: Locale }>

export default async function IndexPage({
  params,
}: {
  params: PageParamsPromise
}) {
  const { locale } = await params
  await setRequestLocale(locale)

  const t = await getTranslations('Index')
  const siteConfig = getSiteConfig(locale)
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="max-w-[66vw] truncate text-lg font-bold normal-case sm:max-w-full sm:text-3xl">
        NoStudy.ai
      </h1>
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {t('title')}
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          开始使用
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: 'outline' })}
        >
          GitHub
        </Link>
      </div>
    </section>
  )
}
