"use client"

import React, { useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { IoClose } from "react-icons/io5"
import { DataTable } from "@/components/DataTable"
import { useOrderColumns } from "@/lib/order-columns"
import { useOrderStore } from "@/stores/orderStore"
import { useFilterStore } from "@/stores/filterStore"
import { Order } from "@/lib/order-data"

function FilterArea() {
  return (
    <div className="flex gap-3">
      {/* status */}
      <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
        <span className="text-gray-600">Status</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>New</Badge>
          <Badge variant={"secondary"}>In Progress</Badge>
        </div>
      </div>
      {/* supplier */}
      <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
        <span className="text-gray-600">Supplier</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>TechWorld</Badge>
          <Badge variant={"secondary"}>HomeGoods Co.</Badge>
        </div>
      </div>
      <Button variant={"ghost"} className="p-1 px-2">
        <span>Reset</span>
        <IoClose />
      </Button>
    </div>
  )
}

interface OrderTableProps {
  onEditOrder: (order: Order) => void
}

export function OrderTable({ onEditOrder }: OrderTableProps) {
  const { orders, loading, error, fetchOrders } = useOrderStore()
  const { searchQuery, setSearchQuery } = useFilterStore()
  const orderColumns = useOrderColumns(onEditOrder)

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Filter orders based on search query
  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>
  }

  return (
    <div>
      <div className="flex flex-col gap-3 mb-8 mt-6">
        <div className="flex items-center justify-between">
          <Input 
            placeholder="Search by order ID, name, SKU, supplier, category..." 
            className="max-w-sm h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-4">
            {/* You can add status and supplier dropdowns here similar to products */}
          </div>
        </div>
        {/* filter area */}
        <FilterArea />
      </div>
      {/* Orders table */}
      <DataTable columns={orderColumns} data={filteredOrders} />
    </div>
  )
}
