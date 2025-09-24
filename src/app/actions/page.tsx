import { Calendar } from "lucide-react"
import { ActionsClient } from "@/components/actions/actions-client"
import { AppHeader } from "@/components/app-header"

export default function ActionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AppHeader 
        title="Actions" 
        icon={<Calendar className="h-8 w-8 text-blue-600" />} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ActionsClient />
      </main>
    </div>
  )
}