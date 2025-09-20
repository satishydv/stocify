"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Stock, getStockStatusBadge } from "./stock-data"
import { useStockStore } from "@/stores/stockStore"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoCopy, IoCreate, IoTrash, IoEllipsisVertical } from "react-icons/io5"

export const useStockColumns = (onEditStock?: (stock: Stock) => void): ColumnDef<Stock>[] => {
  const { deleteStock } = useStockStore()

  return [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("sku")}</span>
      },
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("productName")}</span>
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
      accessorKey: "quantityAvailable",
      header: "Quantity Available",
      cell: ({ row }) => {
        const quantity = row.getValue("quantityAvailable") as number
        return <span className="font-medium">{quantity}</span>
      },
    },
    {
      accessorKey: "minimumStockLevel",
      header: "Min Level",
      cell: ({ row }) => {
        return <span className="text-muted-foreground">{row.getValue("minimumStockLevel")}</span>
      },
    },
    {
      accessorKey: "maximumStockLevel",
      header: "Max Level",
      cell: ({ row }) => {
        return <span className="text-muted-foreground">{row.getValue("maximumStockLevel")}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Stock["status"]
        return getStockStatusBadge(status)
      },
    },
    {
      accessorKey: "unitCost",
      header: "Unit Cost",
      cell: ({ row }) => {
        const cost = parseFloat(row.getValue("unitCost"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(cost)
        return <span className="font-medium">{formatted}</span>
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
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = new Date(row.getValue("lastUpdated"))
        return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const stock = row.original

        const handleCopy = () => {
          navigator.clipboard.writeText(JSON.stringify(stock, null, 2))
          console.log("Stock copied to clipboard")
        }

        const handleEdit = () => {
          if (onEditStock) {
            onEditStock(stock)
          }
        }

        const handleDelete = () => {
          deleteStock(stock.id)
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
