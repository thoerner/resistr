import { Users } from "lucide-react"
import { SkillsClient } from "@/components/skills/skills-client"
import { AppHeader } from "@/components/app-header"

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AppHeader 
        title="Skills" 
        icon={<Users className="h-8 w-8 text-purple-600" />} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <SkillsClient />
      </main>
    </div>
  )
}