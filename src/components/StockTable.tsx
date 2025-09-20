"use client"

import React, { useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { IoClose } from "react-icons/io5"
import { DataTable } from "@/components/DataTable"
import { useStockColumns } from "@/lib/stock-columns"
import { useStockStore } from "@/stores/stockStore"
import { useFilterStore } from "@/stores/filterStore"
import { Stock } from "@/lib/stock-data"

function FilterArea() {
  return (
    <div className="flex gap-3">
      {/* status */}
      <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
        <span className="text-gray-600">Status</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>Active</Badge>
          <Badge variant={"secondary"}>Low</Badge>
        </div>
      </div>
      {/* category */}
      <div className="border-dashed border rounded-sm p-1 flex gap-2 items-center px-2 text-sm">
        <span className="text-gray-600">Category</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>Electronics</Badge>
          <Badge variant={"secondary"}>Furniture</Badge>
        </div>
      </div>
      <Button variant={"ghost"} className="p-1 px-2">
        <span>Reset</span>
        <IoClose />
      </Button>
    </div>
  )
}

interface StockTableProps {
  onEditStock: (stock: Stock) => void
}

export function StockTable({ onEditStock }: StockTableProps) {
  const { stocks, loading, error, fetchStocks } = useStockStore()
  const { searchQuery, setSearchQuery } = useFilterStore()
  const stockColumns = useStockColumns(onEditStock)

  // Fetch stocks on component mount
  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  // Filter stocks based on search query
  const filteredStocks = stocks.filter(stock =>
    stock.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading stocks...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>
  }

  return (
    <div>
      <div className="flex flex-col gap-3 mb-8 mt-6">
        <div className="flex items-center justify-between">
          <Input 
            placeholder="Search by SKU, product name, category, supplier..." 
            className="max-w-sm h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-4">
            {/* You can add status and category dropdowns here similar to products */}
          </div>
        </div>
        {/* filter area */}
        <FilterArea />
      </div>
      {/* Stocks table */}
      <DataTable columns={stockColumns} data={filteredStocks} />
    </div>
  )
}
