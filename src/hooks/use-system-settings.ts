'use client'

import { createClientComponentClient } from '@/lib/supabase'
import { useEffect, useState, useCallback } from 'react'

export interface SystemSettings {
  // General Settings
  appName: string
  appDescription: string
  maintenanceMode: boolean
  maintenanceMessage: string
  
  // Data Retention Settings
  autoPurgeEnabled: boolean
  autoPurgeDays: number
  manualPurgeEnabled: boolean
  
  // User Management Settings
  allowPublicRegistration: boolean
  requireEmailVerification: boolean
  defaultUserRole: 'public' | 'verified' | 'admin'
  
  // Action Settings
  allowAnonymousRSVP: boolean
  requireRSVPApproval: boolean
  maxRSVPsPerUser: number
  
  // Resource Settings
  allowResourceClaiming: boolean
  requireResourceApproval: boolean
  maxResourcesPerUser: number
  
  // Skill Settings
  allowPublicSkills: boolean
  requireSkillApproval: boolean
  maxSkillsPerUser: number
  
  // Security Settings
  enableRateLimiting: boolean
  maxRequestsPerMinute: number
  enableAuditLogging: boolean
  
  // Notification Settings
  enableEmailNotifications: boolean
  enableSystemNotifications: boolean
  notificationRetentionDays: number
  
  // Backup Settings
  enableAutoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  backupRetentionDays: number
}

const defaultSettings: SystemSettings = {
  // General Settings
  appName: 'Resistr Organizing Tool',
  appDescription: 'A secure, privacy-focused platform for event coordination, resource tracking, and skill mapping.',
  maintenanceMode: false,
  maintenanceMessage: 'The system is currently under maintenance. Please check back later.',
  
  // Data Retention Settings
  autoPurgeEnabled: true,
  autoPurgeDays: 14,
  manualPurgeEnabled: true,
  
  // User Management Settings
  allowPublicRegistration: true,
  requireEmailVerification: false,
  defaultUserRole: 'public',
  
  // Action Settings
  allowAnonymousRSVP: true,
  requireRSVPApproval: false,
  maxRSVPsPerUser: 10,
  
  // Resource Settings
  allowResourceClaiming: true,
  requireResourceApproval: false,
  maxResourcesPerUser: 20,
  
  // Skill Settings
  allowPublicSkills: true,
  requireSkillApproval: false,
  maxSkillsPerUser: 15,
  
  // Security Settings
  enableRateLimiting: true,
  maxRequestsPerMinute: 60,
  enableAuditLogging: true,
  
  // Notification Settings
  enableEmailNotifications: true,
  enableSystemNotifications: true,
  notificationRetentionDays: 30,
  
  // Backup Settings
  enableAutoBackup: false,
  backupFrequency: 'weekly',
  backupRetentionDays: 90
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = createClientComponentClient()

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, we'll use localStorage to store settings
      // In a real implementation, you'd store these in a database table
      const storedSettings = localStorage.getItem('system-settings')
      
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings)
        setSettings({ ...defaultSettings, ...parsedSettings })
      } else {
        setSettings(defaultSettings)
      }
    } catch (err) {
      console.error('Error fetching system settings:', err)
      setError('Failed to fetch system settings')
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveSettings = useCallback(async (newSettings: Partial<SystemSettings>) => {
    try {
      setSaving(true)
      setError(null)
      
      const updatedSettings = { ...settings, ...newSettings }
      
      // Save to localStorage (in a real implementation, save to database)
      localStorage.setItem('system-settings', JSON.stringify(updatedSettings))
      
      setSettings(updatedSettings)
      
      // Here you would also call an API to save to database
      // await supabase.from('system_settings').upsert(updatedSettings)
      
    } catch (err) {
      console.error('Error saving system settings:', err)
      setError('Failed to save system settings')
      throw err
    } finally {
      setSaving(false)
    }
  }, [settings])

  const resetToDefaults = useCallback(async () => {
    try {
      setSaving(true)
      setError(null)
      
      localStorage.removeItem('system-settings')
      setSettings(defaultSettings)
      
    } catch (err) {
      console.error('Error resetting system settings:', err)
      setError('Failed to reset system settings')
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const updateSetting = useCallback(async (key: keyof SystemSettings, value: unknown) => {
    await saveSettings({ [key]: value })
  }, [saveSettings])

  const toggleMaintenanceMode = useCallback(async () => {
    await updateSetting('maintenanceMode', !settings.maintenanceMode)
  }, [settings.maintenanceMode, updateSetting])

  const purgeAllData = useCallback(async () => {
    try {
      setSaving(true)
      setError(null)
      
      // This would call the manual_purge_all_data function
      const { error } = await supabase.rpc('manual_purge_all_data')
      
      if (error) {
        console.error('Error purging data:', error)
        throw new Error(error.message)
      }
      
    } catch (err) {
      console.error('Error purging data:', err)
      setError('Failed to purge data')
      throw err
    } finally {
      setSaving(false)
    }
  }, [supabase])

  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'system-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }, [settings])

  const importSettings = useCallback(async (file: File) => {
    try {
      setSaving(true)
      setError(null)
      
      const text = await file.text()
      const importedSettings = JSON.parse(text)
      
      // Validate the imported settings
      const validatedSettings = { ...defaultSettings, ...importedSettings }
      
      await saveSettings(validatedSettings)
      
    } catch (err) {
      console.error('Error importing settings:', err)
      setError('Failed to import settings. Please check the file format.')
      throw err
    } finally {
      setSaving(false)
    }
  }, [saveSettings])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    error,
    saving,
    fetchSettings,
    saveSettings,
    updateSetting,
    resetToDefaults,
    toggleMaintenanceMode,
    purgeAllData,
    exportSettings,
    importSettings
  }
}