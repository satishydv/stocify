"use client"

import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { IoClose } from "react-icons/io5"
import { StatusDropdown } from "@/components/StatusDropdown"
import { CategoryDropdown } from "@/components/CategoryDropdown"
import { DataTable } from "@/components/DataTable"
import { products } from "@/lib/product-data"
import { productColumns } from "@/lib/product-columns"

function FilterArea() {
  return (
    <div className="flex gap-3">
      {/* status */}
      <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
        <span className="text-gray-600">Status</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>item 1</Badge>
          <Badge variant={"secondary"}>item 1</Badge>
        </div>
      </div>
      {/* category */}
      <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
        <span className="text-gray-600">Category</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>item 1</Badge>
          <Badge variant={"secondary"}>item 1</Badge>
        </div>
      </div>
      <Button variant={"ghost"} className="p-1 px-2">
        <span>Reset</span>
        <IoClose />
      </Button>
    </div>
  )
}

export function ProductTable() {
  return (
    <div>
      <div className="flex flex-col gap-3 mb-8 mt-6">
        <div className="flex items-center justify-between">
          <Input placeholder="Search by name..." className="max-w-sm h-10" />
          <div className="flex items-center gap-4">
            <StatusDropdown />
            <CategoryDropdown />
          </div>
        </div>
        {/* filter area */}
        <FilterArea />
      </div>
      {/* Products table */}
      <DataTable columns={productColumns} data={products} />
    </div>
  )
}
