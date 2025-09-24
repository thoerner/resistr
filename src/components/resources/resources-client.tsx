'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Plus, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useResources } from "@/hooks/use-resources"
import { CreateResourceDialog } from "./create-resource-dialog"

const categories = ["All", "Medical", "Transportation", "Food", "Communication", "Safety", "Logistics", "Other"]

export function ResourcesClient() {
  const { neededResources, availableResources, loading, error } = useResources()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Loading resources...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading resources: {error}</p>
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
            <CreateResourceDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Share Resource
              </Button>
            </CreateResourceDialog>
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
              {neededResources.length}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {neededResources.map((resource) => (
                <Card key={resource.id} className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {resource.category}
                          </Badge>
                          {/* Verification Status */}
                          {resource.users?.role === 'public' && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                              Unverified
                            </Badge>
                          )}
                          {resource.users?.role === 'verified' && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              ✓ Verified
                            </Badge>
                          )}
                          {resource.users?.role === 'admin' && (
                            <Badge variant="default" className="text-xs bg-blue-600">
                              👑 Admin
                            </Badge>
                          )}
                        </div>
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
              {availableResources.length}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {availableResources.map((resource) => (
                <Card key={resource.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {resource.category}
                          </Badge>
                          {/* Verification Status */}
                          {resource.users?.role === 'public' && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                              Unverified
                            </Badge>
                          )}
                          {resource.users?.role === 'verified' && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              ✓ Verified
                            </Badge>
                          )}
                          {resource.users?.role === 'admin' && (
                            <Badge variant="default" className="text-xs bg-blue-600">
                              👑 Admin
                            </Badge>
                          )}
                        </div>
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
      {neededResources.length === 0 && availableResources.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No resources listed
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Start by adding resources that are needed or available.
          </p>
            <CreateResourceDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Share First Resource
              </Button>
            </CreateResourceDialog>
        </div>
      )}
    </>
  )
}