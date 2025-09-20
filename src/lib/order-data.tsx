"use client"

import { Badge } from "@/components/ui/badge"
import { IoCheckmark, IoClose as IoCloseIcon, IoMail, IoTime, IoCar, IoCheckmarkCircle } from "react-icons/io5"

export type Order = {
  id: string
  orderDate: string
  name: string
  sku: string
  supplier: string
  category: string
  numberOfItems: number
  status: "new" | "in_progress" | "fulfilled" | "shipped" | "canceled"
  expectedDeliveryDate: string
  totalAmount: number
}

// Dummy data removed - all data now comes from API/database

export const getOrderStatusBadge = (status: Order["status"]) => {
  switch (status) {
    case "new":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <IoMail className="w-3 h-3 mr-1" />
          New
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <IoTime className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      )
    case "fulfilled":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <IoCheckmarkCircle className="w-3 h-3 mr-1" />
          Fulfilled
        </Badge>
      )
    case "shipped":
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          <IoCar className="w-3 h-3 mr-1" />
          Shipped
        </Badge>
      )
    case "canceled":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <IoCloseIcon className="w-3 h-3 mr-1" />
          Canceled
        </Badge>
      )
    default:
      return null
  }
}
