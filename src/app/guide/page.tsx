import { Shield, Calendar, Package, Users, ArrowLeft, CheckCircle, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AppHeader 
        title="Resistr Guide" 
        icon={<Shield className="h-8 w-8 text-blue-600" />} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Getting Started with Resistr
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl">
            A comprehensive guide to using Resistr for secure, privacy-focused action coordination and community organizing.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Quick Start (5 minutes)
            </CardTitle>
            <CardDescription>
              Get up and running with Resistr in just a few steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold">Sign Up</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Create an account using email/password or magic link authentication
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold">Explore Actions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Browse upcoming actions and RSVP with your role (medical, safety, logistics, general)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold">Contribute Resources</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Mark what you need or what you can provide on the resource board
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold">Register Skills</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Opt-in to register your skills for community coordination
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Features */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Actions */}
          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Action Hub</CardTitle>
              <CardDescription>
                Create, manage, and participate in actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">For Participants:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Browse upcoming actions</li>
                    <li>• RSVP with your role</li>
                    <li>• View action details and requirements</li>
                    <li>• Anonymous participation options</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Organizers:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Create detailed action listings</li>
                    <li>• Track RSVPs by role</li>
                    <li>• Generate QR codes and flyers</li>
                    <li>• Auto-purge after actions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <Package className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Resource Board</CardTitle>
              <CardDescription>
                Coordinate supplies and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Need vs. Have:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Mark what you need</li>
                    <li>• Offer what you can provide</li>
                    <li>• Real-time updates</li>
                    <li>• Claim and provide system</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Categories:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Medical supplies</li>
                    <li>• Transportation</li>
                    <li>• Food & water</li>
                    <li>• Safety equipment</li>
                    <li>• Communication tools</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Skill Registry</CardTitle>
              <CardDescription>
                Connect people with needed expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Privacy-First:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Opt-in only participation</li>
                    <li>• Minimal information required</li>
                    <li>• Secure contact methods</li>
                    <li>• Admin-managed matching</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Skill Categories:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Medical (first aid, EMT)</li>
                    <li>• Legal (lawyer, observer)</li>
                    <li>• Communication (social media)</li>
                    <li>• Technical (IT, electronics)</li>
                    <li>• Logistics (transport, food)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy & Security */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <Shield className="h-5 w-5 mr-2" />
              Privacy & Security Features
            </CardTitle>
            <CardDescription>
              Built with safety and privacy as core principles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Data Protection</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li>• All data encrypted at rest</li>
                  <li>• No tracking or analytics</li>
                  <li>• Minimal data collection</li>
                  <li>• User-controlled data deletion</li>
                  <li>• Auto-purge after actions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Safety Features</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li>• Anonymous participation options</li>
                  <li>• Secure contact methods (Signal)</li>
                  <li>• One-click data purge for admins</li>
                  <li>• No persistent logging</li>
                  <li>• Communication safety guidelines</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="mb-8 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-600">
              <Info className="h-5 w-5 mr-2" />
              Best Practices
            </CardTitle>
            <CardDescription>
              Tips for safe and effective organizing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Communication Safety</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li>• Use Signal for sensitive conversations</li>
                  <li>• Avoid sharing personal details publicly</li>
                  <li>• Use anonymous names when possible</li>
                  <li>• Verify contact information through admins</li>
                  <li>• Be cautious with location data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Action Organization</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li>• Create actions with clear roles and requirements</li>
                  <li>• Use RSVP system to track capacity</li>
                  <li>• Coordinate resources in advance</li>
                  <li>• Have backup plans for key roles</li>
                  <li>• Purge data after actions for safety</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mb-8 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Troubleshooting
            </CardTitle>
            <CardDescription>
              Common issues and solutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Can&apos;t sign in?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Try using the magic link option instead of password. Check your email spam folder for the authentication link.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Don&apos;t see admin features?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Admin features are only visible to users with admin role. Contact an existing admin to get promoted.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Skills not showing up?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Make sure your skills are marked as &quot;public&quot; if you want them visible to everyone. Private skills are only visible to admins.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Need help?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Contact your action organizers or admins for assistance. They can help with account issues and feature access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Sign up now and start organizing safely and effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/actions">
                <Button size="lg" className="text-lg px-8">
                  Browse Actions
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  View Resources
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}