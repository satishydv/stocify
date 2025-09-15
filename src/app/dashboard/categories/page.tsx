"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryTable } from '@/components/CategoryTable'
import AddCategoryDialog from '@/components/AddCategoryDialog'
import { useCategoryStore } from '@/stores/categoryStore'

const page = () => {
  const { categories, fetchCategories, isLoading } = useCategoryStore()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return (
    <Card className="mt-1 flex flex-col shadow-none poppins border-none">
      <CardHeader className="flex justify-between p-2">
        <div className="flex justify-between items-center">
          <div className="">
            <CardTitle className="font-bold text-[23px]">Categories</CardTitle>
            <p className="text-sm text-slate-600">{categories.length} categories</p>
          </div>
        </div>
        <AddCategoryDialog />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Loading categories...</div>
          </div>
        ) : (
          <CategoryTable />
        )}
      </CardContent>
    </Card>
  )
}

export default page