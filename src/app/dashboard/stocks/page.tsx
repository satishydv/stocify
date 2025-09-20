"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StockTable } from '@/components/StockTable'
import StockDialog from '@/components/StockDialog'
import EditStockDialog from '@/components/EditStockDialog'
import { useStockStore } from '@/stores/stockStore'
import { Stock } from '@/lib/stock-data'

const page = () => {
  const { stocks } = useStockStore()
  const [editingStock, setEditingStock] = useState<Stock | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditStock = (stock: Stock) => {
    setEditingStock(stock)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingStock(null)
  }
  
  return (
    <Card className="mt-1 flex flex-col shadow-none poppins border-none">
      <CardHeader className="flex justify-between p-2">
        <div className="flex justify-between items-center">
          <div className="">
            <CardTitle className="font-bold text-[23px]">Stocks</CardTitle>
            <p className="text-sm text-slate-600">{stocks.length} stock items</p>
          </div>
        </div>
        <StockDialog />
      </CardHeader>
      <CardContent>
        <StockTable onEditStock={handleEditStock} />
      </CardContent>
      
      <EditStockDialog 
        stock={editingStock}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    </Card>
  )
}

export default page
