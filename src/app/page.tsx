import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Package, Shield, Lock, Zap } from "lucide-react"
import Link from "next/link"
import { SignInDialog } from "@/components/auth/sign-in-dialog"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resist</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/events" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Events
            </Link>
            <Link href="/resources" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Resources
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            <Lock className="h-3 w-3 mr-1" />
            Privacy-First
          </Badge>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Organize. Coordinate. Resist.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            A secure, privacy-focused platform for event coordination, resource tracking, and skill mapping. 
            Built for organizers who need tools that work without compromising safety.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              View Events
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Event Hub</CardTitle>
              <CardDescription>
                Create and manage events with RSVP tracking, role assignments, and auto-generated flyers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• Anonymous RSVP options</li>
                <li>• Role-based coordination</li>
                <li>• QR code generation</li>
                <li>• Auto-purge after events</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <Package className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Resource Board</CardTitle>
              <CardDescription>
                Track what&apos;s needed and what&apos;s available in real-time with our resource coordination system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• Need/Have categorization</li>
                <li>• Real-time updates</li>
                <li>• CSV export for offline use</li>
                <li>• Claim and provide system</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Skill Registry</CardTitle>
              <CardDescription>
                Opt-in skill mapping to connect people with the right expertise when it&apos;s needed most.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• Medical, legal, tech skills</li>
                <li>• Privacy-first contact methods</li>
                <li>• Admin-managed matching</li>
                <li>• Opt-in only participation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Privacy & Security Section */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
          <div className="text-center mb-8">
            <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Privacy & Security First
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Built with the understanding that organizing requires tools that protect participants and their data.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Data Protection</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start">
                  <Lock className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  All data encrypted at rest with Supabase
                </li>
                <li className="flex items-start">
                  <Lock className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Auto-purge after 14 days (configurable)
                </li>
                <li className="flex items-start">
                  <Lock className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  One-click manual purge for admins
                </li>
                <li className="flex items-start">
                  <Lock className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  No tracking, no analytics, no third-party data
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Safety Features</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start">
                  <Shield className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Anonymous participation options
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Signal/Matrix contact recommendations
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  Minimal data collection policy
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  User-controlled data deletion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-600 dark:text-slate-300">
            <p className="mb-2">Built with privacy and security in mind.</p>
            <p className="text-sm">No tracking. No data mining. Just tools that work.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
