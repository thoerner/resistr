'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, Plus, Loader2 } from 'lucide-react'
import { useSkills } from '@/hooks/use-skills'
import { useUserRole } from '@/hooks/use-user-role'
import toast from 'react-hot-toast'

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
  const [success, setSuccess] = useState(false)
  const { createSkill } = useSkills()
  const { user } = useUserRole()

  const [formData, setFormData] = useState({
    skill_tags: [] as string[],
    contact_method: 'admin_only',
    is_public: true
  })

  const [newTag, setNewTag] = useState('')

  const handleOpenDialog = () => {
    if (!user) {
      toast.error('Please sign in to register your skills')
      return
    }
    setIsOpen(true)
  }

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
      
      // Show success message briefly
      setSuccess(true)
      setError('')
      
      // Reset form
      setFormData({
        skill_tags: [],
        contact_method: 'admin_only',
        is_public: true
      })
      setNewTag('')
      
      // Notify parent and close dialog after a brief delay
      onSuccess?.()
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
      }, 1500)
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
      <div onClick={handleOpenDialog}>
        {children}
      </div>
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
                disabled={success}
              />
              <Button type="button" onClick={addTag} size="sm" disabled={success}>
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
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose how people can reach you. If you provide contact info, it will be visible when others click &ldquo;Contact&rdquo;.
            </p>
            <Select 
              value={formData.contact_method} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, contact_method: value }))}
              disabled={success}
            >
              <SelectTrigger>
                <SelectValue placeholder="How can people contact you?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin_only">🔒 Admin-only (most private)</SelectItem>
                <SelectItem value="Signal: @username">📱 Signal handle</SelectItem>
                <SelectItem value="Email: user@example.com">📧 Email address</SelectItem>
                <SelectItem value="Other">💬 Other method</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose who can see your skills. Contact information follows your chosen method regardless of visibility.
            </p>
            <Select 
              value={formData.is_public ? 'public' : 'private'} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, is_public: value === 'public' }))}
              disabled={success}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">🌍 Public - Everyone can see your skills</SelectItem>
                <SelectItem value="private">🔒 Private - Only admins can see your skills</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
              ✅ Skills registered successfully! The list will update shortly.
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading || success}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {success ? 'Success!' : 'Register Skills'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={success}>
              {success ? 'Closing...' : 'Cancel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}