import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Plus } from "lucide-react"
import Link from "next/link"
import { SignInDialog } from "@/components/auth/sign-in-dialog"

// Mock data for now - will be replaced with real data from Supabase
const mockEvents = [
  {
    id: "1",
    title: "Climate Action Rally",
    description: "Join us for a peaceful demonstration demanding immediate climate action from our local government.",
    event_date: "2024-01-15T14:00:00Z",
    location: "City Hall Plaza, Downtown",
    rsvp_count: 45,
    max_attendees: 200,
    status: "upcoming"
  },
  {
    id: "2", 
    title: "Community Safety Meeting",
    description: "Organizing meeting to discuss neighborhood safety initiatives and mutual aid programs.",
    event_date: "2024-01-18T19:00:00Z",
    location: "Community Center, Room 2A",
    rsvp_count: 12,
    max_attendees: 50,
    status: "upcoming"
  },
  {
    id: "3",
    title: "Housing Rights Workshop",
    description: "Learn about tenant rights and how to organize for affordable housing in our community.",
    event_date: "2024-01-12T10:00:00Z", 
    location: "Public Library, Meeting Room B",
    rsvp_count: 28,
    max_attendees: 40,
    status: "upcoming"
  }
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Events</h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Home
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Upcoming Events
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Find and join events in your community. All events are organized with safety and privacy in mind.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {event.description}
                    </CardDescription>
                  </div>
                  <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(event.event_date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Users className="h-4 w-4 mr-2" />
                    {event.rsvp_count} / {event.max_attendees} attendees
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    View Details & RSVP
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No events scheduled
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Be the first to create an event for your community.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Event
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}