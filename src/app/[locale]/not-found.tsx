import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { locales, type Locale } from '../../../i18n/config'

interface Props {
  params?: { locale?: string }
}

// 添加动态加载标记，防止静态预渲染
export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function LocalizedNotFound({ params }: Props) {
  // 安全地获取locale参数，提供默认值
  const locale = (params?.locale || 'zh-cn') as Locale
  
  // 确保键类型安全的翻译对象
  const translations: Record<Locale, {
    notFound: string
    sorry: string
    backHome: string
  }> = {
    'zh-cn': {
      notFound: '页面未找到',
      sorry: '抱歉，我们找不到您要访问的页面。',
      backHome: '返回首页'
    },
    'en': {
      notFound: 'Page not found',
      sorry: 'Sorry, we couldn\'t find the page you\'re looking for.',
      backHome: 'Go back home'
    },
    'fr': {
      notFound: 'Page non trouvée',
      sorry: 'Désolé, nous n\'avons pas trouvé la page que vous recherchez.',
      backHome: 'Retour à l\'accueil'
    }
  }
  
  const t = translations[locale] || translations['zh-cn']
  
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {t.notFound}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {t.sorry}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={`/${locale}`}
            className={buttonVariants({
              variant: 'outline',
            })}
          >
            {t.backHome}
          </Link>
        </div>
      </div>
    </main>
  )
}