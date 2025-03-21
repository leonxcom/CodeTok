/**
 * Type definitions for translation messages
 */

export interface AppMessages {
  title: string;
  description: string;
  startEditing: string;
  brandName: string;
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
  if (!value || typeof value !== 'object') return false;
  
  const messages = value as Messages;
  return (
    !!messages.app &&
    !!messages.nav &&
    !!messages.pages &&
    !!messages.common
  );
} 