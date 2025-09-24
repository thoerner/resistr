import { Shield } from "lucide-react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AppHeader } from "@/components/app-header"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AppHeader 
        title="Admin Dashboard" 
        icon={<Shield className="h-8 w-8 text-red-600" />} 
        showAdmin={true}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
    </div>
  )
}