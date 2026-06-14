import Link from "next/link"
import { siteConfig } from "@/config/site"

const footerLinks = {
  서비스: [
    { title: "가격", href: "/pricing" },
  ],
  회사: [
    { title: "소개", href: "/about" },
    { title: "문의", href: "mailto:hello@example.com" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <p className="font-semibold">{siteConfig.name}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              {siteConfig.description}
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-sm font-semibold">{category}</p>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
