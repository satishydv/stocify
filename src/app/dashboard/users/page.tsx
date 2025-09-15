"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserTable } from '@/components/UserTable'
import UserDialog from '@/components/UserDialog'
import { useUserStore } from '@/stores/userStore'

const page = () => {
  const { users, fetchUsers, isLoading } = useUserStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <Card className="mt-1 flex flex-col shadow-none poppins border-none">
      <CardHeader className="flex justify-between p-2">
        <div className="flex justify-between items-center">
          <div className="">
            <CardTitle className="font-bold text-[23px]">Users</CardTitle>
            <p className="text-sm text-slate-600">{users.length} users</p>
          </div>
        </div>
        <UserDialog />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Loading users...</div>
          </div>
        ) : (
          <UserTable />
        )}
      </CardContent>
    </Card>
  )
}

export default page