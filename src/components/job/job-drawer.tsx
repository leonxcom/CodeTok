"use client"

import { useTranslations } from "next-intl"
import { Briefcase } from "lucide-react"
import Link from "next/link"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { JobSidebar } from "./job-sidebar"

interface JobDrawerProps {
  locale: string
  children?: React.ReactNode
}

export function JobDrawer({ locale, children }: JobDrawerProps) {
  const t = useTranslations('Jobs')

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="ghost" size="icon" className="relative">
            <Briefcase className="h-5 w-5" />
            <span className="sr-only">{t('jobOpportunities')}</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[350px] sm:w-[450px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            {t('jobOpportunities')}
          </SheetTitle>
          <SheetDescription>
            {t('reachDevelopers')}
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          <JobSidebar locale={locale} />
        </div>
        <div className="p-4 border-t">
          <Link href={`/${locale}/jobs`} className="block">
            <Button variant="default" className="w-full">
              {t('viewAll')}
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
} 