"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Role, getRoleTypeBadge, moduleNames } from "./role-data"
import { useRoleStore } from "@/stores/roleStore"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoCreate, IoTrash, IoEllipsisVertical } from "react-icons/io5"
import { toast } from "sonner"
import { useState } from "react"
import EditRoleDialog from "@/components/EditRoleDialog"

export const useRoleColumns = () => {
  const { deleteRole, updateRolePermissions, fetchRoles } = useRoleStore()
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handlePermissionChange = (roleId: string, module: string, permission: string, checked: boolean) => {
    updateRolePermissions(roleId, module, permission, checked)
  }


  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setEditingRole(null)
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (role: Role) => {
    if (window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      try {
        const response = await fetch(`/api/roles/${role.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          deleteRole(role.id)
          fetchRoles() // Refresh roles list
          toast.success(`Role "${role.name}" deleted successfully`)
        } else {
          const result = await response.json()
          toast.error(result.error || 'Failed to delete role')
        }
      } catch (error) {
        console.error('Error deleting role:', error)
        toast.error('Network error. Please try again.')
      }
    }
  }

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Role Name",
      cell: ({ row }) => {
        const role = row.original
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{role.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as Role["type"]
        return getRoleTypeBadge(type)
      },
    },
    // Dynamic columns for each module with CRUD permissions
    ...moduleNames.map((module) => ({
      id: module,
      header: module.charAt(0).toUpperCase() + module.slice(1),
      cell: ({ row }: { row: any }) => {
        const role = row.original
        const permissions = role.permissions?.[module] || { create: false, read: false, update: false, delete: false }
        
        return (
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={permissions.create || false}
                  onCheckedChange={(checked) => 
                    handlePermissionChange(role.id, module, 'create', checked as boolean)
                  }
                  className="h-3 w-3"
                />
                <span className="text-xs text-muted-foreground">C</span>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={permissions.read || false}
                  onCheckedChange={(checked) => 
                    handlePermissionChange(role.id, module, 'read', checked as boolean)
                  }
                  className="h-3 w-3"
                />
                <span className="text-xs text-muted-foreground">R</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={permissions.update || false}
                  onCheckedChange={(checked) => 
                    handlePermissionChange(role.id, module, 'update', checked as boolean)
                  }
                  className="h-3 w-3"
                />
                <span className="text-xs text-muted-foreground">U</span>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={permissions.delete || false}
                  onCheckedChange={(checked) => 
                    handlePermissionChange(role.id, module, 'delete', checked as boolean)
                  }
                  className="h-3 w-3"
                />
                <span className="text-xs text-muted-foreground">D</span>
              </div>
            </div>
          </div>
        )
      },
    })),
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const role = row.original

        // Actions are handled by the parent component

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <IoEllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(role)}>
                <IoCreate className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(role)} className="text-red-600">
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
      <EditRoleDialog
        role={editingRole}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    )
  }
}
