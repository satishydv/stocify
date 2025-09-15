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
import { Checkbox } from "@/components/ui/checkbox"
import { useRoleStore } from "@/stores/roleStore"
import { Role, moduleNames } from "@/lib/role-data"
import { toast } from "sonner"

interface EditRoleFormData {
  name: string
  permissions: {
    dashboard: { create: boolean; read: boolean; update: boolean; delete: boolean }
    products: { create: boolean; read: boolean; update: boolean; delete: boolean }
    users: { create: boolean; read: boolean; update: boolean; delete: boolean }
    orders: { create: boolean; read: boolean; update: boolean; delete: boolean }
    stocks: { create: boolean; read: boolean; update: boolean; delete: boolean }
    sales: { create: boolean; read: boolean; update: boolean; delete: boolean }
    reports: { create: boolean; read: boolean; update: boolean; delete: boolean }
    suppliers: { create: boolean; read: boolean; update: boolean; delete: boolean }
    categories: { create: boolean; read: boolean; update: boolean; delete: boolean }
  }
}

interface EditRoleDialogProps {
  role: Role | null
  isOpen: boolean
  onClose: () => void
}

const initialFormData: EditRoleFormData = {
  name: "",
  permissions: {
    dashboard: { create: false, read: false, update: false, delete: false },
    products: { create: false, read: false, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    orders: { create: false, read: false, update: false, delete: false },
    stocks: { create: false, read: false, update: false, delete: false },
    sales: { create: false, read: false, update: false, delete: false },
    reports: { create: false, read: false, update: false, delete: false },
    suppliers: { create: false, read: false, update: false, delete: false },
    categories: { create: false, read: false, update: false, delete: false },
  }
}

export default function EditRoleDialog({ role, isOpen, onClose }: EditRoleDialogProps) {
  const [formData, setFormData] = useState<EditRoleFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<EditRoleFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateRole, fetchRoles } = useRoleStore()

  // Populate form when role changes
  useEffect(() => {
    if (role && isOpen) {
      setFormData({
        name: role.name || "",
        permissions: role.permissions || initialFormData.permissions
      })
      setErrors({})
    }
  }, [role, isOpen])

  const handleInputChange = (field: keyof EditRoleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePermissionChange = (module: string, permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module as keyof typeof prev.permissions],
          [permission]: checked
        }
      }
    }))
  }

  const areAllPermissionsSelected = () => {
    return moduleNames.every(module => {
      const modulePermissions = formData.permissions[module]
      return modulePermissions.create && modulePermissions.read && 
             modulePermissions.update && modulePermissions.delete
    })
  }

  const handleSelectAllPermissions = (checked: boolean) => {
    const newPermissions = { ...formData.permissions }
    
    moduleNames.forEach(module => {
      newPermissions[module] = {
        create: checked,
        read: checked,
        update: checked,
        delete: checked
      }
    })

    setFormData(prev => ({
      ...prev,
      permissions: newPermissions
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<EditRoleFormData> = {}
    
    if (!formData.name.trim()) newErrors.name = "The role name is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!role || !validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/roles/${role.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          permissions: formData.permissions
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Update role in store
        updateRole(role.id, {
          name: formData.name,
          permissions: formData.permissions
        })
        
        // Refresh roles list
        fetchRoles()
        
        toast.success(`Role "${formData.name}" updated successfully`)
        onClose()
      } else {
        // Handle API error
        setErrors({ name: result.error || 'Failed to update role' })
        toast.error(result.error || 'Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      setErrors({ name: 'Network error. Please try again.' })
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!role) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-7 px-8 poppins min-w-6xl min-h-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[22px]">Edit Role</DialogTitle>
          <DialogDescription>
            Update the role information and permissions below.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        
        <div className="flex flex-col gap-4 mt-1">
          {/* Role Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-role-name">Role Name</Label>
            <Input
              id="edit-role-name"
              placeholder="Manager, Viewer, Admin, Super Admin, etc..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                {errors.name}
              </div>
            )}
          </div>

          {/* Permissions Section */}
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-4">
              <Label className="text-lg font-medium">Permissions</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-select-all-permissions"
                  checked={areAllPermissionsSelected()}
                  onCheckedChange={handleSelectAllPermissions}
                />
                <Label htmlFor="edit-select-all-permissions" className="text-sm font-medium">
                  Select All
                </Label>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Set permissions for each module (C=Create, R=Read, U=Update, D=Delete)
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {moduleNames.map((module) => (
                <div key={module} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 capitalize">{module}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${module}-create`}
                        checked={formData.permissions[module].create}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(module, 'create', checked as boolean)
                        }
                      />
                      <Label htmlFor={`edit-${module}-create`} className="text-sm">Create</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${module}-read`}
                        checked={formData.permissions[module].read}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(module, 'read', checked as boolean)
                        }
                      />
                      <Label htmlFor={`edit-${module}-read`} className="text-sm">Read</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${module}-update`}
                        checked={formData.permissions[module].update}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(module, 'update', checked as boolean)
                        }
                      />
                      <Label htmlFor={`edit-${module}-update`} className="text-sm">Update</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${module}-delete`}
                        checked={formData.permissions[module].delete}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(module, 'delete', checked as boolean)
                        }
                      />
                      <Label htmlFor={`edit-${module}-delete`} className="text-sm">Delete</Label>
                    </div>
                  </div>
                </div>
              ))}
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
            {isSubmitting ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
