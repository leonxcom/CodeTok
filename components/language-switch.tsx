'use client';

import { useLocale } from 'next-intl';
import { useLocaleSwitcher } from '@/i18n/client';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { locales, localeNames } from '@/config/i18n';

export default function LanguageSwitch() {
  const locale = useLocale();
  const { handleLocaleChange } = useLocaleSwitcher();

  const handleMenuAction = (key: React.Key) => {
    handleLocaleChange(key.toString());
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="flex items-center gap-2 px-2 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          {localeNames[locale as keyof typeof localeNames]}
        </button>
      </DropdownTrigger>
      <DropdownMenu onAction={handleMenuAction}>
        {locales.map((loc) => (
          <DropdownItem
            key={loc}
            className={locale === loc ? 'text-primary' : ''}
          >
            {localeNames[loc]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}