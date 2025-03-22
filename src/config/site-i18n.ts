import { Locale } from '@/i18n/routing'

type SiteConfig = {
  name: string
  description: string
  mainNav: { title: string; href: string }[]
  links: {
    twitter: string
    github: string
    docs: string
  }
}

const siteConfigBase: Record<Locale, SiteConfig> = {
  zh: {
    name: 'NoStudy.ai',
    description: 'NoStudy.ai - 你的AI学习助手',
    mainNav: [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '关于',
        href: '/about',
      },
    ],
    links: {
      twitter: 'https://twitter.com/nostudy_ai',
      github: 'https://github.com/Nostudy-ai/nostudy.ai',
      docs: '/docs',
    },
  },
  'zh-TW': {
    name: 'NoStudy.ai',
    description: 'NoStudy.ai - 你的AI學習助手',
    mainNav: [
      {
        title: '首頁',
        href: '/',
      },
      {
        title: '關於',
        href: '/about',
      },
    ],
    links: {
      twitter: 'https://twitter.com/nostudy_ai',
      github: 'https://github.com/Nostudy-ai/nostudy.ai',
      docs: '/docs',
    },
  },
  en: {
    name: 'NoStudy.ai',
    description: 'NoStudy.ai - Your AI Learning Assistant',
    mainNav: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'About',
        href: '/about',
      },
    ],
    links: {
      twitter: 'https://twitter.com/nostudy_ai',
      github: 'https://github.com/Nostudy-ai/nostudy.ai',
      docs: '/docs',
    },
  }
}

export function getSiteConfig(locale: Locale): SiteConfig {
  return siteConfigBase[locale] || siteConfigBase.zh
}
