'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Search, Plus, Shield, Eye, EyeOff, Loader2, Mail, Share2 } from "lucide-react"
import { useSkills } from "@/hooks/use-skills"
import { useUserRole } from "@/hooks/use-user-role"
import { CreateSkillDialog } from "./create-skill-dialog"
import { AdminSkillTools } from "./admin-skill-tools"

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

export function SkillsClient() {
  const { skills, loading, error, createSampleSkills, refetch } = useSkills()
  const { isAdmin, loading: adminLoading } = useUserRole()
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<any>(null)
  
  const handleSkillCreated = () => {
    // Refresh the skills list when a new skill is created
    refetch()
  }

  const handleContactSkill = (skill: any) => {
    setSelectedSkill(skill)
    setContactDialogOpen(true)
  }

  const handleShareSkill = (skill: any) => {
    const shareText = `Check out these skills available for organizing: ${skill.skill_tags.join(', ')}`
    const shareUrl = window.location.href
    
    if (navigator.share) {
      navigator.share({
        title: 'Skills Available',
        text: shareText,
        url: shareUrl
      }).catch(console.error)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
        alert('Skill information copied to clipboard!')
      }).catch(() => {
        alert('Unable to copy to clipboard. Please share manually.')
      })
    }
  }
  
  // Filter skills for display - show all to admins, only public to others
  const displaySkills = isAdmin ? skills : skills.filter(skill => skill.is_public)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Loading skills...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading skills: {error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()}>Retry</Button>
            <Button 
              variant="outline" 
              onClick={async () => {
                try {
                  await createSampleSkills()
                  window.location.reload()
                } catch (err) {
                  console.error('Failed to create sample skills:', err)
                }
              }}
            >
              Create Sample Skills
            </Button>
          </div>
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
            Skill Registry
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Connect with people who have the skills you need. All participation is opt-in and privacy-focused.
          </p>
        </div>
        <CreateSkillDialog onSuccess={handleSkillCreated}>
          <Button className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Register Skills
          </Button>
        </CreateSkillDialog>
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
        {displaySkills.map((skill) => (
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
                    Contact: {skill.contact_method || 'Contact through admin'}
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleContactSkill(skill)}
                >
                  Contact
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleShareSkill(skill)}
                >
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {displaySkills.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No skills registered
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Be the first to register your skills and help connect your community.
          </p>
            <CreateSkillDialog onSuccess={handleSkillCreated}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Register First Skills
              </Button>
            </CreateSkillDialog>
        </div>
      )}

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Contact Information
            </DialogTitle>
            <DialogDescription>
              Contact details for this skill set.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSkill && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Available Skills
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkill.skill_tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Contact Method
                </label>
                <p className="text-slate-900 dark:text-white mt-1">
                  {selectedSkill.contact_method || 'Contact through admin only'}
                </p>
              </div>
              
              {selectedSkill.contact_method && selectedSkill.contact_method !== 'admin_only' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 This person has provided direct contact information. You can reach out to them directly.
                  </p>
                </div>
              )}
              
              {(!selectedSkill.contact_method || selectedSkill.contact_method === 'admin_only') && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    ℹ️ This person prefers to be contacted through admin coordination. Contact an admin to get in touch.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setContactDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Tools */}
      {!adminLoading && isAdmin && <AdminSkillTools />}
    </>
  )
}