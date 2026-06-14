"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { docsNav } from "@/config/docs"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DocsSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      {/* 모바일: Select */}
      <div className="lg:hidden mb-6">
        <Select
          value={pathname}
          onValueChange={(href) => router.push(href)}
        >
          <SelectTrigger>
            <SelectValue placeholder="섹션 선택" />
          </SelectTrigger>
          <SelectContent>
            {docsNav.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 데스크탑: 사이드바 */}
      <nav className="hidden lg:block space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          문서
        </p>
        {docsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === item.href
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </>
  )
}
