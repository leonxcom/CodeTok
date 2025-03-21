"use client";

import { memo } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

import { useTranslations } from "@/i18n/client";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import LanguageSwitch from "@/components/language-switch";
import { GithubIcon, SearchIcon, Logo } from "@/components/icons";

// 将搜索组件提取为独立组件
const SearchInput = memo(() => {
  const common = useTranslations("common");

  return (
    <Input
      aria-label={common("search")}
      classNames={{
        base: "w-[180px]",
        inputWrapper: "bg-default-100 h-10",
        input: "text-sm",
      }}
      endContent={
        <Kbd
          aria-label={common("shortcut.search")}
          className="hidden lg:inline-block"
          keys={["command"]}
        >
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder={common("searchPlaceholder")}
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );
});

SearchInput.displayName = "SearchInput";

// 将菜单项组件提取为独立组件
const NavbarLinks = memo(() => {
  const nav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  // 生成带语言前缀的链接
  const getLocalizedHref = (href: string) => {
    // 如果已经是绝对URL，则直接返回
    if (href.startsWith("http")) return href;

    // 如果href是 "/" 根路径，需要特殊处理
    if (href === "/") return `/${locale}`;

    // 否则添加语言前缀
    return `/${locale}${href}`;
  };

  const getNavLabel = (key: string) => {
    const labelMap: { [key: string]: string } = {
      "/": "home",
      "/docs": "docs",
      "/pricing": "pricing",
      "/blog": "blog",
      "/about": "about",
    };

    return nav(labelMap[key] || key);
  };

  return (
    <div className="flex items-center">
      {siteConfig.navItems.map((item) => (
        <NavbarItem key={item.href}>
          <NextLink
            className={clsx(
              linkStyles({ color: "foreground" }),
              "text-base font-medium hover:text-primary transition-colors px-3",
              "data-[active=true]:text-primary data-[active=true]:border-b-2 data-[active=true]:border-primary data-[active=true]:pb-1",
            )}
            color="foreground"
            data-active={pathname.endsWith(item.href)}
            href={getLocalizedHref(item.href)}
          >
            {getNavLabel(item.href)}
          </NextLink>
        </NavbarItem>
      ))}
    </div>
  );
});

NavbarLinks.displayName = "NavbarLinks";

// 将移动端的导航链接组件提取为独立组件
const MobileNavbarLinks = memo(() => {
  const nav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  // 生成带语言前缀的链接
  const getLocalizedHref = (href: string) => {
    // 如果已经是绝对URL，则直接返回
    if (href.startsWith("http")) return href;

    // 如果href是 "/" 根路径，需要特殊处理
    if (href === "/") return `/${locale}`;

    // 否则添加语言前缀
    return `/${locale}${href}`;
  };

  const getNavLabel = (key: string) => {
    const labelMap: { [key: string]: string } = {
      "/": "home",
      "/docs": "docs",
      "/pricing": "pricing",
      "/blog": "blog",
      "/about": "about",
    };

    return nav(labelMap[key] || key);
  };

  return (
    <div className="mx-4 mt-6 flex flex-col gap-4">
      {siteConfig.navItems.map((item) => (
        <NavbarMenuItem key={item.href}>
          <NextLink
            className={clsx(
              "text-base font-medium",
              pathname.endsWith(item.href) ? "text-primary" : "text-foreground"
            )}
            href={getLocalizedHref(item.href)}
          >
            {getNavLabel(item.href)}
          </NextLink>
        </NavbarMenuItem>
      ))}
    </div>
  );
});

MobileNavbarLinks.displayName = "MobileNavbarLinks";

// 将菜单组件提取为独立组件
const NavbarMenuItems = memo(() => {
  const nav = useTranslations("nav");

  const getMenuLabel = (label: string) => {
    // 特殊标签映射
    const menuLabelMap: { [key: string]: string } = {
      "Help & Feedback": "helpAndFeedback",
      Profile: "profile",
      Dashboard: "dashboard",
      Projects: "projects",
      Team: "team",
      Calendar: "calendar",
      Settings: "settings",
      Logout: "logout",
    };

    return nav(menuLabelMap[label] || label.toLowerCase());
  };

  return (
    <div className="mx-4 mt-4 flex flex-col gap-3">
      {siteConfig.navMenuItems.map((item, index) => (
        <NavbarMenuItem key={`${item}-${index}`}>
          <Link
            className="text-base font-medium"
            color="foreground"
            href="#"
            size="lg"
          >
            {getMenuLabel(item.label)}
          </Link>
        </NavbarMenuItem>
      ))}
    </div>
  );
});

NavbarMenuItems.displayName = "NavbarMenuItems";

// 导航栏品牌组件
const NavbarBrandComponent = memo(() => {
  const t = useTranslations("app");
  const locale = useLocale();

  // 生成带语言前缀的链接
  const getLocalizedHref = (href: string) => {
    // 如果已经是绝对URL，则直接返回
    if (href.startsWith("http")) return href;

    // 如果href是 "/" 根路径，需要特殊处理
    if (href === "/") return `/${locale}`;

    // 否则添加语言前缀
    return `/${locale}${href}`;
  };

  return (
    <NavbarBrand as="li" className="gap-3 max-w-fit">
      <NextLink
        className="flex justify-start items-center gap-2"
        href={getLocalizedHref("/")}
      >
        <Logo />
        <p className="text-lg font-bold text-inherit">{t("brandName")}</p>
      </NextLink>
    </NavbarBrand>
  );
});

NavbarBrandComponent.displayName = "NavbarBrandComponent";

// 主导航栏组件
const NavbarComponent = () => {
  return (
    <HeroUINavbar
      shouldHideOnScroll
      classNames={{
        wrapper: "max-w-full py-2 shadow-sm",
        base: "bg-background/80 backdrop-blur-md border-b border-divider",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center w-full">
        {/* 左侧: Logo */}
        <NavbarBrandComponent />

        {/* 右侧: 导航链接、搜索栏和图标组 */}
        <div className="flex items-center ml-auto gap-3">
          <div className="hidden lg:flex items-center">
            <NavbarLinks />
          </div>
          {/* 搜索栏和Github链接只在大屏幕显示 */}
          <div className="hidden lg:flex items-center gap-3">
            <SearchInput />
            <Link
              isExternal
              aria-label="Github"
              className="text-default-600 hover:text-primary"
              href={siteConfig.links.github}
            >
              <GithubIcon className="w-5 h-5" />
            </Link>
          </div>
          {/* 主题切换和语言切换在所有屏幕尺寸显示 */}
          <ThemeSwitch />
          <LanguageSwitch />

          {/* 移动端菜单按钮 */}
          <div className="lg:hidden">
            <NavbarMenuToggle />
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <NavbarMenu className="pt-6 pb-6">
        <div className="px-4">
          <SearchInput />
        </div>
        <MobileNavbarLinks />
        <div className="border-t border-divider my-4"></div>
        <NavbarMenuItems />
      </NavbarMenu>
    </HeroUINavbar>
  );
};

NavbarComponent.displayName = "NavbarComponent";

export default memo(NavbarComponent);
