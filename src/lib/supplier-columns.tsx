"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Supplier, getStatusBadge, getCategoryBadge, formatLocation } from "./supplier-data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoCopy, IoCreate, IoTrash, IoEllipsisVertical, IoMail, IoCall, IoGlobe, IoLocation } from "react-icons/io5"
import { useSupplierStore } from "@/stores/supplierStore"
import { toast } from "sonner"
import { useState } from "react"
import EditSupplierDialog from "@/components/EditSupplierDialog"

export const useSupplierColumns = () => {
  const { deleteSupplier } = useSupplierStore()
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleCopy = (supplier: Supplier) => {
    const supplierData = {
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      location: formatLocation(supplier.companyLocation),
      category: supplier.category,
      status: supplier.status
    }
    
    navigator.clipboard.writeText(JSON.stringify(supplierData, null, 2))
    toast.success("Supplier data copied to clipboard")
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setEditingSupplier(null)
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (supplier: Supplier) => {
    if (window.confirm(`Are you sure you want to delete supplier "${supplier.name}"?`)) {
      try {
        const response = await fetch(`/api/suppliers/${supplier.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          deleteSupplier(supplier.id)
          toast.success(`Supplier "${supplier.name}" deleted successfully`)
        } else {
          const result = await response.json()
          toast.error(result.error || 'Failed to delete supplier')
        }
      } catch (error) {
        console.error('Error deleting supplier:', error)
        toast.error('Network error. Please try again.')
      }
    }
  }

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const fullId = row.getValue("id") as string
        const shortId = fullId.substring(0, 3)
        return (
          <span 
            className="text-muted-foreground font-mono text-sm" 
            title={fullId}
          >
            {shortId}...
          </span>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Supplier Name",
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">🏢</span>
            <span className="font-medium">{supplier.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string
        return (
          <div className="flex items-center gap-2">
            <IoMail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{email}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string
        return (
          <div className="flex items-center gap-2">
            <IoCall className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{phone}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "companyLocation",
      header: "Location",
      cell: ({ row }) => {
        const location = row.getValue("companyLocation") as Supplier["companyLocation"]
        return (
          <div className="flex items-center gap-2 max-w-xs">
            <IoLocation className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground text-sm truncate" title={formatLocation(location)}>
              {location.city}, {location.state}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as Supplier["category"]
        return getCategoryBadge(category)
      },
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: ({ row }) => {
        const website = row.getValue("website") as string
        if (!website) {
          return <span className="text-muted-foreground text-sm">-</span>
        }
        return (
          <div className="flex items-center gap-2">
            <IoGlobe className="w-4 h-4 text-muted-foreground" />
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-32"
              title={website}
            >
              {website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Supplier["status"]
        return getStatusBadge(status)
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const supplier = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <IoEllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCopy(supplier)}>
                <IoCopy className="mr-2 h-4 w-4" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                <IoCreate className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(supplier)} className="text-red-600">
                <IoTrash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return {
    columns,
    editDialog: (
      <EditSupplierDialog
        supplier={editingSupplier}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    )
  }
}
