'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Resource = Database['public']['Tables']['resources']['Row']
type ResourceInsert = Database['public']['Tables']['resources']['Insert']
type ResourceUpdate = Database['public']['Tables']['resources']['Update']

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resources')
    } finally {
      setLoading(false)
    }
  }

  const createResource = async (resource: ResourceInsert) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert(resource)
        .select()
        .single()

      if (error) throw error
      
      setResources(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource')
      throw err
    }
  }

  const updateResource = async (id: string, updates: ResourceUpdate) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setResources(prev => prev.map(resource => 
        resource.id === id ? data : resource
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resource')
      throw err
    }
  }

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setResources(prev => prev.filter(resource => resource.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource')
      throw err
    }
  }

  const claimResource = async (id: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update({ claimed_by: userId })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setResources(prev => prev.map(resource => 
        resource.id === id ? data : resource
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim resource')
      throw err
    }
  }

  const unclaimResource = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update({ claimed_by: null })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setResources(prev => prev.map(resource => 
        resource.id === id ? data : resource
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unclaim resource')
      throw err
    }
  }

  // Helper functions to filter resources
  const neededResources = resources.filter(r => r.type === 'need')
  const availableResources = resources.filter(r => r.type === 'have')

  return {
    resources,
    neededResources,
    availableResources,
    loading,
    error,
    createResource,
    updateResource,
    deleteResource,
    claimResource,
    unclaimResource,
    refetch: fetchResources
  }
}