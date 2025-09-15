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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUserStore } from "@/stores/userStore"

interface Role {
  id: number
  name: string
}

interface UserFormData {
  name: string
  email: string
  password: string
  address: string
  role_id: number
}

const initialFormData: UserFormData = {
  name: "",
  email: "",
  password: "",
  address: "",
  role_id: 0
}

export default function UserDialog() {
  const [formData, setFormData] = useState<UserFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<UserFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const addUser = useUserStore((state) => state.addUser)

  // Fetch roles when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchRoles()
    }
  }, [isOpen])

  const fetchRoles = async () => {
    setIsLoadingRoles(true)
    try {
      const response = await fetch('/api/roles')
      const result = await response.json()
      
      if (response.ok) {
        setRoles(result.roles)
        // Set default role if none selected
        if (formData.role_id === 0 && result.roles.length > 0) {
          setFormData(prev => ({ ...prev, role_id: result.roles[0].id }))
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

  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {}
    
    if (!formData.name.trim()) newErrors.name = "The user name is required"
    if (!formData.email.trim()) newErrors.email = "The email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.password.trim()) newErrors.password = "The password is required"
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (!formData.address.trim()) newErrors.address = "The address is required"
    if (!formData.role_id || formData.role_id === 0) newErrors.role_id = "Please select a role"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          role_id: formData.role_id
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Find the selected role name
        const selectedRole = roles.find(role => role.id === formData.role_id)
        
        // Add user to store
        addUser({
          name: formData.name,
          email: formData.email,
          role: selectedRole?.name.toLowerCase() as "admin" | "manager" | "user" || "user"
        })
        
        // Reset form and close dialog
        setFormData(initialFormData)
        setErrors({})
        setIsOpen(false)
      } else {
        // Handle API error
        setErrors({ name: result.error || 'Failed to create user' })
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setErrors({ name: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-10">Add User</Button>
      </DialogTrigger>
      <DialogContent className="p-7 px-8 poppins min-w-4xl min-h-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[22px]">Add User</DialogTitle>
          <DialogDescription>
            Fill in the form to add a new user.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        
        <div className="flex flex-col gap-2 mt-1">
          {/* First row: Name and Email */}
          <div className="grid grid-cols-2 gap-7">
            <div className="flex flex-col gap-2">
              <Label htmlFor="user-name">User's Name</Label>
              <div className="relative">
                <Input
                  id="user-name"
                  placeholder="John Smith..."
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.smith@company.com"
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

          {/* Second row: Password and Role */}
          <div className="grid grid-cols-2 gap-7 mt-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password..."
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.password}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State, ZIP..."
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
          <DialogClose asChild>
            <Button variant="secondary" className="h-11 px-11">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="h-11 px-11 bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
