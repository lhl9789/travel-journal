"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { CommandPalette } from "@/components/common/command-palette"
import { MobileNav } from "@/components/layout/mobile-nav"
import { siteConfig } from "@/config/site"
import { marketingNav } from "@/config/nav"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="mr-6 flex items-center gap-2 font-semibold">
          {siteConfig.name}
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <CommandPalette />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
