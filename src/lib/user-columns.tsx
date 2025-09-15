"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User, getStatusBadge, getRoleBadge } from "./user-data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoCopy, IoCreate, IoTrash, IoEllipsisVertical } from "react-icons/io5"
import { useUserStore } from "@/stores/userStore"
import { toast } from "sonner"
import { useState } from "react"
import EditUserDialog from "@/components/EditUserDialog"

export const useUserColumns = () => {
  const { deleteUser } = useUserStore()
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleCopy = (user: User) => {
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
    
    navigator.clipboard.writeText(JSON.stringify(userData, null, 2))
    toast.success("User data copied to clipboard")
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setEditingUser(null)
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          deleteUser(user.id)
          toast.success(`User "${user.name}" deleted successfully`)
        } else {
          const result = await response.json()
          toast.error(result.error || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error('Network error. Please try again.')
      }
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return <span className="text-muted-foreground font-mono text-sm">{row.getValue("id")}</span>
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">{user.avatar || "👤"}</span>
            <span className="font-medium">{user.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <span className="text-muted-foreground">{row.getValue("email")}</span>
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as User["role"]
        return getRoleBadge(role)
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as User["status"]
        return getStatusBadge(status)
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <IoEllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCopy(user)}>
                <IoCopy className="mr-2 h-4 w-4" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <IoCreate className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(user)} className="text-red-600">
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
      <EditUserDialog
        user={editingUser}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    )
  }
}
