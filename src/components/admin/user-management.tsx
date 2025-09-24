'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUsers, User } from "@/hooks/use-users"
import { useUserRole } from "@/hooks/use-user-role"
import { getUserDisplayName, getAdminDisplayName } from "@/lib/user-display"
import { Users, Search, Filter, MoreHorizontal, Shield, UserCheck, UserX, Trash2, Eye, Loader2, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function UserManagement() {
  const { users, loading, error, updateUserRole, deleteUser } = useUsers()
  const { user: currentUser } = useUserRole()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleRoleChange = async (userId: string, newRole: 'public' | 'verified' | 'admin') => {
    try {
      setActionLoading(true)
      await updateUserRole(userId, newRole)
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      setActionLoading(true)
      await deleteUser(userId)
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'verified':
        return 'secondary'
      case 'public':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'verified':
        return <UserCheck className="h-4 w-4" />
      case 'public':
        return <UserX className="h-4 w-4" />
      default:
        return <UserX className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading users...</span>
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
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertTriangle className="h-8 w-8 mr-2" />
            <span>Error loading users: {error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 text-blue-500 mr-2" />
          User Management
        </CardTitle>
        <CardDescription>
          Manage user accounts, roles, and permissions. Total users: {users.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No users found matching your criteria.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role)}
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {getAdminDisplayName({
                          id: user.id,
                          username: user.username,
                          email: user.email
                        })}
                      </div>
                      <div className="text-sm text-slate-500">
                        Joined {formatDate(user.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user)
                          setIsUserDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      
                      {user.id !== currentUser?.id && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, 'verified')}
                            disabled={actionLoading || user.role === 'verified'}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Make Verified
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, 'admin')}
                            disabled={actionLoading || user.role === 'admin'}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, 'public')}
                            disabled={actionLoading || user.role === 'public'}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Make Public
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>

        {/* User Details Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                View and manage user information
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <p className="text-slate-900 dark:text-white">{selectedUser.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getRoleIcon(selectedUser.role)}
                    <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Created At
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {formatDate(selectedUser.created_at)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Last Updated
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {formatDate(selectedUser.updated_at)}
                  </p>
                </div>
                
                {selectedUser.encrypted_contact && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Contact Information
                    </label>
                    <p className="text-slate-900 dark:text-white">
                      {selectedUser.encrypted_contact}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Delete User
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="py-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="font-medium text-red-800 dark:text-red-200">
                    User: {selectedUser.email}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Role: {selectedUser.role}
                  </p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
                disabled={actionLoading}
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}