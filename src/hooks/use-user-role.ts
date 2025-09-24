'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { createClientComponentClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export function useUserRole() {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<'public' | 'verified' | 'admin' | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setUserRole(null)
        setLoading(false)
        return
      }

      try {
        // DEBUG: Check what token we're actually sending
        console.log('=== AUTH DEBUG START ===')
        console.log('User object:', user)
        console.log('User app_metadata:', user?.app_metadata)
        console.log('User id:', user?.id)
        console.log('User email:', user?.email)
        
        // Check session and token
        const { data: sessionData } = await supabase.auth.getSession()
        console.log('Session exists:', !!sessionData.session)
        console.log('Session access_token exists:', !!sessionData.session?.access_token)
        console.log('Session user app_metadata:', sessionData.session?.user?.app_metadata)
        
        // Call debug_claims RPC to see what the server receives
        const { data: debugClaims, error: debugError } = await supabase.rpc('debug_claims')
        console.log('DEBUG CLAIMS RESULT:', debugClaims)
        console.log('DEBUG CLAIMS ERROR:', debugError)
        console.log('=== AUTH DEBUG END ===')
        
        // Use the debug version to see what's happening
        const { data, error } = await supabase
          .rpc('debug_ensure_user_exists', {
            user_id: user.id,
            user_email: user.email || ''
          })

        console.log('ensure_user_exists result:', { data, error })

        if (error) {
          console.error('Error ensuring user exists:', error)
          setUserRole('public') // Default to public if error
        } else if (data && data.length > 0) {
          setUserRole(data[0].role as 'public' | 'verified' | 'admin')
        } else {
          setUserRole('public') // Default to public if no data
        }
      } catch (err) {
        console.error('Unexpected error checking user role:', err)
        setUserRole('public') // Default to public if error
      } finally {
        setLoading(false)
      }
    }

    checkUserRole()
  }, [user, supabase])

  return {
    userRole,
    isAdmin: userRole === 'admin',
    isVerified: userRole === 'verified' || userRole === 'admin',
    isPublic: userRole === 'public',
    loading,
    user
  }
}