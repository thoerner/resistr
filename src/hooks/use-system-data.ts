'use client'

import { createClientComponentClient } from '@/lib/supabase'
import { useEffect, useState, useCallback } from 'react'

export interface SystemStats {
  totalUsers: number
  totalActions: number
  totalRSVPs: number
  totalResources: number
  totalSkills: number
  usersByRole: {
    admin: number
    verified: number
    public: number
  }
  resourcesByType: {
    need: number
    have: number
  }
  recentActivity: {
    recentUsers: number
    recentActions: number
    recentRSVPs: number
  }
}

export interface ActionData {
  id: string
  title: string
  description: string | null
  event_date: string
  location: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  rsvp_count: number
  creator_email: string | null
}

export interface RSVPData {
  id: string
  user_id: string | null
  event_id: string
  role: string
  anonymous_name: string | null
  created_at: string
  user_email: string | null
  action_title: string | null
}

export interface ResourceData {
  id: string
  type: 'need' | 'have'
  category: string
  description: string
  user_id: string | null
  event_id: string | null
  claimed_by: string | null
  created_at: string
  updated_at: string
  user_email: string | null
  action_title: string | null
  claimed_by_email: string | null
}

export interface SkillData {
  id: string
  user_id: string | null
  skill_tags: string[]
  contact_method: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  user_email: string | null
}

export function useSystemData() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [actions, setActions] = useState<ActionData[]>([])
  const [rsvps, setRsvps] = useState<RSVPData[]>([])
  const [resources, setResources] = useState<ResourceData[]>([])
  const [skills, setSkills] = useState<SkillData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const fetchSystemStats = useCallback(async () => {
    try {
      // Fetch all counts in parallel
      const [
        usersResult,
        actionsResult,
        rsvpsResult,
        resourcesResult,
        skillsResult,
        usersByRoleResult,
        resourcesByTypeResult,
        recentUsersResult,
        recentActionsResult,
        recentRSVPsResult
      ] = await Promise.all([
        // Total counts
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('rsvps').select('id', { count: 'exact', head: true }),
        supabase.from('resources').select('id', { count: 'exact', head: true }),
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        
        // Users by role
        supabase.from('users').select('role'),
        
        // Resources by type
        supabase.from('resources').select('type'),
        
        // Recent activity (last 7 days)
        supabase.from('users').select('created_at').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('events').select('created_at').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('rsvps').select('created_at').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ])

      // Process users by role
      const usersByRole = { admin: 0, verified: 0, public: 0 }
      if (usersByRoleResult.data) {
        usersByRoleResult.data.forEach(user => {
          if (user.role in usersByRole) {
            usersByRole[user.role as keyof typeof usersByRole]++
          }
        })
      }

      // Process resources by type
      const resourcesByType = { need: 0, have: 0 }
      if (resourcesByTypeResult.data) {
        resourcesByTypeResult.data.forEach(resource => {
          if (resource.type in resourcesByType) {
            resourcesByType[resource.type as keyof typeof resourcesByType]++
          }
        })
      }

      // Process recent activity
      const recentActivity = {
        recentUsers: recentUsersResult.data?.length || 0,
        recentActions: recentActionsResult.data?.length || 0,
        recentRSVPs: recentRSVPsResult.data?.length || 0
      }

      setStats({
        totalUsers: usersResult.count || 0,
        totalActions: actionsResult.count || 0,
        totalRSVPs: rsvpsResult.count || 0,
        totalResources: resourcesResult.count || 0,
        totalSkills: skillsResult.count || 0,
        usersByRole,
        resourcesByType,
        recentActivity
      })
    } catch (err) {
      console.error('Error fetching system stats:', err)
      setError('Failed to fetch system statistics')
    }
  }, [supabase])

  const fetchActions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users!events_created_by_fkey(email),
          rsvps(count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching actions:', error)
        setError(error.message)
        return
      }

      const actionsData: ActionData[] = (data || []).map(action => ({
        id: action.id,
        title: action.title,
        description: action.description,
        event_date: action.event_date,
        location: action.location,
        created_by: action.created_by,
        created_at: action.created_at,
        updated_at: action.updated_at,
        rsvp_count: action.rsvps?.[0]?.count || 0,
        creator_email: action.users?.email || null
      }))

      setActions(actionsData)
    } catch (err) {
      console.error('Error fetching actions:', err)
      setError('Failed to fetch actions')
    }
  }, [supabase])

  const fetchRSVPs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select(`
          *,
          users!rsvps_user_id_fkey(email),
          events!rsvps_event_id_fkey(title)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching RSVPs:', error)
        setError(error.message)
        return
      }

      const rsvpsData: RSVPData[] = (data || []).map(rsvp => ({
        id: rsvp.id,
        user_id: rsvp.user_id,
        event_id: rsvp.event_id,
        role: rsvp.role,
        anonymous_name: rsvp.anonymous_name,
        created_at: rsvp.created_at,
        user_email: rsvp.users?.email || null,
        action_title: rsvp.events?.title || null
      }))

      setRsvps(rsvpsData)
    } catch (err) {
      console.error('Error fetching RSVPs:', err)
      setError('Failed to fetch RSVPs')
    }
  }, [supabase])

  const fetchResources = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          users!resources_user_id_fkey(email),
          events!resources_event_id_fkey(title),
          claimed_user:users!resources_claimed_by_fkey(email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching resources:', error)
        setError(error.message)
        return
      }

      const resourcesData: ResourceData[] = (data || []).map(resource => ({
        id: resource.id,
        type: resource.type,
        category: resource.category,
        description: resource.description,
        user_id: resource.user_id,
        event_id: resource.event_id,
        claimed_by: resource.claimed_by,
        created_at: resource.created_at,
        updated_at: resource.updated_at,
        user_email: resource.users?.email || null,
        action_title: resource.events?.title || null,
        claimed_by_email: resource.claimed_user?.email || null
      }))

      setResources(resourcesData)
    } catch (err) {
      console.error('Error fetching resources:', err)
      setError('Failed to fetch resources')
    }
  }, [supabase])

  const fetchSkills = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          users!skills_user_id_fkey(email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching skills:', error)
        setError(error.message)
        return
      }

      const skillsData: SkillData[] = (data || []).map(skill => ({
        id: skill.id,
        user_id: skill.user_id,
        skill_tags: skill.skill_tags,
        contact_method: skill.contact_method,
        is_public: skill.is_public,
        created_at: skill.created_at,
        updated_at: skill.updated_at,
        user_email: skill.users?.email || null
      }))

      setSkills(skillsData)
    } catch (err) {
      console.error('Error fetching skills:', err)
      setError('Failed to fetch skills')
    }
  }, [supabase])

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      await Promise.all([
        fetchSystemStats(),
        fetchActions(),
        fetchRSVPs(),
        fetchResources(),
        fetchSkills()
      ])
    } catch (err) {
      console.error('Error fetching all data:', err)
      setError('Failed to fetch system data')
    } finally {
      setLoading(false)
    }
  }, [fetchSystemStats, fetchActions, fetchRSVPs, fetchResources, fetchSkills])

  const deleteAction = async (actionId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', actionId)

      if (error) {
        console.error('Error deleting action:', error)
        throw new Error(error.message)
      }

      // Refresh data
      await fetchAllData()
    } catch (err) {
      console.error('Error deleting action:', err)
      throw err
    }
  }

  const deleteResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId)

      if (error) {
        console.error('Error deleting resource:', error)
        throw new Error(error.message)
      }

      // Refresh data
      await fetchAllData()
    } catch (err) {
      console.error('Error deleting resource:', err)
      throw err
    }
  }

  const deleteSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId)

      if (error) {
        console.error('Error deleting skill:', error)
        throw new Error(error.message)
      }

      // Refresh data
      await fetchAllData()
    } catch (err) {
      console.error('Error deleting skill:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return {
    stats,
    actions,
    rsvps,
    resources,
    skills,
    loading,
    error,
    fetchAllData,
    deleteAction,
    deleteResource,
    deleteSkill
  }
}