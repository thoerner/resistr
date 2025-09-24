import { Package } from "lucide-react"
import { ResourcesClient } from "@/components/resources/resources-client"
import { AppHeader } from "@/components/app-header"

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AppHeader 
        title="Resources" 
        icon={<Package className="h-8 w-8 text-green-600" />} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ResourcesClient />
      </main>
    </div>
  )
}