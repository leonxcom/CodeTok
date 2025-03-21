'use client';

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import LanguageSwitch from "@/components/language-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";

export default function Navbar() {
  const t = useTranslations('app');
  const nav = useTranslations('nav');
  const common = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  
  // 生成带语言前缀的链接
  const getLocalizedHref = (href: string) => {
    // 如果已经是绝对URL，则直接返回
    if (href.startsWith('http')) return href;
    
    // 如果href是 "/" 根路径，需要特殊处理
    if (href === '/') return `/${locale}`;
    
    // 否则添加语言前缀
    return `/${locale}${href}`;
  };
  
  const searchInput = (
    <Input
      aria-label={common('search')}
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]} aria-label={common('shortcut.search')}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder={common('searchPlaceholder')}
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  const getNavLabel = (key: string) => {
    const labelMap: { [key: string]: string } = {
      '/': 'home',
      '/docs': 'docs',
      '/pricing': 'pricing',
      '/blog': 'blog',
      '/about': 'about'
    };
    return nav(labelMap[key] || key);
  };

  const getMenuLabel = (label: string) => {
    // 特殊标签映射
    const menuLabelMap: { [key: string]: string } = {
      'Help & Feedback': 'helpAndFeedback',
      'Profile': 'profile',
      'Dashboard': 'dashboard',
      'Projects': 'projects',
      'Team': 'team',
      'Calendar': 'calendar',
      'Settings': 'settings',
      'Logout': 'logout'
    };
    return nav(menuLabelMap[label] || label.toLowerCase());
  };

  // 检查链接是否激活
  const isActive = (href: string) => {
    // 去掉语言前缀进行比较
    const currentPath = pathname.split('/').slice(2).join('/');
    const targetPath = href === '/' ? '' : href.replace(/^\//, '');
    return currentPath === targetPath;
  };

  return (
    <HeroUINavbar maxWidth="full" position="sticky" className="px-2 w-full">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-1 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href={getLocalizedHref('/')}>
            <Logo />
            <p className="font-bold text-inherit">{t('brandName')}</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-4">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href} className="px-0">
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={getLocalizedHref(item.href)}
                data-active={isActive(item.href)}
              >
                {getNavLabel(item.href)}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex mr-4">{searchInput}</NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <div className="flex items-center gap-3">
            <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
              <TwitterIcon className="text-default-500" />
            </Link>
            <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
              <DiscordIcon className="text-default-500" />
            </Link>
            <Link isExternal aria-label={common('github')} href={siteConfig.links.github}>
              <GithubIcon className="text-default-500" />
            </Link>
            <LanguageSwitch />
            <ThemeSwitch />
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1" justify="end">
        <Link isExternal aria-label={common('github')} href={siteConfig.links.github} className="hidden">
          <GithubIcon className="text-default-500" />
        </Link>
        <LanguageSwitch />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={getLocalizedHref(item.href)}
                size="lg"
              >
                {getMenuLabel(item.label)}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
}
