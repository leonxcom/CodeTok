"use client";

import { memo } from "react";
import { useLocale } from "next-intl";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { useLocaleSwitcher } from "@/i18n/client";
import { locales, localeNames, Locale } from "@/config/i18n";

const LanguageSwitchComponent = () => {
  const locale = useLocale();
  const { handleLocaleChange } = useLocaleSwitcher();

  const handleMenuAction = (key: React.Key) => {
    const newLocale = key.toString() as Locale;

    handleLocaleChange(newLocale);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="flex items-center gap-2 px-2 py-1.5 text-base font-medium rounded-md text-default-600 hover:text-primary hover:bg-default-100 dark:hover:bg-default-50/50 transition-colors whitespace-nowrap">
          {localeNames[locale as keyof typeof localeNames]}
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language options"
        className="min-w-32"
        onAction={handleMenuAction}
      >
        {locales.map((loc) => (
          <DropdownItem
            key={loc}
            className={
              locale === loc ? "text-primary font-medium" : "text-default-600"
            }
          >
            {localeNames[loc]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

LanguageSwitchComponent.displayName = "LanguageSwitch";

export default memo(LanguageSwitchComponent);
