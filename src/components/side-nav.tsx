"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { HomeIcon, Menu } from "lucide-react"

import { Locale } from "../../i18n/config"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SideNav() {
  const params = useParams()
  const locale = params.locale as Locale || "zh-cn"

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-5 w-5" />
          <span className="sr-only">导航</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-black text-white border-r border-gray-800">
        <SheetHeader>
          <SheetTitle className="text-white">{locale === "zh-cn" ? "导航" : "Navigation"}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <Link 
            href={`/${locale}`}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
            <span>{locale === "zh-cn" ? "首页" : "Home"}</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
} 