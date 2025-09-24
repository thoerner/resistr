'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, Plus, Loader2 } from 'lucide-react'
import { useSkills } from '@/hooks/use-skills'

interface CreateSkillDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

const skillCategories = [
  'Medical',
  'Legal', 
  'Communication',
  'Arts & Media',
  'Technical',
  'Food & Logistics',
  'Organizing',
  'Other'
]

export function CreateSkillDialog({ children, onSuccess }: CreateSkillDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createSkill } = useSkills()

  const [formData, setFormData] = useState({
    skill_tags: [] as string[],
    contact_method: 'admin_only',
    is_public: true
  })

  const [newTag, setNewTag] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.skill_tags.length === 0) {
      setError('Please add at least one skill tag')
      setLoading(false)
      return
    }

    try {
      await createSkill({
        skill_tags: formData.skill_tags,
        contact_method: formData.contact_method === 'admin_only' ? null : formData.contact_method || null,
        is_public: formData.is_public
      })
      
      // Reset form
      setFormData({
        skill_tags: [],
        contact_method: 'admin_only',
        is_public: true
      })
      setNewTag('')
      setError('')
      
      // Close dialog and notify parent
      setIsOpen(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register skill')
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.skill_tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        skill_tags: [...prev.skill_tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skill_tags: prev.skill_tags.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Register Skills
          </DialogTitle>
          <DialogDescription>
            Register your skills to support organizing efforts and mutual aid. All information is optional and privacy-focused.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Skill Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Street Medic, Legal Observer, Social Media, Translation, Food Prep, Transportation"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.skill_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skill_tags.map((tag, index) => (
                  <div key={index} className="flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm">
                    <span>{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(index)}
                      className="h-4 w-4 p-0 ml-2"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_method">Contact Method (Optional)</Label>
            <Select 
              value={formData.contact_method} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, contact_method: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="How can people contact you?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin_only">Contact through admin only</SelectItem>
                <SelectItem value="Signal: @username">Signal handle</SelectItem>
                <SelectItem value="Email: user@example.com">Email address</SelectItem>
                <SelectItem value="Other">Other (specify in description)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select 
              value={formData.is_public ? 'public' : 'private'} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, is_public: value === 'public' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to everyone</SelectItem>
                <SelectItem value="private">Private - Only visible to admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Register Skills
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}