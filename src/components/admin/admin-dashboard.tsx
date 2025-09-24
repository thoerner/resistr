'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUserRole } from "@/hooks/use-user-role"
import { useSystemData } from "@/hooks/use-system-data"
import { UserManagement } from "./user-management"
import { DataManagement } from "./data-management"
import { SystemSettings } from "./system-settings"
import { Users, Trash2, Shield, Database, Loader2, Settings } from "lucide-react"
import { useState } from "react"

export function AdminDashboard() {
  const { isAdmin, loading, user } = useUserRole()
  const { stats, loading: statsLoading, error: statsError } = useSystemData()
  const [purging, setPurging] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'data' | 'settings'>('overview')

  // Debug logging
  console.log('Admin Dashboard - Stats:', stats)
  console.log('Admin Dashboard - Stats Loading:', statsLoading)
  console.log('Admin Dashboard - Stats Error:', statsError)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Checking admin status...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          You need admin privileges to access this page.
        </p>
        <p className="text-sm text-slate-500">
          Current user: {user?.email || 'Not signed in'}
        </p>
      </div>
    )
  }

  const handlePurgeData = async () => {
    if (!confirm('Are you sure you want to purge ALL data? This action cannot be undone!')) {
      return
    }

    setPurging(true)
    try {
      // This would call the manual_purge_all_data function
      // For now, just show a success message
      alert('Data purge functionality will be implemented with the database function')
    } catch (error) {
      console.error('Error purging data:', error)
      alert('Error purging data. Please try again.')
    } finally {
      setPurging(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Manage users, data, and system settings. Use with caution.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            Data Management
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            System Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Admin Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                Admin Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Signed in as: <span className="font-medium">{user?.email}</span>
                  </p>
                  <p className="text-sm text-slate-500">
                    Role: Admin
                  </p>
                </div>
                <Badge variant="default" className="bg-green-500">
                  Active Admin
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts and roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('users')}
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 text-purple-500 mr-2" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  View and manage system data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('data')}
                >
                  View Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 text-orange-500 mr-2" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Current system status and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">Error loading statistics: {statsError}</p>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {statsLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : stats?.totalUsers || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {statsLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : stats?.totalActions || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Active Actions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {statsLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : stats?.totalResources || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Resources</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Trash2 className="h-5 w-5 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions. Use with extreme caution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Purge All Data
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    This will permanently delete all actions, resources, skills, and user data. 
                    Only admin users will remain. This action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handlePurgeData}
                    disabled={purging}
                    className="flex items-center gap-2"
                  >
                    {purging && <Loader2 className="h-4 w-4 animate-spin" />}
                    {purging ? 'Purging...' : 'Purge All Data'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <UserManagement />
      )}

      {/* Data Management Tab */}
      {activeTab === 'data' && (
        <DataManagement />
      )}

      {/* System Settings Tab */}
      {activeTab === 'settings' && (
        <SystemSettings />
      )}
    </div>
  )
}