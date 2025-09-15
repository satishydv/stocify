"use client"

import { Badge } from "@/components/ui/badge"
import { IoCheckmark, IoClose as IoCloseIcon, IoMail } from "react-icons/io5"

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user" | "operator" | "test" | "default user" | string
  status: "active" | "inactive" | "pending"
  avatar?: string
}

export const users: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "admin",
    status: "active",
    avatar: "👨‍💼"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "manager",
    status: "active",
    avatar: "👩‍💼"
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@company.com",
    role: "user",
    status: "active",
    avatar: "👨‍💻"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "user",
    status: "inactive",
    avatar: "👩‍💻"
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@company.com",
    role: "manager",
    status: "pending",
    avatar: "👨‍🔧"
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    role: "user",
    status: "active",
    avatar: "👩‍🎨"
  },
  {
    id: "7",
    name: "Robert Taylor",
    email: "robert.taylor@company.com",
    role: "admin",
    status: "active",
    avatar: "👨‍🚀"
  },
  {
    id: "8",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@company.com",
    role: "user",
    status: "inactive",
    avatar: "👩‍⚕️"
  },
  {
    id: "9",
    name: "Christopher Lee",
    email: "christopher.lee@company.com",
    role: "manager",
    status: "active",
    avatar: "👨‍🎓"
  },
  {
    id: "10",
    name: "Amanda White",
    email: "amanda.white@company.com",
    role: "user",
    status: "pending",
    avatar: "👩‍🏫"
  }
]

export const getStatusBadge = (status: User["status"]) => {
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
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <IoMail className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    default:
      return null
  }
}

export const getRoleBadge = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          Admin
        </Badge>
      )
    case "manager":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          Manager
        </Badge>
      )
    case "user":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          User
        </Badge>
      )
    case "operator":
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
          Operator
        </Badge>
      )
    case "test":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          Test
        </Badge>
      )
    case "default user":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          Default User
        </Badge>
      )
    default:
      // For any other role names, display them as-is with a default style
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          {role?.charAt(0).toUpperCase() + role?.slice(1) || 'Unknown'}
        </Badge>
      )
  }
}
