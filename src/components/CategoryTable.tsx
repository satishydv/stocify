"use client"

import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { IoClose } from "react-icons/io5"
import { DataTable } from "@/components/DataTable"
import { useCategoryColumns } from "@/lib/category-columns"
import { useCategoryStore } from "@/stores/categoryStore"

function FilterArea() {
  return (
    <div className="flex gap-3">
      {/* status */}
      <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
        <span className="text-gray-600">Status</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>Active</Badge>
          <Badge variant={"secondary"}>Inactive</Badge>
        </div>
      </div>
      <Button variant={"ghost"} className="p-1 px-2">
        <span>Reset</span>
        <IoClose />
      </Button>
    </div>
  )
}

export function CategoryTable() {
  const { columns, editDialog } = useCategoryColumns()
  const { categories } = useCategoryStore()

  return (
    <div>
      <div className="flex flex-col gap-3 mb-8 mt-6">
        <div className="flex items-center justify-between">
          <Input 
            placeholder="Search by name or code..." 
            className="max-w-sm h-10"
          />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Status
            </Button>
          </div>
        </div>
        {/* filter area */}
        <FilterArea />
      </div>
      {/* Categories table */}
      <DataTable columns={columns} data={categories} />
      {/* Edit dialog */}
      {editDialog}
    </div>
  )
}
