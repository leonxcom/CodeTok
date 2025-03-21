/**
 * Type definitions for translation messages
 */

export interface FooterMessages {
  company: string;
  aboutUs: string;
  careers: string;
  blog: string;
  press: string;
  resources: string;
  documentation: string;
  tutorials: string;
  community: string;
  events: string;
  legal: string;
  terms: string;
  privacy: string;
  copyright: string;
  contact: string;
  rights: string;
}

export interface AppMessages {
  title: string;
  homeTitle: string;
  description: string;
  startEditing: string;
  brandName: string;
  beta: string;
  partners: string;
  corePhilosophy: string;
  corePhilosophyDesc: string;
  firstPrinciples: string;
  firstPrinciplesDesc: string;
  projectDriven: string;
  projectDrivenDesc: string;
  aiNative: string;
  aiNativeDesc: string;
  oneClickDeploy: string;
  oneClickDeployDesc: string;
  buildInPublic: string;
  buildInPublicDesc: string;
  fanConnection: string;
  fanConnectionDesc: string;
  learningPath: string;
  learningPathDesc: string;
  path1Title: string;
  path1Desc: string;
  path2Title: string;
  path2Desc: string;
  path3Title: string;
  path3Desc: string;
  startLearning: string;
  exploreAllPaths: string;
  aiLearningSystem: string;
  aiLearningSystemDesc: string;
  aiFeature1: string;
  aiFeature2: string;
  aiFeature3: string;
  aiFeature4: string;
  learnMore: string;
  practiceYourSkills: string;
  practiceDesc: string;
  practicePoint1: string;
  practicePoint2: string;
  practicePoint3: string;
  startCoding: string;
  buildPortfolio: string;
  portfolioDesc: string;
  portfolioStep1: string;
  portfolioStep2: string;
  portfolioStep3: string;
  createPortfolio: string;
  poweredBy: string;
  techStackDesc: string;
  community: string;
  communityDesc: string;
  communityFeature1: string;
  communityFeature1Desc: string;
  communityFeature2: string;
  communityFeature2Desc: string;
  communityFeature3: string;
  communityFeature3Desc: string;
  joinCommunity: string;
  testimonials: string;
  testimonial1Title: string;
  testimonial1: string;
  testimonial1Name: string;
  testimonial1Role: string;
  testimonial2Title: string;
  testimonial2: string;
  testimonial2Name: string;
  testimonial2Role: string;
  users: string;
  projects: string;
  satisfaction: string;
  hours: string;
  ready: string;
  readyDesc: string;
  getStartedCta: string;
  footer: FooterMessages;
}

export interface NavMessages {
  home: string;
  about: string;
  blog: string;
  docs: string;
  pricing: string;
  profile: string;
  dashboard: string;
  projects: string;
  team: string;
  calendar: string;
  settings: string;
  helpAndFeedback: string;
  logout: string;
}

export interface PageContent {
  content: string;
}

export interface PagesMessages {
  docs: PageContent;
  pricing: PageContent;
  blog: PageContent;
  about: PageContent;
}

export interface ShortcutMessages {
  search: string;
  command: string;
}

export interface CommonMessages {
  loading: string;
  error: string;
  retry: string;
  cancel: string;
  confirm: string;
  save: string;
  delete: string;
  edit: string;
  create: string;
  search: string;
  searchPlaceholder: string;
  shortcut: ShortcutMessages;
  more: string;
  github: string;
  sponsor: string;
  poweredBy: string;
}

export interface Messages {
  app: AppMessages;
  nav: NavMessages;
  pages: PagesMessages;
  common: CommonMessages;
}

// Type guard to check if a value is a valid Messages object
export function isMessages(value: unknown): value is Messages {
  if (!value || typeof value !== "object") return false;

  const messages = value as Messages;

  return (
    !!messages.app && !!messages.nav && !!messages.pages && !!messages.common
  );
}
