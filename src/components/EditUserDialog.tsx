"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUserStore } from "@/stores/userStore"
import { User } from "@/lib/user-data"
import { toast } from "sonner"

interface Role {
  id: number
  name: string
}

interface EditUserFormData {
  name: string
  email: string
  address: string
  role_id: number
}

interface EditUserDialogProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export default function EditUserDialog({ user, isOpen, onClose }: EditUserDialogProps) {
  const [formData, setFormData] = useState<EditUserFormData>({
    name: "",
    email: "",
    address: "",
    role_id: 0
  })
  const [errors, setErrors] = useState<Partial<EditUserFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const { updateUser, fetchUsers } = useUserStore()

  // Fetch roles when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchRoles()
    }
  }, [isOpen])

  // Populate form when user changes
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: (user as any).address || "",
        role_id: 0 // Will be set after roles are loaded
      })
      setErrors({})
    }
  }, [user, isOpen])

  const fetchRoles = async () => {
    setIsLoadingRoles(true)
    try {
      const response = await fetch('/api/roles')
      const result = await response.json()
      
      if (response.ok) {
        setRoles(result.roles)
        // Set the current user's role if available
        if (user && result.roles.length > 0) {
          const currentRole = result.roles.find((role: Role) => 
            role.name.toLowerCase() === user.role.toLowerCase()
          )
          if (currentRole) {
            setFormData(prev => ({ ...prev, role_id: currentRole.id }))
          }
        }
      } else {
        console.error('Failed to fetch roles:', result.error)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setIsLoadingRoles(false)
    }
  }

  const handleInputChange = (field: keyof EditUserFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<EditUserFormData> = {}
    
    if (!formData.name.trim()) newErrors.name = "The user name is required"
    if (!formData.email.trim()) newErrors.email = "The email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.role_id || formData.role_id === 0) newErrors.role_id = "Please select a role"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!user || !validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          role_id: formData.role_id
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Find the selected role name
        const selectedRole = roles.find(role => role.id === formData.role_id)
        
        // Update user in store
        updateUser(user.id, {
          name: formData.name,
          email: formData.email,
          role: selectedRole?.name.toLowerCase() as any || user.role,
          address: formData.address
        })
        
        // Refresh users list
        fetchUsers()
        
        toast.success(`User "${formData.name}" updated successfully`)
        onClose()
      } else {
        // Handle API error
        setErrors({ name: result.error || 'Failed to update user' })
        toast.error(result.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setErrors({ name: 'Network error. Please try again.' })
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-7 px-8 poppins min-w-4xl min-h-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[22px]">Edit User</DialogTitle>
          <DialogDescription>
            Update the user information below.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        
        <div className="flex flex-col gap-2 mt-1">
          {/* First row: Name and Email */}
          <div className="grid grid-cols-2 gap-7">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-user-name">User's Name</Label>
              <div className="relative">
                <Input
                  id="edit-user-name"
                  placeholder="Enter user's name..."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  👤
                </Button>
              </div>
              {errors.name && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.name}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter user's email..."
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Second row: Role */}
          <div className="grid grid-cols-2 gap-7 mt-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                value={formData.role_id}
                onChange={(e) => handleInputChange("role_id", parseInt(e.target.value))}
                disabled={isLoadingRoles}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.role_id ? "border-red-500" : ""}`}
              >
                {isLoadingRoles ? (
                  <option value={0}>Loading roles...</option>
                ) : (
                  <>
                    <option value={0}>Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.role_id && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.role_id}
                </div>
              )}
            </div>
          </div>

          {/* Third row: Address */}
          <div className="mt-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                placeholder="Enter user's address..."
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.address}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-9 mb-4 flex items-center gap-4">
          <Button variant="secondary" onClick={onClose} className="h-11 px-11">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="h-11 px-11 bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
