"use client"

import { Badge } from "@/components/ui/badge"
import { IoShield, IoShieldCheckmark, IoPerson } from "react-icons/io5"

export type Role = {
  id: string
  name: string
  type: string // Changed to string to allow any role type
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
  createdAt: string
  updatedAt: string
}

export const roles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    type: "superadmin",
    permissions: {
      dashboard: { create: true, read: true, update: true, delete: true },
      products: { create: true, read: true, update: true, delete: true },
      users: { create: true, read: true, update: true, delete: true },
      orders: { create: true, read: true, update: true, delete: true },
      stocks: { create: true, read: true, update: true, delete: true },
      sales: { create: true, read: true, update: true, delete: true },
      reports: { create: true, read: true, update: true, delete: true },
      suppliers: { create: true, read: true, update: true, delete: true },
      categories: { create: true, read: true, update: true, delete: true },
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "2",
    name: "Admin",
    type: "admin",
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false },
      products: { create: true, read: true, update: true, delete: false },
      users: { create: false, read: true, update: true, delete: false },
      orders: { create: true, read: true, update: true, delete: false },
      stocks: { create: true, read: true, update: true, delete: false },
      sales: { create: false, read: true, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      suppliers: { create: true, read: true, update: true, delete: false },
      categories: { create: true, read: true, update: true, delete: false },
    },
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02"
  },
  {
    id: "3",
    name: "Manager",
    type: "user",
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false },
      products: { create: false, read: true, update: true, delete: false },
      users: { create: false, read: true, update: false, delete: false },
      orders: { create: true, read: true, update: true, delete: false },
      stocks: { create: false, read: true, update: true, delete: false },
      sales: { create: false, read: true, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      suppliers: { create: false, read: true, update: false, delete: false },
      categories: { create: false, read: true, update: false, delete: false },
    },
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03"
  },
  {
    id: "4",
    name: "Viewer",
    type: "user",
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false },
      products: { create: false, read: true, update: false, delete: false },
      users: { create: false, read: true, update: false, delete: false },
      orders: { create: false, read: true, update: false, delete: false },
      stocks: { create: false, read: true, update: false, delete: false },
      sales: { create: false, read: true, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      suppliers: { create: false, read: true, update: false, delete: false },
      categories: { create: false, read: true, update: false, delete: false },
    },
    createdAt: "2024-01-04",
    updatedAt: "2024-01-04"
  }
]

export const getRoleTypeBadge = (type: string) => {
  // Dynamic badge based on role type
  const getBadgeColor = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('super') || lowerType.includes('admin')) {
      return "bg-purple-100 text-purple-700 hover:bg-purple-100"
    } else if (lowerType.includes('admin')) {
      return "bg-blue-100 text-blue-700 hover:bg-blue-100"
    } else if (lowerType.includes('manager')) {
      return "bg-green-100 text-green-700 hover:bg-green-100"
    } else {
      return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  const getIcon = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('super')) {
      return <IoShieldCheckmark className="w-3 h-3 mr-1" />
    } else if (lowerType.includes('admin')) {
      return <IoShield className="w-3 h-3 mr-1" />
    } else {
      return <IoPerson className="w-3 h-3 mr-1" />
    }
  }

  return (
    <Badge className={getBadgeColor(type)}>
      {getIcon(type)}
      {type}
    </Badge>
  )
}

export const moduleNames = [
  "dashboard",
  "products", 
  "users",
  "orders",
  "stocks",
  "sales",
  "reports",
  "suppliers",
  "categories"
] as const

export type ModuleName = typeof moduleNames[number]
