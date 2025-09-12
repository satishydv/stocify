"use client"

import { Badge } from "@/components/ui/badge"
import { IoCheckmark, IoClose as IoCloseIcon, IoMail } from "react-icons/io5"
import { IoHammer, IoPhonePortrait, IoLaptop, IoMic, IoHome, IoTabletPortrait, IoTool } from "react-icons/io5"

export type Product = {
  id: string
  name: string
  sku: string
  price: number
  category: string
  status: "published" | "inactive" | "draft"
  quantityInStock: number
  supplier: string
  icon: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Screwdriver",
    sku: "SD123",
    price: 12.99,
    category: "Others",
    status: "draft",
    quantityInStock: 50,
    supplier: "ToolSupplier Inc.",
    icon: "🔧"
  },
  {
    id: "2",
    name: "Hammer",
    sku: "HM456",
    price: 15.50,
    category: "Others",
    status: "published",
    quantityInStock: 30,
    supplier: "ToolSupplier Inc.",
    icon: "🔨"
  },
  {
    id: "3",
    name: "Smartphone",
    sku: "SP789",
    price: 499.99,
    category: "Electronics",
    status: "published",
    quantityInStock: 100,
    supplier: "TechWorld",
    icon: "📱"
  },
  {
    id: "4",
    name: "Laptop",
    sku: "LT101",
    price: 899.99,
    category: "Electronics",
    status: "inactive",
    quantityInStock: 25,
    supplier: "TechWorld",
    icon: "💻"
  },
  {
    id: "5",
    name: "Microwave Oven",
    sku: "MO202",
    price: 120.00,
    category: "Furniture",
    status: "draft",
    quantityInStock: 15,
    supplier: "HomeGoods Co.",
    icon: "📺"
  },
  {
    id: "6",
    name: "Washing Machine",
    sku: "WM303",
    price: 450.00,
    category: "Home Decor",
    status: "published",
    quantityInStock: 10,
    supplier: "HomeGoods Co.",
    icon: "🏠"
  },
  {
    id: "7",
    name: "Refrigerator",
    sku: "RF404",
    price: 799.99,
    category: "Home Appliances",
    status: "inactive",
    quantityInStock: 8,
    supplier: "HomeGoods Co.",
    icon: "❄️"
  },
  {
    id: "8",
    name: "Tablet",
    sku: "TB505",
    price: 199.99,
    category: "Electronics",
    status: "draft",
    quantityInStock: 60,
    supplier: "TechWorld",
    icon: "📱"
  }
]

export const getStatusBadge = (status: Product["status"]) => {
  switch (status) {
    case "published":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <IoCheckmark className="w-3 h-3 mr-1" />
          Published
        </Badge>
      )
    case "inactive":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <IoCloseIcon className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      )
    case "draft":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          <IoMail className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      )
    default:
      return null
  }
}
