'use client'

import * as React from 'react'
import { Card } from '@/components/shadcnui/card'
import { ShineBorder } from './shine-border'
import { cn } from '@/lib/utils'

interface ShineBorderCardProps extends React.ComponentProps<typeof Card> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number
  /**
   * Color of the border, can be a single color or an array of colors
   * @default "#000000"
   */
  shineColor?: string | string[]
}

/**
 * Shine Border Card
 *
 * A card component with an animated shining border effect.
 */
export function ShineBorderCard({
  borderWidth = 1,
  duration = 14,
  shineColor = 'rgba(0, 120, 255, 0.5)',
  className,
  children,
  ...props
}: ShineBorderCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)} {...props}>
      <ShineBorder
        borderWidth={borderWidth}
        duration={duration}
        shineColor={shineColor}
      />
      {children}
    </Card>
  )
}
