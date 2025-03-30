import { Locale } from '../../i18n/config'

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
    name: "Vilivili",
    description: "Vilivili is an innovative platform for sharing AI projects and code applications, integrating Next.js, Tailwind CSS, ShadcnUI, designed for efficient, customizable, and multilingual project development.",
    mainNav: [],
    links: {
      twitter: "https://twitter.com/leonzeng2024",
      github: "https://github.com/leohuangbest/vilivili",
      docs: "/docs",
    },
  },
  "zh-cn": {
    name: "Vilivili",
    description: "Vilivili 是一个创新的AI项目和代码应用分享平台，集成了Next.js、Tailwind CSS和ShadcnUI，旨在高效开发可定制的多语言项目。",
    mainNav: [],
    links: {
      twitter: "https://twitter.com/leonzeng2024",
      github: "https://github.com/leohuangbest/vilivili",
      docs: "/docs",
    },
  },
  fr: {
    name: "Vilivili",
    description: "Vilivili est une plateforme innovante pour le partage de projets d'IA et d'applications de code, intégrant Next.js, Tailwind CSS et ShadcnUI, conçue pour un développement efficace de projets personnalisables et multilingues.",
    mainNav: [],
    links: {
      twitter: "https://twitter.com/leonzeng2024",
      github: "https://github.com/leohuangbest/vilivili",
      docs: "/docs",
    },
  },

  // 添加其他语言的配置...
}

export function getSiteConfig(locale: Locale): SiteConfig {
  return siteConfigBase[locale] || siteConfigBase.en;
}