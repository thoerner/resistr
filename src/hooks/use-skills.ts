'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Skill = Database['public']['Tables']['skills']['Row']
type SkillInsert = Database['public']['Tables']['skills']['Insert']
type SkillUpdate = Database['public']['Tables']['skills']['Update']

export type SkillWithUser = Skill & {
  users?: {
    email: string
    role: string
  } | null
}

export function useSkills() {
  const [skills, setSkills] = useState<SkillWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Attempting to fetch skills...')
      
      // First, let's test if we can connect to Supabase at all
      const { data: testData, error: testError } = await supabase
        .from('skills')
        .select('count')
        .limit(1)
      
      console.log('Connection test result:', { testData, testError })
      
      if (testError) {
        console.error('Connection test failed:', testError)
        throw new Error(`Database connection failed: ${testError.message}`)
      }
      
      // Fetch skills with user information including role
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          users!skills_user_id_fkey(email, role)
        `)
        .order('created_at', { ascending: false })

      console.log('Skills query result:', { data, error })

      if (error) {
        console.error('Skills fetch error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      console.log('Skills fetched successfully:', data?.length || 0, 'skills')
      setSkills(data as SkillWithUser[] || [])
    } catch (err) {
      console.error('Skills fetch error:', err)
      console.error('Error type:', typeof err)
      console.error('Error constructor:', err?.constructor?.name)
      
      const errorMessage = err instanceof Error ? err.message : 
        typeof err === 'object' && err !== null ? JSON.stringify(err) : 
        'Failed to fetch skills'
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createSkill = async (skill: SkillInsert) => {
    try {
      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) throw new Error('User must be authenticated to create skills')

      // Add the user_id to the skill object
      const skillWithUser = {
        ...skill,
        user_id: user.id
      }

      const { data, error } = await supabase
        .from('skills')
        .insert(skillWithUser)
        .select()
        .single()

      if (error) throw error
      
      setSkills(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create skill')
      throw err
    }
  }

  const updateSkill = async (id: string, updates: SkillUpdate) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setSkills(prev => prev.map(skill => 
        skill.id === id ? data : skill
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update skill')
      throw err
    }
  }

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setSkills(prev => prev.filter(skill => skill.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete skill')
      throw err
    }
  }

  const createSampleSkills = async () => {
    const sampleSkills = [
      {
        skill_tags: ['Medical', 'First Aid'],
        contact_method: 'Signal: @medicalhelper',
        is_public: true
      },
      {
        skill_tags: ['Legal', 'Know Your Rights'],
        contact_method: 'Email: legal@example.com',
        is_public: true
      },
      {
        skill_tags: ['Communication', 'Social Media'],
        contact_method: 'Signal: @commhelper',
        is_public: true
      },
      {
        skill_tags: ['Technical', 'IT Support'],
        contact_method: 'Signal: @techhelper',
        is_public: true
      },
      {
        skill_tags: ['Food & Logistics', 'Catering'],
        contact_method: 'Signal: @foodhelper',
        is_public: true
      }
    ]

    try {
      for (const skill of sampleSkills) {
        await createSkill(skill)
      }
    } catch (err) {
      console.error('Error creating sample skills:', err)
      throw err
    }
  }

  return {
    skills,
    loading,
    error,
    createSkill,
    updateSkill,
    deleteSkill,
    createSampleSkills,
    refetch: fetchSkills
  }
}

export function useUserSkills(userId?: string) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (userId) {
      fetchUserSkills()
    }
  }, [userId])

  const fetchUserSkills = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSkills(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user skills')
    } finally {
      setLoading(false)
    }
  }

  return {
    skills,
    loading,
    error,
    refetch: fetchUserSkills
  }
}