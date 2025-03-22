# Navbar Component

The Navbar component is a responsive navigation bar that adapts to different screen sizes. It includes a mobile menu, search functionality, and various action buttons.

## Basic Usage

```tsx
import { Navbar } from "@/components/ui/navbar";

export function App() {
  return (
    <>
      <Navbar />
      <main>
        {/* Your content here */}
      </main>
    </>
  );
}
```

## Navbar Components

The Navbar is composed of several modular components:

### NavLink

The NavLink component is used for individual navigation links.

```tsx
import { NavLink } from "@/components/ui/navbar";

export function NavigationExample() {
  return (
    <NavLink href="/dashboard" label="Dashboard" isActive={true} />
  );
}
```

### MobileMenu

The MobileMenu component is responsible for the mobile navigation experience. It uses the Sheet component to create a sliding side menu.

```tsx
import { MobileMenu } from "@/components/ui/navbar";

export function MobileNavExample() {
  return <MobileMenu />;
}
```

### SearchInput and SearchButton

The SearchInput component provides a search box with keyboard shortcut indicator, while the SearchButton is a compact alternative for mobile views.

```tsx
import { SearchInput, SearchButton } from "@/components/ui/navbar";

export function SearchExample() {
  return (
    <div>
      <SearchInput />
      <SearchButton />
    </div>
  );
}
```

## Configuration

The Navbar uses the site configuration from `config/site.ts` for navigation items, site name, and links:

```tsx
// config/site.ts
export const siteConfig = {
  name: "Your Site Name",
  navItems: [
    {
      label: "home",
      href: "/",
    },
    {
      label: "features",
      href: "/features",
    },
    {
      label: "pricing",
      href: "/pricing",
    },
    {
      label: "about",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/yourusername/your-repo",
  },
};
```

## Internationalization

The Navbar fully supports internationalization:

1. It uses the `next-intl` library for translations
2. Navigation links are automatically localized based on the current locale
3. Link paths are prefixed with the current locale

## Responsive Design

The Navbar is responsive by default:

- On desktop, it shows the full navigation menu and search input
- On mobile, it shows a hamburger menu icon that opens a side menu
- The site logo and action buttons are always visible

## Accessibility

The Navbar follows accessibility best practices:

- Proper ARIA attributes for current page indication
- Screen reader support for menu toggles
- Keyboard navigation support
- Focus management

## Customization

You can customize the Navbar by modifying the `navbar.tsx` file:

- Change the layout structure
- Add or remove components
- Modify the styling using Tailwind classes
- Update the mobile menu behavior 