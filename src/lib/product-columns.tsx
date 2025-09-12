"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product, getStatusBadge } from "./product-data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoCopy, IoCreate, IoTrash, IoEllipsisVertical } from "react-icons/io5"

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg">{product.icon}</span>
          <span className="font-medium">{product.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "sku",
    header: "Sku",
    cell: ({ row }) => {
      return <span className="text-muted-foreground">{row.getValue("sku")}</span>
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <span className="font-medium">{formatted}</span>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <span className="text-muted-foreground">{row.getValue("category")}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Product["status"]
      return getStatusBadge(status)
    },
  },
  {
    accessorKey: "quantityInStock",
    header: "Quantity In Stock",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("quantityInStock")}</span>
    },
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => {
      return <span className="text-muted-foreground">{row.getValue("supplier")}</span>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const product = row.original

      const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(product, null, 2))
        // You can add a toast notification here
        console.log("Product copied to clipboard")
      }

      const handleEdit = () => {
        // You can add edit functionality here
        console.log("Edit product:", product.id)
      }

      const handleDelete = () => {
        // You can add delete functionality here
        console.log("Delete product:", product.id)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IoEllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopy}>
              <IoCopy className="mr-2 h-4 w-4" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <IoCreate className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <IoTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
