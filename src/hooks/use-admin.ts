'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { createClientComponentClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export function useAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        // Try to access admin-only data to test if user is admin
        // This will work because of the RLS policies we set up
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .limit(1)

        if (error) {
          console.error('Error checking admin status:', error)
          // If we can't access users table, user is not admin
          setIsAdmin(false)
        } else {
          // If we can access users table, user is admin
          setIsAdmin(true)
        }
      } catch (err) {
        console.error('Unexpected error checking admin status:', err)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, supabase])

  return {
    isAdmin,
    loading,
    user
  }
}