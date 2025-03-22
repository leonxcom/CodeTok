# Mobile Navigation Component

A responsive navigation component optimized for mobile devices, built with Shadcn UI and Next.js.

## Overview

The Mobile Navigation component displays a collapsible menu button on smaller screens (below the md breakpoint), which expands to show navigation links in a dropdown menu when clicked. This component is designed to provide a better navigation experience on mobile devices while maintaining consistency with the overall UI design.

## Features

- Responsive design that only appears on mobile screens
- Collapsible menu with dropdown navigation
- Internationalization support
- Accessibility features for screen readers
- Seamless integration with the site header

## API

```typescript
interface MobileNavProps {
  items?: NavItem[] // List of navigation items
  locale: Locale // Current language environment
}
```

Where `NavItem` is defined as:

```typescript
interface NavItem {
  title: string // Navigation item title
  href?: string // Navigation item link
  disabled?: boolean // Whether the item is disabled
}
```

## Usage

```tsx
import { MobileNav } from '@/components/mobile-nav'

export function SiteHeader({ locale }) {
  // ...
  return (
    <header>
      {/* ... */}
      <MobileNav items={siteConfig.mainNav} locale={locale} />
    </header>
  )
}
```

## Implementation Details

The component uses:

- "use client" directive for client-side rendering support
- React hooks (useState) for managing component state
- Shadcn UI components (Button, DropdownMenu) for the UI
- Dynamic text based on the current locale
- Conditional display based on screen size via Tailwind CSS

## Best Practices

When using this component:

1. Always pass the current locale to ensure correct translations
2. Use it alongside the MainNav component for a complete navigation solution
3. Place it within the site header for consistent positioning
4. Ensure navigation items are consistent between MainNav and MobileNav
