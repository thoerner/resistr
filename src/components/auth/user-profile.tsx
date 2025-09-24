'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from './auth-provider'
import { createClientComponentClient } from '@/lib/supabase'
import { User, Edit3, Check, X, AlertCircle, Loader2 } from 'lucide-react'

interface UserProfileProps {
  children?: React.ReactNode
}

export function UserProfile({ children }: UserProfileProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [suggestedUsername, setSuggestedUsername] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user && isOpen) {
      fetchUserProfile()
    }
  }, [user, isOpen])

  const fetchUserProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single()

      if (error) throw error
      
      setUsername(data?.username || '')
      setNewUsername(data?.username || '')
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

  const generateUsernameSuggestion = async () => {
    if (!user?.email) return

    try {
      const { data, error } = await supabase
        .rpc('generate_username_suggestion', {
          email_address: user.email
        })

      if (error) throw error
      setSuggestedUsername(data)
      setNewUsername(data)
    } catch (err) {
      console.error('Error generating username suggestion:', err)
    }
  }

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck === username) return true

    try {
      const { data, error } = await supabase
        .rpc('is_username_available', {
          check_username: usernameToCheck.toLowerCase()
        })

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error checking username availability:', err)
      return false
    }
  }

  const handleSaveUsername = async () => {
    if (!user || !newUsername.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate username format
      const usernameRegex = /^[a-z0-9_]+$/
      if (!usernameRegex.test(newUsername.toLowerCase())) {
        throw new Error('Username must contain only lowercase letters, numbers, and underscores')
      }

      if (newUsername.length < 3 || newUsername.length > 50) {
        throw new Error('Username must be between 3 and 50 characters')
      }

      // Check availability if it's different from current
      if (newUsername.toLowerCase() !== username.toLowerCase()) {
        const isAvailable = await checkUsernameAvailability(newUsername)
        if (!isAvailable) {
          throw new Error('Username is already taken')
        }
      }

      const { error } = await supabase
        .from('users')
        .update({ username: newUsername.toLowerCase() })
        .eq('id', user.id)

      if (error) throw error

      setUsername(newUsername.toLowerCase())
      setIsEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update username')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setNewUsername(username)
    setIsEditing(false)
    setError(null)
  }

  const getDisplayName = () => {
    if (username) return username
    if (user?.email) {
      const emailPart = user.email.split('@')[0]
      return `${emailPart} (email)`
    }
    return 'Anonymous'
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Manage your username and profile settings
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Display Identity</CardTitle>
            <CardDescription>
              How others will see you in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Display */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <div className="font-medium">{getDisplayName()}</div>
                <div className="text-sm text-slate-500">
                  {username ? 'Custom username' : 'Using email identifier'}
                </div>
              </div>
              <Badge variant={username ? 'default' : 'secondary'}>
                {username ? 'Custom' : 'Default'}
              </Badge>
            </div>

            {/* Username Management */}
            {!isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <div className="text-sm text-slate-500">
                      {username || 'Not set'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    {username ? 'Edit' : 'Set Username'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                      placeholder="Enter username"
                      maxLength={50}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateUsernameSuggestion}
                      title="Generate suggestion from email"
                    >
                      Suggest
                    </Button>
                  </div>
                  {suggestedUsername && (
                    <div className="text-xs text-slate-500 mt-1">
                      Suggested: {suggestedUsername}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    Username updated successfully!
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveUsername}
                    disabled={loading || !newUsername.trim()}
                    size="sm"
                  >
                    {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Username Rules */}
            <div className="text-xs text-slate-500 space-y-1">
              <div>• 3-50 characters, lowercase letters, numbers, and underscores only</div>
              <div>• Must be unique across all users</div>
              <div>• Can be changed at any time</div>
              <div>• Used for public display instead of email</div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}