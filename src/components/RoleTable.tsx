"use client"

import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { IoClose } from "react-icons/io5"
import { DataTable } from "@/components/DataTable"
import { useRoleColumns } from "@/lib/role-columns"
import { useRoleStore } from "@/stores/roleStore"
import { useFilterStore } from "@/stores/filterStore"

function FilterArea() {
  return (
    <div className="flex gap-3">
      {/* role type */}
      <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
        <span className="text-gray-600">Type</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>Admin</Badge>
          <Badge variant={"secondary"}>User</Badge>
        </div>
      </div>
      <Button variant={"ghost"} className="p-1 px-2">
        <span>Reset</span>
        <IoClose />
      </Button>
    </div>
  )
}

export function RoleTable() {
  const { roles } = useRoleStore()
  const { searchQuery, setSearchQuery } = useFilterStore()
  const { columns, editDialog } = useRoleColumns()

  // Filter roles based on search query
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-col gap-3 mb-8 mt-6">
        <div className="flex items-center justify-between">
          <Input 
            placeholder="Search by role name or type..." 
            className="max-w-sm h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* filter area */}
        <FilterArea />
      </div>
      {/* Roles table */}
      <DataTable columns={columns} data={filteredRoles} />
      {/* Edit dialog */}
      {editDialog}
    </div>
  )
}
