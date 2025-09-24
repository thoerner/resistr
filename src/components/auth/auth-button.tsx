'use client'

import { Button } from '@/components/ui/button'
import { SignInDialog } from './sign-in-dialog'
import { UserProfile } from './user-profile'
import { useAuth } from './auth-provider'
import { useUserRole } from '@/hooks/use-user-role'
import { User, LogOut, Shield, Settings } from 'lucide-react'
import Link from 'next/link'

export function AuthButton() {
  const { user, signOut, loading } = useAuth()
  const { isAdmin } = useUserRole()

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <UserProfile>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 w-full sm:w-auto justify-center"
          >
            <Settings className="h-3 w-3" />
            Profile
          </Button>
        </UserProfile>
        {isAdmin && (
          <Link href="/admin" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 w-full justify-center"
            >
              <Shield className="h-3 w-3" />
              Admin
            </Button>
          </Link>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="flex items-center gap-1 w-full sm:w-auto justify-center"
        >
          <LogOut className="h-3 w-3" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <SignInDialog>
      <Button variant="outline" size="sm" className="w-full sm:w-auto justify-center">
        Sign In
      </Button>
    </SignInDialog>
  )
}