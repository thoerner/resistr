'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSystemSettings } from "@/hooks/use-system-settings"
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  AlertTriangle, 
  Loader2, 
  Shield, 
  Users, 
  Calendar, 
  Package, 
  Wrench, 
  Bell, 
  Database,
  Trash2
} from "lucide-react"

export function SystemSettings() {
  const {
    settings,
    loading,
    error,
    saving,
    saveSettings,
    updateSetting,
    resetToDefaults,
    toggleMaintenanceMode,
    purgeAllData,
    exportSettings,
    importSettings
  } = useSystemSettings()

  const [activeSection, setActiveSection] = useState<'general' | 'data' | 'users' | 'actions' | 'resources' | 'skills' | 'security' | 'notifications' | 'backup'>('general')
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isPurgeDialogOpen, setIsPurgeDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    try {
      await saveSettings(settings)
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const handleReset = async () => {
    try {
      await resetToDefaults()
      setIsResetDialogOpen(false)
    } catch (error) {
      console.error('Error resetting settings:', error)
    }
  }

  const handlePurge = async () => {
    try {
      await purgeAllData()
      setIsPurgeDialogOpen(false)
    } catch (error) {
      console.error('Error purging data:', error)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        await importSettings(file)
        setIsImportDialogOpen(false)
      } catch (error) {
        console.error('Error importing settings:', error)
      }
    }
  }

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'actions', label: 'Actions', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: Package },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Database }
  ]

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 text-orange-500 mr-2" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading system settings...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 text-orange-500 mr-2" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertTriangle className="h-8 w-8 mr-2" />
            <span>Error loading settings: {error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 text-orange-500 mr-2" />
          System Settings
        </CardTitle>
        <CardDescription>
          Configure system-wide settings and preferences. Changes are saved automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 space-y-2">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id as 'general' | 'data' | 'users' | 'actions' | 'resources' | 'skills' | 'security' | 'notifications' | 'backup')}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                  activeSection === id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appName">Application Name</Label>
                    <Input
                      id="appName"
                      value={settings.appName}
                      onChange={(e) => updateSetting('appName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="appDescription">Application Description</Label>
                    <Textarea
                      id="appDescription"
                      value={settings.appDescription}
                      onChange={(e) => updateSetting('appDescription', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-slate-500">Enable to show maintenance message to users</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                    />
                  </div>
                  
                  {settings.maintenanceMode && (
                    <div>
                      <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                      <Textarea
                        id="maintenanceMessage"
                        value={settings.maintenanceMessage}
                        onChange={(e) => updateSetting('maintenanceMessage', e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Management Settings */}
            {activeSection === 'data' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoPurgeEnabled">Auto-purge Enabled</Label>
                      <p className="text-sm text-slate-500">Automatically delete old data</p>
                    </div>
                    <Switch
                      id="autoPurgeEnabled"
                      checked={settings.autoPurgeEnabled}
                      onCheckedChange={(checked) => updateSetting('autoPurgeEnabled', checked)}
                    />
                  </div>
                  
                  {settings.autoPurgeEnabled && (
                    <div>
                      <Label htmlFor="autoPurgeDays">Auto-purge Days</Label>
                      <Input
                        id="autoPurgeDays"
                        type="number"
                        min="1"
                        max="365"
                        value={settings.autoPurgeDays}
                        onChange={(e) => updateSetting('autoPurgeDays', parseInt(e.target.value))}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="manualPurgeEnabled">Manual Purge Enabled</Label>
                      <p className="text-sm text-slate-500">Allow admins to manually purge data</p>
                    </div>
                    <Switch
                      id="manualPurgeEnabled"
                      checked={settings.manualPurgeEnabled}
                      onCheckedChange={(checked) => updateSetting('manualPurgeEnabled', checked)}
                    />
                  </div>
                </div>
                
                {settings.manualPurgeEnabled && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                      Danger Zone
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      This will permanently delete all data except admin users.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => setIsPurgeDialogOpen(true)}
                      disabled={saving}
                    >
                      {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Purge All Data
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* User Management Settings */}
            {activeSection === 'users' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowPublicRegistration">Allow Public Registration</Label>
                      <p className="text-sm text-slate-500">Allow new users to register</p>
                    </div>
                    <Switch
                      id="allowPublicRegistration"
                      checked={settings.allowPublicRegistration}
                      onCheckedChange={(checked) => updateSetting('allowPublicRegistration', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                      <p className="text-sm text-slate-500">Require email verification for new users</p>
                    </div>
                    <Switch
                      id="requireEmailVerification"
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => updateSetting('requireEmailVerification', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="defaultUserRole">Default User Role</Label>
                    <Select
                      value={settings.defaultUserRole}
                      onValueChange={(value: 'public' | 'verified' | 'admin') => updateSetting('defaultUserRole', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Action Settings */}
            {activeSection === 'actions' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowAnonymousRSVP">Allow Anonymous RSVP</Label>
                      <p className="text-sm text-slate-500">Allow users to RSVP without account</p>
                    </div>
                    <Switch
                      id="allowAnonymousRSVP"
                      checked={settings.allowAnonymousRSVP}
                      onCheckedChange={(checked) => updateSetting('allowAnonymousRSVP', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireRSVPApproval">Require RSVP Approval</Label>
                      <p className="text-sm text-slate-500">Require admin approval for RSVPs</p>
                    </div>
                    <Switch
                      id="requireRSVPApproval"
                      checked={settings.requireRSVPApproval}
                      onCheckedChange={(checked) => updateSetting('requireRSVPApproval', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxRSVPsPerUser">Max RSVPs Per User</Label>
                    <Input
                      id="maxRSVPsPerUser"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxRSVPsPerUser}
                      onChange={(e) => updateSetting('maxRSVPsPerUser', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Resource Settings */}
            {activeSection === 'resources' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowResourceClaiming">Allow Resource Claiming</Label>
                      <p className="text-sm text-slate-500">Allow users to claim resources</p>
                    </div>
                    <Switch
                      id="allowResourceClaiming"
                      checked={settings.allowResourceClaiming}
                      onCheckedChange={(checked) => updateSetting('allowResourceClaiming', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireResourceApproval">Require Resource Approval</Label>
                      <p className="text-sm text-slate-500">Require admin approval for resources</p>
                    </div>
                    <Switch
                      id="requireResourceApproval"
                      checked={settings.requireResourceApproval}
                      onCheckedChange={(checked) => updateSetting('requireResourceApproval', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxResourcesPerUser">Max Resources Per User</Label>
                    <Input
                      id="maxResourcesPerUser"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxResourcesPerUser}
                      onChange={(e) => updateSetting('maxResourcesPerUser', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Skill Settings */}
            {activeSection === 'skills' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowPublicSkills">Allow Public Skills</Label>
                      <p className="text-sm text-slate-500">Allow skills to be visible publicly</p>
                    </div>
                    <Switch
                      id="allowPublicSkills"
                      checked={settings.allowPublicSkills}
                      onCheckedChange={(checked) => updateSetting('allowPublicSkills', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireSkillApproval">Require Skill Approval</Label>
                      <p className="text-sm text-slate-500">Require admin approval for skills</p>
                    </div>
                    <Switch
                      id="requireSkillApproval"
                      checked={settings.requireSkillApproval}
                      onCheckedChange={(checked) => updateSetting('requireSkillApproval', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxSkillsPerUser">Max Skills Per User</Label>
                    <Input
                      id="maxSkillsPerUser"
                      type="number"
                      min="1"
                      max="50"
                      value={settings.maxSkillsPerUser}
                      onChange={(e) => updateSetting('maxSkillsPerUser', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableRateLimiting">Enable Rate Limiting</Label>
                      <p className="text-sm text-slate-500">Limit requests per minute</p>
                    </div>
                    <Switch
                      id="enableRateLimiting"
                      checked={settings.enableRateLimiting}
                      onCheckedChange={(checked) => updateSetting('enableRateLimiting', checked)}
                    />
                  </div>
                  
                  {settings.enableRateLimiting && (
                    <div>
                      <Label htmlFor="maxRequestsPerMinute">Max Requests Per Minute</Label>
                      <Input
                        id="maxRequestsPerMinute"
                        type="number"
                        min="1"
                        max="1000"
                        value={settings.maxRequestsPerMinute}
                        onChange={(e) => updateSetting('maxRequestsPerMinute', parseInt(e.target.value))}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableAuditLogging">Enable Audit Logging</Label>
                      <p className="text-sm text-slate-500">Log admin actions for security</p>
                    </div>
                    <Switch
                      id="enableAuditLogging"
                      checked={settings.enableAuditLogging}
                      onCheckedChange={(checked) => updateSetting('enableAuditLogging', checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                      <p className="text-sm text-slate-500">Send email notifications to users</p>
                    </div>
                    <Switch
                      id="enableEmailNotifications"
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) => updateSetting('enableEmailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableSystemNotifications">Enable System Notifications</Label>
                      <p className="text-sm text-slate-500">Show in-app notifications</p>
                    </div>
                    <Switch
                      id="enableSystemNotifications"
                      checked={settings.enableSystemNotifications}
                      onCheckedChange={(checked) => updateSetting('enableSystemNotifications', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notificationRetentionDays">Notification Retention Days</Label>
                    <Input
                      id="notificationRetentionDays"
                      type="number"
                      min="1"
                      max="365"
                      value={settings.notificationRetentionDays}
                      onChange={(e) => updateSetting('notificationRetentionDays', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeSection === 'backup' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableAutoBackup">Enable Auto Backup</Label>
                      <p className="text-sm text-slate-500">Automatically backup system data</p>
                    </div>
                    <Switch
                      id="enableAutoBackup"
                      checked={settings.enableAutoBackup}
                      onCheckedChange={(checked) => updateSetting('enableAutoBackup', checked)}
                    />
                  </div>
                  
                  {settings.enableAutoBackup && (
                    <>
                      <div>
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select
                          value={settings.backupFrequency}
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly') => updateSetting('backupFrequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="backupRetentionDays">Backup Retention Days</Label>
                        <Input
                          id="backupRetentionDays"
                          type="number"
                          min="1"
                          max="365"
                          value={settings.backupRetentionDays}
                          onChange={(e) => updateSetting('backupRetentionDays', parseInt(e.target.value))}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
          
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
          
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Settings
          </Button>
          
          <Button variant="outline" onClick={() => setIsResetDialogOpen(true)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        {/* Reset Confirmation Dialog */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center text-orange-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Reset Settings
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to reset all settings to their default values? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReset} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Reset Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Purge Data Confirmation Dialog */}
        <Dialog open={isPurgeDialogOpen} onOpenChange={setIsPurgeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <Trash2 className="h-5 w-5 mr-2" />
                Purge All Data
              </DialogTitle>
              <DialogDescription>
                This will permanently delete all actions, resources, skills, and user data. Only admin users will remain. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPurgeDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handlePurge} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Purge All Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Settings Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Settings</DialogTitle>
              <DialogDescription>
                Select a JSON file to import system settings.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}