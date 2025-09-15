"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SupplierTable } from '@/components/SupplierTable'
import AddSupplierDialog from '@/components/AddSupplierDialog'
import { useSupplierStore } from '@/stores/supplierStore'

const page = () => {
  const { suppliers, fetchSuppliers, isLoading } = useSupplierStore()

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  return (
    <Card className="mt-1 flex flex-col shadow-none poppins border-none">
      <CardHeader className="flex justify-between p-2">
        <div className="flex justify-between items-center">
          <div className="">
            <CardTitle className="font-bold text-[23px]">Suppliers</CardTitle>
            <p className="text-sm text-slate-600">{suppliers.length} suppliers</p>
          </div>
        </div>
        <AddSupplierDialog />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Loading suppliers...</div>
          </div>
        ) : (
          <SupplierTable />
        )}
      </CardContent>
    </Card>
  )
}

export default page