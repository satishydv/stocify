"use client"

import { Badge } from "@/components/ui/badge"
import { IoCheckmark, IoClose as IoCloseIcon, IoTime, IoAlert } from "react-icons/io5"

export type Stock = {
  id: number
  sku: string
  productName: string
  category: string
  quantityAvailable: number
  minimumStockLevel: number
  maximumStockLevel: number
  status: "active" | "high" | "low" | "out_of_stock"
  unitCost: number
  supplier: string
  lastUpdated: string
  createdAt: string
}

export const getStockStatusBadge = (status: Stock["status"]) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <IoCheckmark className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case "high":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <IoAlert className="w-3 h-3 mr-1" />
          High
        </Badge>
      )
    case "low":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <IoTime className="w-3 h-3 mr-1" />
          Low
        </Badge>
      )
    case "out_of_stock":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <IoCloseIcon className="w-3 h-3 mr-1" />
          Out of Stock
        </Badge>
      )
    default:
      return null
  }
}
