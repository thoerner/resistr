"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Calendar, Package, Users } from "lucide-react"

import { AuthButton } from "@/components/auth/auth-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"

const navigation = [
  { name: "Actions", href: "/actions" },
  { name: "Resources", href: "/resources" },
  { name: "Skills", href: "/skills" },
]

interface AppHeaderProps {
  title?: string
  icon?: React.ReactNode
  showAdmin?: boolean
}

export function AppHeader({ 
  title = "Resistr", 
  icon = <Shield className="h-8 w-8 text-blue-600" />,
  showAdmin = false 
}: AppHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            {icon}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-slate-900 dark:hover:text-white ${
                pathname === item.href
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
          {showAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-slate-900 dark:hover:text-white ${
                pathname === "/admin"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Admin
            </Link>
          )}
          <ThemeToggle />
          <AuthButton />
        </nav>

        {/* Mobile Navigation */}
        <MobileNav title={title} showAdmin={showAdmin} />
      </div>
    </header>
  )
}