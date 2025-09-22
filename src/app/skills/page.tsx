import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Plus, Shield, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { SignInDialog } from "@/components/auth/sign-in-dialog"

// Mock data for now - will be replaced with real data from Supabase
const mockSkills = [
  {
    id: "1",
    skill_tags: ["Medical", "First Aid", "EMT"],
    contact_method: "Signal: @medic123",
    is_public: true,
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "2",
    skill_tags: ["Legal", "Lawyer", "Civil Rights"],
    contact_method: "Contact through admin",
    is_public: true,
    created_at: "2024-01-09T15:30:00Z"
  },
  {
    id: "3",
    skill_tags: ["Communication", "Social Media", "Press"],
    contact_method: "Email: press@example.com",
    is_public: false,
    created_at: "2024-01-08T12:00:00Z"
  },
  {
    id: "4",
    skill_tags: ["Technical", "Web Development", "IT Support"],
    contact_method: "Signal: @tech456",
    is_public: true,
    created_at: "2024-01-07T09:15:00Z"
  },
  {
    id: "5",
    skill_tags: ["Arts & Media", "Photography", "Video"],
    contact_method: "Contact through admin",
    is_public: true,
    created_at: "2024-01-06T14:45:00Z"
  },
  {
    id: "6",
    skill_tags: ["Food & Logistics", "Cooking", "Distribution"],
    contact_method: "Signal: @food789",
    is_public: true,
    created_at: "2024-01-05T11:20:00Z"
  }
]

const skillCategories = [
  "All",
  "Medical", 
  "Legal",
  "Communication",
  "Arts & Media",
  "Technical",
  "Food & Logistics",
  "Organizing",
  "Other"
]

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
            <Link href="/events" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Events
            </Link>
            <Link href="/resources" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Resources
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
              Skill Registry
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Connect with people who have the skills you need. All participation is opt-in and privacy-focused.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Register Skills
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Privacy-First Design
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Only public skills are visible to everyone. Contact information is only shared with admins for coordination. 
                You can make your skills private or delete them at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search skills..." 
                className="pl-10"
              />
            </div>
          </div>
          <Select defaultValue="All">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {skillCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="public">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="public">Public Only</SelectItem>
              <SelectItem value="private">Private Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Skills Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockSkills.map((skill) => (
            <Card key={skill.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {skill.skill_tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardDescription className="text-sm">
                      Contact: {skill.contact_method}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    {skill.is_public ? (
                      <div title="Public">
                        <Eye className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <div title="Private">
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Contact
                  </Button>
                  <Button size="sm" variant="ghost">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockSkills.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No skills registered
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Be the first to register your skills and help connect your community.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Register First Skills
            </Button>
          </div>
        )}

        {/* Admin Section (only visible to admins) */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Admin Tools
            </h2>
            <Badge variant="outline">Admin Only</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skill Matching</CardTitle>
                <CardDescription>
                  Find people with specific skills for events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Search Skills
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Management</CardTitle>
                <CardDescription>
                  Securely connect people with needed skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Manage Contacts
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Data</CardTitle>
                <CardDescription>
                  Generate skill lists for event planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Export Skills
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}