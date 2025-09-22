import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Plus, Download, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { SignInDialog } from "@/components/auth/sign-in-dialog"

// Mock data for now - will be replaced with real data from Supabase
const mockResources = [
  {
    id: "1",
    type: "need" as const,
    category: "Medical",
    description: "First aid supplies and medical volunteers",
    claimed_by: null,
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "2",
    type: "have" as const,
    category: "Transportation", 
    description: "Van available for transportation (seats 8)",
    claimed_by: null,
    created_at: "2024-01-09T15:30:00Z"
  },
  {
    id: "3",
    type: "need" as const,
    category: "Food",
    description: "Water bottles and snacks for 50 people",
    claimed_by: "user123",
    created_at: "2024-01-08T12:00:00Z"
  },
  {
    id: "4",
    type: "have" as const,
    category: "Communication",
    description: "Walkie-talkies and portable radio equipment",
    claimed_by: null,
    created_at: "2024-01-07T09:15:00Z"
  },
  {
    id: "5",
    type: "need" as const,
    category: "Safety",
    description: "Protective gear and safety equipment",
    claimed_by: null,
    created_at: "2024-01-06T14:45:00Z"
  },
  {
    id: "6",
    type: "have" as const,
    category: "Logistics",
    description: "Tables, chairs, and event setup materials",
    claimed_by: null,
    created_at: "2024-01-05T11:20:00Z"
  }
]

const categories = ["All", "Medical", "Transportation", "Food", "Communication", "Safety", "Logistics", "Other"]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resources</h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Home
            </Link>
            <Link href="/events" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Events
            </Link>
            <Link href="/skills" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Skills
            </Link>
            <SignInDialog>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInDialog>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Resource Board
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Coordinate resources and supplies. Mark what you need or what you can provide.
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search resources..." 
                className="pl-10"
              />
            </div>
          </div>
          <Select defaultValue="All">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="need">Needed</SelectItem>
              <SelectItem value="have">Available</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resource Lists */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Needed Resources */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                Needed Resources
              </h2>
              <Badge variant="destructive">
                {mockResources.filter(r => r.type === 'need').length}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {mockResources
                .filter(resource => resource.type === 'need')
                .map((resource) => (
                  <Card key={resource.id} className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {resource.category}
                          </Badge>
                          <CardDescription>
                            {resource.description}
                          </CardDescription>
                        </div>
                        {resource.claimed_by && (
                          <Badge variant="secondary" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Claimed
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          I Can Provide This
                        </Button>
                        <Button size="sm" variant="ghost">
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Available Resources */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Available Resources
              </h2>
              <Badge variant="default">
                {mockResources.filter(r => r.type === 'have').length}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {mockResources
                .filter(resource => resource.type === 'have')
                .map((resource) => (
                  <Card key={resource.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {resource.category}
                          </Badge>
                          <CardDescription>
                            {resource.description}
                          </CardDescription>
                        </div>
                        {resource.claimed_by && (
                          <Badge variant="secondary" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Claimed
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          I Need This
                        </Button>
                        <Button size="sm" variant="ghost">
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {mockResources.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No resources listed
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Start by adding resources that are needed or available.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Resource
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}