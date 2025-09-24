'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Package, Plus, Loader2 } from 'lucide-react'
import { useResources } from '@/hooks/use-resources'
import { useUserRole } from '@/hooks/use-user-role'
import toast from 'react-hot-toast'

interface CreateResourceDialogProps {
  children: React.ReactNode
}

const categories = [
  'Medical',
  'Transportation', 
  'Food',
  'Communication',
  'Safety',
  'Logistics',
  'Other'
]

export function CreateResourceDialog({ children }: CreateResourceDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createResource } = useResources()
  const { user } = useUserRole()

  const [formData, setFormData] = useState({
    type: 'need' as 'need' | 'have',
    category: '',
    description: ''
  })

  const handleOpenDialog = () => {
    if (!user) {
      toast.error('Please sign in to share resources')
      return
    }
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createResource({
        type: formData.type,
        category: formData.category,
        description: formData.description
      })
      
      setIsOpen(false)
      setFormData({
        type: 'need',
        category: '',
        description: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={handleOpenDialog}>
        {children}
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Coordinate Resources
          </DialogTitle>
          <DialogDescription>
            Share what you need or what you can provide for organizing efforts and mutual aid.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Resource Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'need' | 'have') => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="need">I Need This</SelectItem>
                <SelectItem value="have">I Can Provide This</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the resource, quantity, condition, pickup/delivery details..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Share Resource
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