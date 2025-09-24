"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth/auth-button"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Actions", href: "/actions" },
  { name: "Resources", href: "/resources" },
  { name: "Skills", href: "/skills" },
  { name: "Guide", href: "/guide" },
]

interface MobileNavProps {
  title?: string
  showAdmin?: boolean
}

export function MobileNav({ title = "Resistr", showAdmin = false }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden h-9 w-9 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{title} Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-slate-50/50 dark:bg-slate-800/50">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">Navigation</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              })}
              {showAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === "/admin"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Footer with Theme Toggle and Auth */}
          <div className="px-6 py-4 border-t bg-slate-50/50 dark:bg-slate-800/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-foreground">Theme</span>
                <p className="text-xs text-muted-foreground">Choose your preference</p>
              </div>
              <ThemeToggle />
            </div>
            
            {/* User Actions */}
            <div className="pt-2 space-y-3">
              <div>
                <span className="text-sm font-medium text-foreground">Account</span>
                <p className="text-xs text-muted-foreground">Manage your profile and settings</p>
              </div>
              <div className="flex flex-col space-y-2">
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}