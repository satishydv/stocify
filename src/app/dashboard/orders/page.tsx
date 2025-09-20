"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderTable } from '@/components/OrderTable'
import OrderDialog from '@/components/OrderDialog'
import EditOrderDialog from '@/components/EditOrderDialog'
import { useOrderStore } from '@/stores/orderStore'
import { Order } from '@/lib/order-data'

const page = () => {
  const { orders } = useOrderStore()
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingOrder(null)
  }
  
  return (
    <Card className="mt-1 flex flex-col shadow-none poppins border-none">
      <CardHeader className="flex justify-between p-2">
        <div className="flex justify-between items-center">
          <div className="">
            <CardTitle className="font-bold text-[23px]">Orders</CardTitle>
            <p className="text-sm text-slate-600">{orders.length} orders</p>
          </div>
        </div>
        <OrderDialog />
      </CardHeader>
      <CardContent>
        <OrderTable onEditOrder={handleEditOrder} />
      </CardContent>
      
      <EditOrderDialog 
        order={editingOrder}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    </Card>
  )
}

export default page