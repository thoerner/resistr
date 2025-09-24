'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, MapPin, Plus, Loader2 } from 'lucide-react'
import { useActions } from '@/hooks/use-actions'
import { useUserRole } from '@/hooks/use-user-role'
import toast from 'react-hot-toast'

interface CreateActionDialogProps {
  children: React.ReactNode
}

export function CreateActionDialog({ children }: CreateActionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createAction } = useActions()
  const { user, userRole } = useUserRole()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    what_to_bring: [] as string[]
  })

  const [newItem, setNewItem] = useState('')

  const handleOpenDialog = () => {
    if (!user) {
      toast.error('Please sign in to create an action')
      return
    }
    if (userRole !== 'verified' && userRole !== 'admin') {
      toast.error('Only verified users and admins can create actions')
      return
    }
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createAction({
        title: formData.title,
        description: formData.description || null,
        event_date: formData.event_date,
        location: formData.location || null,
        what_to_bring: formData.what_to_bring.length > 0 ? formData.what_to_bring : null
      })
      
      setIsOpen(false)
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        what_to_bring: []
      })
      setNewItem('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create action')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        what_to_bring: [...prev.what_to_bring, newItem.trim()]
      }))
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      what_to_bring: prev.what_to_bring.filter((_, i) => i !== index)
    }))
  }

  // Only show create button for verified users and admins
  if (!user || (userRole !== 'verified' && userRole !== 'admin')) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={handleOpenDialog}>
        {children}
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Organize Action
          </DialogTitle>
          <DialogDescription>
            Create a new organizing event or action. Coordinate safely and effectively.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Action Title</Label>
            <Input
              id="title"
              placeholder="e.g., Solidarity March, Community Defense Training, Mutual Aid Distribution"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Action Details</Label>
            <Textarea
              id="description"
              placeholder="Describe the action, its purpose, safety considerations, and what participants should know..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Date & Time</Label>
            <Input
              id="event_date"
              type="datetime-local"
              value={formData.event_date}
              onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="location"
                placeholder="Meeting point or action location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>What to Bring (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Water, ID, Comfortable shoes, Signs..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
              />
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.what_to_bring.length > 0 && (
              <div className="space-y-1">
                {formData.what_to_bring.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-md">
                    <span className="text-sm">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Organize Action
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