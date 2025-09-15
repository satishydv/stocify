"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Category, getStatusBadge } from "./category-data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoCopy, IoCreate, IoTrash, IoEllipsisVertical } from "react-icons/io5"
import { useCategoryStore } from "@/stores/categoryStore"
import { toast } from "sonner"
import { useState } from "react"
import EditCategoryDialog from "@/components/EditCategoryDialog"

export const useCategoryColumns = () => {
  const { deleteCategory } = useCategoryStore()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleCopy = (category: Category) => {
    const categoryData = {
      id: category.id,
      name: category.name,
      code: category.code,
      status: category.status
    }
    
    navigator.clipboard.writeText(JSON.stringify(categoryData, null, 2))
    toast.success("Category data copied to clipboard")
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setEditingCategory(null)
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      try {
        const response = await fetch(`/api/categories/${category.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          deleteCategory(category.id)
          toast.success(`Category "${category.name}" deleted successfully`)
        } else {
          const result = await response.json()
          toast.error(result.error || 'Failed to delete category')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Network error. Please try again.')
      }
    }
  }

  const columns: ColumnDef<Category>[] = [
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
      header: "Category Name",
      cell: ({ row }) => {
        const category = row.original
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">📁</span>
            <span className="font-medium">{category.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "code",
      header: "Category Code",
      cell: ({ row }) => {
        const code = row.getValue("code") as string
        return (
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {code}
          </span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Category["status"]
        return getStatusBadge(status)
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const category = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <IoEllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCopy(category)}>
                <IoCopy className="mr-2 h-4 w-4" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                <IoCreate className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(category)} className="text-red-600">
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
      <EditCategoryDialog
        category={editingCategory}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    )
  }
}
