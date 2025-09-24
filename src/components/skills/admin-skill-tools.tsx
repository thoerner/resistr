'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Mail, 
  Users, 
  TrendingUp,
  Calendar,
  Loader2,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { useSkills } from "@/hooks/use-skills"
import { useUserRole } from "@/hooks/use-user-role"

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

export function AdminSkillTools() {
  const { skills, loading, error, updateSkill, deleteSkill } = useSkills()
  const { isAdmin } = useUserRole()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filter skills based on search and filters
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.skill_tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesVisibility = visibilityFilter === 'all' || 
      (visibilityFilter === 'public' && skill.is_public) ||
      (visibilityFilter === 'private' && !skill.is_public)
    
    return matchesSearch && matchesVisibility
  })

  // Group skills by category for analytics
  const skillStats = {
    total: skills.length,
    public: skills.filter(s => s.is_public).length,
    private: skills.filter(s => !s.is_public).length,
    withContact: skills.filter(s => s.contact_method).length,
    categories: skillCategories.slice(1).map(cat => ({
      name: cat,
      count: skills.filter(s => s.skill_tags.some(tag => tag.toLowerCase().includes(cat.toLowerCase()))).length
    }))
  }

  const handleUpdateSkill = async (skillId: string, updates: any) => {
    try {
      setActionLoading(true)
      await updateSkill(skillId, updates)
      setIsEditDialogOpen(false)
      setSelectedSkill(null)
    } catch (error) {
      console.error('Error updating skill:', error)
      alert('Failed to update skill. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    try {
      setActionLoading(true)
      await deleteSkill(skillId)
      setIsDeleteDialogOpen(false)
      setSelectedSkill(null)
    } catch (error) {
      console.error('Error deleting skill:', error)
      alert('Failed to delete skill. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleExportSkills = () => {
    const csvContent = [
      ['Skill Tags', 'Contact Method', 'Visibility', 'Created At', 'User ID'].join(','),
      ...filteredSkills.map(skill => [
        skill.skill_tags.join('; '),
        skill.contact_method || 'Admin Only',
        skill.is_public ? 'Public' : 'Private',
        new Date(skill.created_at).toLocaleDateString(),
        skill.user_id
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skills-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!isAdmin) return null

  return (
    <div className="mt-12 pt-8 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Admin Tools
        </h2>
        <Badge variant="outline">Admin Only</Badge>
      </div>

      {/* Analytics Overview */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {/* Mobile: Single row layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center space-y-1">
                <Users className="h-5 w-5 text-blue-500" />
                <p className="text-xs text-slate-600 dark:text-slate-300">Total</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{skillStats.total}</p>
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <Eye className="h-5 w-5 text-green-500" />
                <p className="text-xs text-slate-600 dark:text-slate-300">Public</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{skillStats.public}</p>
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <EyeOff className="h-5 w-5 text-orange-500" />
                <p className="text-xs text-slate-600 dark:text-slate-300">Private</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{skillStats.private}</p>
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <Mail className="h-5 w-5 text-purple-500" />
                <p className="text-xs text-slate-600 dark:text-slate-300">Contact</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{skillStats.withContact}</p>
              </div>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">Total Skills</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{skillStats.total}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">Public</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{skillStats.public}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <EyeOff className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">Private</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{skillStats.private}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">With Contact</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{skillStats.withContact}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Advanced Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Skills</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search by skill tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="public">Public Only</SelectItem>
                  <SelectItem value="private">Private Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleExportSkills} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Management */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Management</CardTitle>
          <CardDescription>
            Manage all registered skills. Edit visibility, contact methods, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredSkills.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No skills found matching your criteria.
              </div>
            ) : (
              filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {skill.skill_tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Contact: {skill.contact_method || 'Admin Only'} • 
                      Created: {new Date(skill.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={skill.is_public ? "default" : "outline"}>
                      {skill.is_public ? 'Public' : 'Private'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSkill(skill)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSkill(skill)
                            setIsContactDialogOpen(true)
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          View Contact
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => handleUpdateSkill(skill.id, { is_public: !skill.is_public })}
                        >
                          {skill.is_public ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Make Private
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Make Public
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSkill(skill)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Skill Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>
              Update skill tags, contact method, and visibility.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSkill && (
            <div className="space-y-4">
              <div>
                <Label>Skill Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkill.skill_tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Contact Method</Label>
                <Input
                  value={selectedSkill.contact_method || ''}
                  onChange={(e) => setSelectedSkill({...selectedSkill, contact_method: e.target.value})}
                  placeholder="Enter contact method"
                />
              </div>
              
              <div>
                <Label>Visibility</Label>
                <Select 
                  value={selectedSkill.is_public ? 'public' : 'private'}
                  onValueChange={(value) => setSelectedSkill({...selectedSkill, is_public: value === 'public'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedSkill && handleUpdateSkill(selectedSkill.id, {
                contact_method: selectedSkill.contact_method,
                is_public: selectedSkill.is_public
              })}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Information Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <DialogDescription>
              Contact details for skill coordination.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSkill && (
            <div className="space-y-4">
              <div>
                <Label>Skill Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkill.skill_tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Contact Method</Label>
                <p className="text-slate-900 dark:text-white">
                  {selectedSkill.contact_method || 'Contact through admin only'}
                </p>
              </div>
              
              <div>
                <Label>User ID</Label>
                <p className="text-slate-900 dark:text-white font-mono text-sm">
                  {selectedSkill.user_id}
                </p>
              </div>
              
              <div>
                <Label>Created</Label>
                <p className="text-slate-900 dark:text-white">
                  {new Date(selectedSkill.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsContactDialogOpen(false)}>
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
              Delete Skill
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this skill? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSkill && (
            <div className="py-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Skill: {selectedSkill.skill_tags.join(', ')}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Contact: {selectedSkill.contact_method || 'Admin Only'}
                </p>
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
              onClick={() => selectedSkill && handleDeleteSkill(selectedSkill.id)}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}