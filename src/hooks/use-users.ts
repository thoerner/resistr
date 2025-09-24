'use client'

import { createClientComponentClient } from '@/lib/supabase'
import { useEffect, useState, useCallback } from 'react'

export interface User {
  id: string
  email: string
  role: 'public' | 'verified' | 'admin'
  username: string | null
  encrypted_contact: string | null
  created_at: string
  updated_at: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        setError(error.message)
        return
      }

      setUsers(data || [])
    } catch (err) {
      console.error('Unexpected error fetching users:', err)
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const updateUserRole = async (userId: string, newRole: 'public' | 'verified' | 'admin') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user role:', error)
        throw new Error(error.message)
      }

      // Refresh the users list
      await fetchUsers()
    } catch (err) {
      console.error('Error updating user role:', err)
      throw err
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('Error deleting user:', error)
        throw new Error(error.message)
      }

      // Refresh the users list
      await fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserRole,
    deleteUser
  }
}