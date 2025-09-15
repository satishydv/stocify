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
import { useSupplierStore } from "@/stores/supplierStore"
import { Supplier } from "@/lib/supplier-data"
import { toast } from "sonner"

interface SupplierFormData {
  name: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  gstin: string
  category: Supplier["category"]
  website: string
  status: Supplier["status"]
}

const initialFormData: SupplierFormData = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "USA",
  gstin: "",
  category: "Other",
  website: "",
  status: "active"
}

const categories: Supplier["category"][] = [
  "Electronics",
  "Home Appliances", 
  "Fashion",
  "Books",
  "Sports",
  "Other"
]

export default function EditSupplierDialog({ supplier, isOpen, onClose }: EditSupplierDialogProps) {
  const [formData, setFormData] = useState<SupplierFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<SupplierFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateSupplier } = useSupplierStore()

  // Populate form when supplier changes
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        street: supplier.companyLocation.street,
        city: supplier.companyLocation.city,
        state: supplier.companyLocation.state,
        zip: supplier.companyLocation.zip,
        country: supplier.companyLocation.country,
        gstin: supplier.gstin || "",
        category: supplier.category,
        website: supplier.website || "",
        status: supplier.status
      })
      setErrors({})
    }
  }, [supplier])

  const handleInputChange = (field: keyof SupplierFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<SupplierFormData> = {}
    
    if (!formData.name.trim()) newErrors.name = "Supplier name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.street.trim()) newErrors.street = "Street address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.zip.trim()) newErrors.zip = "ZIP code is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!supplier || !validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/suppliers/${supplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          companyLocation: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          },
          gstin: formData.gstin || undefined,
          category: formData.category,
          website: formData.website || undefined,
          status: formData.status
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Update supplier in store
        updateSupplier(supplier.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          companyLocation: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          },
          gstin: formData.gstin || undefined,
          category: formData.category,
          website: formData.website || undefined,
          status: formData.status
        })
        
        // Close dialog
        onClose()
        toast.success(`Supplier "${formData.name}" updated successfully`)
      } else {
        // Handle API error
        setErrors({ name: result.error || 'Failed to update supplier' })
        toast.error(result.error || 'Failed to update supplier')
      }
    } catch (error) {
      console.error('Error updating supplier:', error)
      setErrors({ name: 'Network error. Please try again.' })
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!supplier) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-7 px-8 poppins min-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[22px]">Edit Supplier</DialogTitle>
          <DialogDescription>
            Update the supplier information below.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        
        <div className="flex flex-col gap-4 mt-1">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            {/* First row: Name and Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-supplier-name">Supplier Name</Label>
                <Input
                  id="edit-supplier-name"
                  placeholder="Enter supplier name..."
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-supplier-email">Email Address</Label>
                <Input
                  id="edit-supplier-email"
                  type="email"
                  placeholder="supplier@company.com"
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

            {/* Second row: Phone and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-supplier-phone">Phone Number</Label>
                <Input
                  id="edit-supplier-phone"
                  placeholder="+1-555-0123"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.phone}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-supplier-category">Category</Label>
                <select
                  id="edit-supplier-category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value as Supplier["category"])}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company Location</h3>
            
            {/* Street Address */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-supplier-street">Street Address</Label>
              <Input
                id="edit-supplier-street"
                placeholder="123 Main Street"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className={errors.street ? "border-red-500" : ""}
              />
              {errors.street && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.street}
                </div>
              )}
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-supplier-city">City</Label>
                <Input
                  id="edit-supplier-city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.city}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-supplier-state">State</Label>
                <Input
                  id="edit-supplier-state"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.state}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-supplier-zip">ZIP Code</Label>
                <Input
                  id="edit-supplier-zip"
                  placeholder="10001"
                  value={formData.zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  className={errors.zip ? "border-red-500" : ""}
                />
                {errors.zip && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.zip}
                  </div>
                )}
              </div>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-supplier-country">Country</Label>
              <Input
                id="edit-supplier-country"
                placeholder="USA"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.country}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-supplier-gstin">GSTIN (Optional)</Label>
                <Input
                  id="edit-supplier-gstin"
                  placeholder="29ABCDE1234F1Z5"
                  value={formData.gstin}
                  onChange={(e) => handleInputChange("gstin", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-supplier-website">Website (Optional)</Label>
                <Input
                  id="edit-supplier-website"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-supplier-status">Status</Label>
              <select
                id="edit-supplier-status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value as Supplier["status"])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
            {isSubmitting ? 'Updating...' : 'Update Supplier'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface EditSupplierDialogProps {
  supplier: Supplier | null
  isOpen: boolean
  onClose: () => void
}