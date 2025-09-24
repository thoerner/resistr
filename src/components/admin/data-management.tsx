'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSystemData } from "@/hooks/use-system-data"
import { getUserDisplayName, getAdminDisplayName } from "@/lib/user-display"
import { Database, Search, MoreHorizontal, Trash2, Eye, Loader2, AlertTriangle, Users, Calendar, Package, Wrench, TrendingUp, Activity } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DataManagement() {
  const { 
    stats, 
    actions, 
    rsvps, 
    resources, 
    skills, 
    loading, 
    error, 
    deleteAction, 
    deleteResource, 
    deleteSkill 
  } = useSystemData()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'rsvps' | 'resources' | 'skills'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<unknown>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = async (type: 'action' | 'resource' | 'skill', id: string) => {
    try {
      setActionLoading(true)
      
      switch (type) {
        case 'action':
          await deleteAction(id)
          break
        case 'resource':
          await deleteResource(id)
          break
        case 'skill':
          await deleteSkill(id)
          break
      }
      
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      alert(`Failed to delete ${type}. Please try again.`)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 text-purple-500 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading system data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 text-purple-500 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertTriangle className="h-8 w-8 mr-2" />
            <span>Error loading data: {error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 text-purple-500 mr-2" />
          Data Management
        </CardTitle>
        <CardDescription>
          View and manage all system data. Monitor activity and system health.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'actions', label: 'Actions', icon: Calendar },
              { id: 'rsvps', label: 'RSVPs', icon: Users },
              { id: 'resources', label: 'Resources', icon: Package },
              { id: 'skills', label: 'Skills', icon: Wrench }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'overview' | 'actions' | 'rsvps' | 'resources' | 'skills')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center cursor-pointer ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* System Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Total Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">{stats.totalActions}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Total Actions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">{stats.totalResources}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Total Resources</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Wrench className="h-8 w-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">{stats.totalSkills}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Total Skills</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Statistics */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Users by Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Admin</span>
                      <Badge variant="default">{stats.usersByRole.admin}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Verified</span>
                      <Badge variant="secondary">{stats.usersByRole.verified}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Public</span>
                      <Badge variant="outline">{stats.usersByRole.public}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Resources by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Needs</span>
                      <Badge variant="destructive">{stats.resourcesByType.need}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Available</span>
                      <Badge variant="default">{stats.resourcesByType.have}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.recentActivity.recentUsers}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">New Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.recentActivity.recentActions}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">New Actions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.recentActivity.recentRSVPs}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">New RSVPs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Tables */}
        {activeTab !== 'overview' && (
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Actions Table */}
            {activeTab === 'actions' && (
              <div className="space-y-3">
                {actions
                  .filter(action => 
                    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    action.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    action.location?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {action.title}
                        </div>
                        <div className="text-sm text-slate-500">
                          {action.location} • {formatDate(action.event_date)}
                        </div>
                        <div className="text-sm text-slate-500">
                          Created by {action.creator_email} • {action.rsvp_count} RSVPs
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(action)
                              setIsDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem({ type: 'action', data: action })
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Action
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
              </div>
            )}

            {/* RSVPs Table */}
            {activeTab === 'rsvps' && (
              <div className="space-y-3">
                {rsvps
                  .filter(rsvp => 
                    rsvp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rsvp.anonymous_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rsvp.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rsvp.event_title?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((rsvp) => (
                    <div
                      key={rsvp.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {getUserDisplayName({
                            id: rsvp.user_id || '',
                            username: null, // We don't have username in RSVP data yet
                            email: rsvp.user_email || undefined,
                            anonymous_name: rsvp.anonymous_name
                          })}
                        </div>
                        <div className="text-sm text-slate-500">
                          Role: {rsvp.role} • Action: {rsvp.action_title}
                        </div>
                        <div className="text-sm text-slate-500">
                          RSVP&apos;d on {formatDate(rsvp.created_at)}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(rsvp)
                              setIsDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
              </div>
            )}

            {/* Resources Table */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                {resources
                  .filter(resource => 
                    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    resource.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    resource.action_title?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={resource.type === 'need' ? 'destructive' : 'default'}>
                            {resource.type}
                          </Badge>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {resource.category}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          {resource.description}
                        </div>
                        <div className="text-sm text-slate-500">
                          By {resource.user_email} • {resource.action_title && `Action: ${resource.action_title}`}
                          {resource.claimed_by_email && ` • Claimed by ${resource.claimed_by_email}`}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(resource)
                              setIsDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem({ type: 'resource', data: resource })
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Resource
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
              </div>
            )}

            {/* Skills Table */}
            {activeTab === 'skills' && (
              <div className="space-y-3">
                {skills
                  .filter(skill => 
                    skill.skill_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    skill.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    skill.contact_method?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {skill.user_email || 'Anonymous'}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {skill.skill_tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-slate-500">
                          {skill.contact_method && `Contact: ${skill.contact_method}`}
                          {skill.is_public && ' • Public'}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(skill)
                              setIsDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem({ type: 'skill', data: skill })
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Skill
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Item Details</DialogTitle>
              <DialogDescription>
                View detailed information about this item
              </DialogDescription>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <pre className="text-sm bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(selectedItem, null, 2)}
                </pre>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Delete {selectedItem?.type}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {selectedItem?.type}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedItem && (
              <div className="py-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <pre className="text-sm text-red-800 dark:text-red-200 overflow-x-auto">
                    {JSON.stringify(selectedItem.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedItem && handleDelete(selectedItem.type, selectedItem.data.id)}
                disabled={actionLoading}
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Delete {selectedItem?.type}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}