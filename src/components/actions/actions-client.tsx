'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Plus, Loader2 } from "lucide-react"
import { useActions } from "@/hooks/use-actions"
import { CreateActionDialog } from "./create-action-dialog"

export function ActionsClient() {
  const { actions, loading, error } = useActions()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Loading actions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading actions: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Upcoming Actions
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Find and join organizing events or actions in your community. All actions are organized with safety and privacy in mind.
          </p>
        </div>
        <CreateActionDialog>
          <Button className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Organize Action
          </Button>
        </CreateActionDialog>
      </div>

      {/* Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Card key={action.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{action.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {action.description || 'No description provided'}
                  </CardDescription>
                </div>
                <Badge variant={new Date(action.event_date) > new Date() ? 'default' : 'secondary'}>
                  {new Date(action.event_date) > new Date() ? 'upcoming' : 'past'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(action.event_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(action.event_date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
                
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  {action.location || 'Location TBD'}
                </div>
                
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Users className="h-4 w-4 mr-2" />
                  Action details
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
      {actions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No actions scheduled
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Be the first to create an event or action for your community.
          </p>
            <CreateActionDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Organize First Action
              </Button>
            </CreateActionDialog>
        </div>
      )}
    </>
  )
}