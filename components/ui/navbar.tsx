"use client";

import { memo, useRef, useState } from "react";
import NextLink from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { MenuIcon, X } from "lucide-react";

import { ThemeSwitch } from "@/components/theme-switch";
import LanguageSwitch from "@/components/language-switch";
import { GithubIcon, SearchIcon, Logo } from "@/components/icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";

type NavLinkProps = {
  href: string;
  label: string;
  isActive?: boolean;
};

export const NavLink = memo(({ href, label, isActive }: NavLinkProps) => {
  const locale = useLocale();
  
  // Generate link with locale prefix
  const getLocalizedHref = (href: string) => {
    // If it's already an absolute URL, return it directly
    if (href.startsWith("http")) return href;

    // If href is root path "/", special handling is needed
    if (href === "/") return `/${locale}`;

    return `/${locale}${href}`;
  };

  return (
    <NextLink
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}
      href={getLocalizedHref(href)}
    >
      {label}
    </NextLink>
  );
});

NavLink.displayName = "NavLink";

// Extract search icon component as a standalone component
export const SearchButton = memo(() => {
  const common = useTranslations("common");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={common("search")}
      onClick={handleSearchClick}
      className="text-muted-foreground hover:text-foreground"
    >
      <SearchIcon className="h-5 w-5" />
    </Button>
  );
});

SearchButton.displayName = "SearchButton";

// Extract search component as a standalone component
export const SearchInput = memo(() => {
  const common = useTranslations("common");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        placeholder={common("searchPlaceholder")}
        className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px]"
        aria-label={common("search")}
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground lg:block">
        ⌘K
      </kbd>
    </div>
  );
});

SearchInput.displayName = "SearchInput";

// NavbarLinks component for desktop view
export const NavbarLinks = memo(() => {
  const nav = useTranslations("nav");
  const pathname = usePathname();

  const isActive = (href: string) => {
    // For homepage
    if (href === "/" && pathname.split("/").length === 2) {
      return true;
    }
    
    // For other pages
    return pathname.includes(href) && href !== "/";
  };

  return (
    <nav className="hidden md:flex gap-6 items-center">
      {siteConfig.navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={nav(item.label)}
          isActive={isActive(item.href)}
        />
      ))}
    </nav>
  );
});

NavbarLinks.displayName = "NavbarLinks";

// Mobile menu component
export const MobileMenu = () => {
  const nav = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    // For homepage
    if (href === "/" && pathname.split("/").length === 2) {
      return true;
    }
    
    // For other pages
    return pathname.includes(href) && href !== "/";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex items-center justify-between">
            <NextLink 
              href={`/${locale}`} 
              className="flex items-center gap-1"
              onClick={() => setOpen(false)}
            >
              <Logo className="h-7 w-7" />
              <span className="font-bold">{siteConfig.name}</span>
            </NextLink>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            {siteConfig.navItems.map((item) => (
              <NextLink
                key={item.href}
                href={`/${locale}${item.href === "/" ? "" : item.href}`}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                {nav(item.label)}
              </NextLink>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

MobileMenu.displayName = "MobileMenu";

// Main Navbar component
const NavbarComponent = () => {
  const locale = useLocale();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <MobileMenu />
          <NextLink href={`/${locale}`} className="flex items-center gap-1">
            <Logo className="h-7 w-7" />
            <span className="font-bold">{siteConfig.name}</span>
          </NextLink>
        </div>
        
        <NavbarLinks />
        
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SearchInput />
          </div>
          <div className="flex items-center gap-2">
            <SearchButton />
            <ThemeSwitch />
            <LanguageSwitch />
            <Button variant="ghost" size="icon" asChild>
              <NextLink
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </NextLink>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Navbar = memo(NavbarComponent); 