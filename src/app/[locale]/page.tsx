import { Link } from '@/navigation'

import { getSiteConfig } from '@/config/site-i18n'
import { buttonVariants } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { Locale } from '../../../i18n/config'

export default async function IndexPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale as Locale;
  await setRequestLocale(locale)

  const t = await getTranslations('Index')
  const siteConfig = getSiteConfig(locale)
  return (
    <div className="mt-10"></div>
  )
}
