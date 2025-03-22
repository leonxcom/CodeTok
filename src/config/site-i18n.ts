import { Locale } from '@/i18n'

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
      github: 'https://github.com/LeonZeng919/nostudy.ai',
      docs: '/docs',
    },
  },
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
      github: 'https://github.com/LeonZeng919/nostudy.ai',
      docs: '/docs',
    },
  },
  fr: {
    name: 'NoStudy.ai',
    description: "NoStudy.ai - Votre assistant d'apprentissage IA",
    mainNav: [
      {
        title: 'Accueil',
        href: '/',
      },
      {
        title: 'À propos',
        href: '/about',
      },
    ],
    links: {
      twitter: 'https://twitter.com/nostudy_ai',
      github: 'https://github.com/LeonZeng919/nostudy.ai',
      docs: '/docs',
    },
  },

  // 添加其他语言的配置...
}

export function getSiteConfig(locale: Locale): SiteConfig {
  return siteConfigBase[locale] || siteConfigBase.en
}
