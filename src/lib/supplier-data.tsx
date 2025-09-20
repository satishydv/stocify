"use client"

import { Badge } from "@/components/ui/badge"
import { IoCheckmark, IoClose as IoCloseIcon, IoMail, IoCall, IoGlobe, IoLocation } from "react-icons/io5"

export type Supplier = {
  id: string
  name: string
  email: string
  phone: string
  companyLocation: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  gstin?: string
  category: string
  website?: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Dummy data removed - now using API integration

export const getStatusBadge = (status: Supplier["status"]) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <IoCheckmark className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <IoCloseIcon className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      )
    default:
      return null
  }
}

export const getCategoryBadge = (category: Supplier["category"]) => {
  // Generate a consistent color based on category name
  const colors = [
    "bg-blue-100 text-blue-700 hover:bg-blue-100",
    "bg-purple-100 text-purple-700 hover:bg-purple-100", 
    "bg-pink-100 text-pink-700 hover:bg-pink-100",
    "bg-orange-100 text-orange-700 hover:bg-orange-100",
    "bg-green-100 text-green-700 hover:bg-green-100",
    "bg-gray-100 text-gray-700 hover:bg-gray-100",
    "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    "bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
  ]
  
  // Use category name to determine color index
  const colorIndex = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  
  return (
    <Badge className={colors[colorIndex]}>
      {category}
    </Badge>
  )
}

export const formatLocation = (location: Supplier["companyLocation"]) => {
  return `${location.street}, ${location.city}, ${location.state} ${location.zip}, ${location.country}`
}
