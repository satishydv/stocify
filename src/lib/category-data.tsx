"use client"

import { Badge } from "@/components/ui/badge"
import { IoCheckmark, IoClose as IoCloseIcon } from "react-icons/io5"

export type Category = {
  id: string
  name: string
  code: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Dummy data removed - now using API integration

export const getStatusBadge = (status: Category["status"]) => {
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
