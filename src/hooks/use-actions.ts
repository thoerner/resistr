'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Action = Database['public']['Tables']['events']['Row']
type ActionInsert = Database['public']['Tables']['events']['Insert']
type ActionUpdate = Database['public']['Tables']['events']['Update']

export function useActions() {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchActions()
  }, [])

  const fetchActions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })

      if (error) throw error
      setActions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch actions')
    } finally {
      setLoading(false)
    }
  }

  const createAction = async (action: ActionInsert) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(action)
        .select()
        .single()

      if (error) throw error
      
      setActions(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create action')
      throw err
    }
  }

  const updateAction = async (id: string, updates: ActionUpdate) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setActions(prev => prev.map(action => 
        action.id === id ? data : action
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update action')
      throw err
    }
  }

  const deleteAction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setActions(prev => prev.filter(action => action.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete action')
      throw err
    }
  }

  return {
    actions,
    loading,
    error,
    createAction,
    updateAction,
    deleteAction,
    refetch: fetchActions
  }
}

export function useAction(id: string) {
  const [action, setAction] = useState<Action | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (id) {
      fetchAction()
    }
  }, [id])

  const fetchAction = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setAction(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch action')
    } finally {
      setLoading(false)
    }
  }

  return {
    action,
    loading,
    error,
    refetch: fetchAction
  }
}