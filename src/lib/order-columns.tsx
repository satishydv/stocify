"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Order, getOrderStatusBadge } from "./order-data"
import { useOrderStore } from "@/stores/orderStore"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoCopy, IoCreate, IoTrash, IoEllipsisVertical } from "react-icons/io5"

export const useOrderColumns = (onEditOrder?: (order: Order) => void): ColumnDef<Order>[] => {
  const { deleteOrder } = useOrderStore()

  return [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("id")}</span>
      },
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("orderDate"))
        return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("name")}</span>
      },
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => {
        return <span className="text-muted-foreground">{row.getValue("sku")}</span>
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return <span className="text-muted-foreground">{row.getValue("category")}</span>
      },
    },
    {
      accessorKey: "numberOfItems",
      header: "No. of Items",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("numberOfItems")}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Order["status"]
        return getOrderStatusBadge(status)
      },
    },
    {
      accessorKey: "expectedDeliveryDate",
      header: "Expected Delivery",
      cell: ({ row }) => {
        const date = new Date(row.getValue("expectedDeliveryDate"))
        return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <span className="font-medium">{formatted}</span>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const order = row.original

        const handleCopy = () => {
          navigator.clipboard.writeText(JSON.stringify(order, null, 2))
          // You can add a toast notification here
          console.log("Order copied to clipboard")
        }

        const handleEdit = () => {
          if (onEditOrder) {
            onEditOrder(order)
          }
        }

        const handleDelete = () => {
          deleteOrder(order.id)
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
}
