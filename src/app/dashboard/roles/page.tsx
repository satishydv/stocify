"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleTable } from '@/components/RoleTable'
import RoleDialog from '@/components/RoleDialog'
import { useRoleStore } from '@/stores/roleStore'

const page = () => {
  const { roles, fetchRoles, isLoading } = useRoleStore()

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])
  
  return (
    <Card className="mt-1 flex flex-col shadow-none poppins border-none">
      <CardHeader className="flex justify-between p-2">
        <div className="flex justify-between items-center">
          <div className="">
            <CardTitle className="font-bold text-[23px]">Roles</CardTitle>
            <p className="text-sm text-slate-600">{roles.length} roles</p>
          </div>
        </div>
        <RoleDialog />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Loading roles...</div>
          </div>
        ) : (
          <RoleTable />
        )}
      </CardContent>
    </Card>
  )
}

export default page