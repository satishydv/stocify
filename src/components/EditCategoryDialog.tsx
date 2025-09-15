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
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCategoryStore } from "@/stores/categoryStore"
import { Category } from "@/lib/category-data"
import { toast } from "sonner"

interface CategoryFormData {
  name: string
  code: string
  status: Category["status"]
}

const initialFormData: CategoryFormData = {
  name: "",
  code: "",
  status: "active"
}

export default function EditCategoryDialog({ category, isOpen, onClose }: EditCategoryDialogProps) {
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateCategory } = useCategoryStore()

  // Populate form when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        code: category.code,
        status: category.status
      })
      setErrors({})
    }
  }, [category])

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters"
    }
    
    if (!formData.code.trim()) {
      newErrors.code = "Category code is required"
    } else if (formData.code.trim().length < 2) {
      newErrors.code = "Category code must be at least 2 characters"
    } else if (!/^[A-Z0-9]+$/.test(formData.code.trim())) {
      newErrors.code = "Category code must contain only uppercase letters and numbers"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!category || !validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          status: formData.status
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Update category in store
        updateCategory(category.id, {
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          status: formData.status
        })
        
        // Close dialog
        onClose()
        toast.success(`Category "${formData.name}" updated successfully`)
      } else {
        // Handle API error
        setErrors({ name: result.error || 'Failed to update category' })
        toast.error(result.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      setErrors({ name: 'Network error. Please try again.' })
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-7 px-8 poppins min-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[22px]">Edit Category</DialogTitle>
          <DialogDescription>
            Update the category information below.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        
        <div className="flex flex-col gap-4 mt-1">
          {/* Category Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-category-name">Category Name</Label>
            <Input
              id="edit-category-name"
              placeholder="Enter category name (e.g., Electronics, Furniture)..."
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

          {/* Category Code */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-category-code">Category Code</Label>
            <Input
              id="edit-category-code"
              placeholder="Enter unique code (e.g., ELEC, FURN)..."
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
              className={errors.code ? "border-red-500" : ""}
              maxLength={10}
            />
            {errors.code && (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                {errors.code}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Use uppercase letters and numbers only (max 10 characters)
            </p>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-category-status">Status</Label>
            <select
              id="edit-category-status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value as Category["status"])}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
            {isSubmitting ? 'Updating...' : 'Update Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface EditCategoryDialogProps {
  category: Category | null
  isOpen: boolean
  onClose: () => void
}
