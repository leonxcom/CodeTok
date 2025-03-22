"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverEffectProps = {
  children: React.ReactNode;
  className?: string;
  effect?: "lift" | "glow" | "scale" | "border" | "none";
  rounded?: boolean;
  duration?: number;
};

/**
 * Enhanced hover effect component using Framer Motion
 * 
 * @param children - Child elements to apply the hover effect to
 * @param className - Additional CSS classes
 * @param effect - Type of hover effect (lift, glow, scale, border, or none)
 * @param rounded - Whether to apply rounded corners
 * @param duration - Animation duration in seconds
 */
export const MagicHover = ({
  children,
  className,
  effect = "lift",
  rounded = false,
  duration = 0.2,
}: HoverEffectProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getEffectStyles = () => {
    switch (effect) {
      case "lift":
        return {
          y: isHovered ? -5 : 0,
          boxShadow: isHovered
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)"
            : "0 0 0 0 rgba(0, 0, 0, 0)",
        };
      case "glow":
        return {
          boxShadow: isHovered
            ? "0 0 20px 2px rgba(74, 222, 128, 0.3)"
            : "0 0 0 0 rgba(0, 0, 0, 0)",
        };
      case "scale":
        return {
          scale: isHovered ? 1.02 : 1,
        };
      case "border":
        return {
          outline: isHovered ? "2px solid rgba(74, 222, 128, 0.5)" : "0px solid transparent",
          outlineOffset: isHovered ? "3px" : "0px",
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={cn(
        "transition-all",
        rounded && "rounded-lg",
        className
      )}
      animate={getEffectStyles()}
      transition={{ duration }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </motion.div>
  );
};

export default MagicHover; 