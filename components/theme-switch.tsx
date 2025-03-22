"use client";

import { FC, memo } from "react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { cn } from "@/lib/utils";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import { Switch } from "@/components/ui/switch";

export interface ThemeSwitchProps {
  className?: string;
}

const ThemeSwitchComponent: FC<ThemeSwitchProps> = ({
  className,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isLight = theme === "light" || isSSR;
  
  const handleChange = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center transition-colors",
        className
      )}
    >
      <VisuallyHidden>
        <label htmlFor="theme-switch">
          Switch to {isLight ? "dark" : "light"} mode
        </label>
      </VisuallyHidden>
      
      <div className="flex items-center justify-center !text-default-600 hover:text-primary">
        {isLight ? (
          <SunFilledIcon size={24} />
        ) : (
          <MoonFilledIcon size={24} />
        )}
      </div>
      
      <Switch
        id="theme-switch"
        checked={isLight}
        onCheckedChange={handleChange}
        className="hidden" // Hide the actual switch but keep functionality
        aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      />
    </div>
  );
};

export const ThemeSwitch = memo(ThemeSwitchComponent);
