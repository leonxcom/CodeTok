import { ArrowRightIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { shadcn } from '@/lib/ui'
import { cn } from '@/lib/utils'

interface BentoGridProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<'div'> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
}

export const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    className={cn(
      'row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4',
      className
    )}
    {...props}
  >
    <div className="flex flex-col gap-4 justify-start relative z-10">
      <div className="p-2 w-fit rounded-lg">{background}</div>
      <div className="transition duration-200 group-hover/bento:translate-x-1">
        <div className="font-normal text-neutral-600 dark:text-white mb-2 mt-2">
          <Icon className="h-4 w-4 inline mr-1" />
          {name}
        </div>
        <div className="font-normal text-neutral-600 text-sm dark:text-white">
          {description}
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <shadcn.Button.Button variant="link" className="gap-1 items-center" asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <span>{cta}</span>
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </shadcn.Button.Button>
    </div>
  </div>
)
