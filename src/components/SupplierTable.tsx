"use client"

import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { IoClose } from "react-icons/io5"
import { DataTable } from "@/components/DataTable"
import { useSupplierColumns } from "@/lib/supplier-columns"
import { useSupplierStore } from "@/stores/supplierStore"

function FilterArea() {
  return (
    <div className="flex gap-3">
      {/* category */}
      <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
        <span className="text-gray-600">Category</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>Electronics</Badge>
          <Badge variant={"secondary"}>Home Appliances</Badge>
        </div>
      </div>
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

export function SupplierTable() {
  const { columns, editDialog } = useSupplierColumns()
  const { suppliers } = useSupplierStore()

  return (
    <div>
      <div className="flex flex-col gap-3 mb-8 mt-6">
        <div className="flex items-center justify-between">
          <Input 
            placeholder="Search by name, email, or category..." 
            className="max-w-sm h-10"
          />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Category
            </Button>
            <Button variant="outline" size="sm">
              Status
            </Button>
          </div>
        </div>
        {/* filter area */}
        <FilterArea />
      </div>
      {/* Suppliers table */}
      <DataTable columns={columns} data={suppliers} />
      {/* Edit dialog */}
      {editDialog}
    </div>
  )
}
