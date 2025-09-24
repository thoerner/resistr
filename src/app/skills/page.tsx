import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import Link from "next/link"
import { AuthButton } from "@/components/auth/auth-button"
import { SkillsClient } from "@/components/skills/skills-client"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skills</h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Home
            </Link>
            <Link href="/actions" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Actions
            </Link>
            <Link href="/resources" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Resources
            </Link>
            <ThemeToggle />
            <AuthButton />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <SkillsClient />
      </main>
    </div>
  )
}