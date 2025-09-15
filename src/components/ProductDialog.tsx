"use client"

import React, { useState } from 'react'
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
import { IoCheckmark, IoClose as IoCloseIcon, IoMail } from "react-icons/io5"
import { useProductStore } from "@/stores/productStore"

interface ProductFormData {
  name: string
  sku: string
  price: string
  category: string
  status: "published" | "inactive" | "draft"
  quantity: string
  supplier: string
}

const initialFormData: ProductFormData = {
  name: "",
  sku: "",
  price: "",
  category: "Electronics",
  status: "published",
  quantity: "",
  supplier: ""
}

const categories = [
  "Electronics",
  "Furniture", 
  "Clothing",
  "Books",
  "Toys",
  "Beauty",
  "Sports",
  "Home Decor",
  "Home Appliances",
  "Others"
]

export default function ProductDialog() {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<ProductFormData>>({})
  const addProduct = useProductStore((state) => state.addProduct)

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {}
    
    if (!formData.name.trim()) newErrors.name = "The product name is required"
    if (!formData.sku.trim()) newErrors.sku = "The SKU ref is required"
    if (!formData.price.trim()) newErrors.price = "The Price is required"
    if (!formData.quantity.trim()) newErrors.quantity = "The quantity is required"
    if (!formData.supplier.trim()) newErrors.supplier = "Supplier's name is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Add product to store
      addProduct({
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        category: formData.category,
        status: formData.status,
        quantityInStock: parseInt(formData.quantity),
        supplier: formData.supplier,
        icon: "📦" // Default icon for new products
      })
      
      // Reset form after successful submission
      setFormData(initialFormData)
      setErrors({})
    }
  }

  const getStatusIcon = (status: ProductFormData["status"]) => {
    switch (status) {
      case "published":
        return <IoCheckmark className="w-4 h-4" />
      case "inactive":
        return <IoCloseIcon className="w-4 h-4" />
      case "draft":
        return <IoMail className="w-4 h-4" />
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10">Add Product</Button>
      </DialogTrigger>
      <DialogContent className="p-7 px-8 poppins min-w-6xl min-h-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[22px]">Add Product</DialogTitle>
          <DialogDescription>
            Fill in the form to add a new product.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        
        <div className="flex flex-col gap-2 mt-1">
          {/* First row: Product Name and SKU */}
          <div className="grid grid-cols-2 gap-7">
            <div className="flex flex-col gap-2">
              <Label htmlFor="product-name">Product's Name</Label>
              <div className="relative">
                <Input
                  id="product-name"
                  placeholder="Laptop..."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  📖
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
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="ABC001"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                className={errors.sku ? "border-red-500" : ""}
              />
              {errors.sku && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.sku}
                </div>
              )}
            </div>
          </div>

          {/* Second row: Supplier and Category */}
          <div className="grid grid-cols-2 gap-5 items-center mt-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="supplier">Supplier's name</Label>
              <Input
                id="supplier"
                placeholder="TechWorld..."
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                className={errors.supplier ? "border-red-500" : ""}
              />
              {errors.supplier && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.supplier}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Product's Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Third row: Status, Quantity, and Price */}
          <div className="mt-3 grid grid-cols-3 gap-7 max-lg:grid-cols-2 max-lg:gap-1 max-sm:grid-cols-1">
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                {(["published", "inactive", "draft"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={formData.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange("status", status)}
                    className="flex items-center gap-1"
                  >
                    {getStatusIcon(status)}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="34"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.quantity}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.price}
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
          <Button onClick={handleSubmit} className="h-11 px-11 bg-red-600 hover:bg-red-700">
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
