'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type RSVP = Database['public']['Tables']['rsvps']['Row']
type RSVPInsert = Database['public']['Tables']['rsvps']['Insert']

export function useEventRSVPs(eventId: string) {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (eventId) {
      fetchRSVPs()
    }
  }, [eventId])

  const fetchRSVPs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRsvps(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RSVPs')
    } finally {
      setLoading(false)
    }
  }

  const createRSVP = async (rsvp: RSVPInsert) => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .insert(rsvp)
        .select()
        .single()

      if (error) throw error
      
      setRsvps(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create RSVP')
      throw err
    }
  }

  const updateRSVP = async (id: string, updates: Partial<RSVPInsert>) => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setRsvps(prev => prev.map(rsvp => 
        rsvp.id === id ? data : rsvp
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update RSVP')
      throw err
    }
  }

  const deleteRSVP = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setRsvps(prev => prev.filter(rsvp => rsvp.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete RSVP')
      throw err
    }
  }

  // Helper functions
  const rsvpCount = rsvps.length
  const rsvpsByRole = rsvps.reduce((acc, rsvp) => {
    acc[rsvp.role] = (acc[rsvp.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    rsvps,
    rsvpCount,
    rsvpsByRole,
    loading,
    error,
    createRSVP,
    updateRSVP,
    deleteRSVP,
    refetch: fetchRSVPs
  }
}

export function useUserRSVPs(userId?: string) {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (userId) {
      fetchUserRSVPs()
    }
  }, [userId])

  const fetchUserRSVPs = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('rsvps')
        .select(`
          *,
          events (
            id,
            title,
            event_date,
            location
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRsvps(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user RSVPs')
    } finally {
      setLoading(false)
    }
  }

  return {
    rsvps,
    loading,
    error,
    refetch: fetchUserRSVPs
  }
}