"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { IoCheckmark, IoClose as IoCloseIcon, IoMail } from "react-icons/io5"
import { useFilterStore } from "@/stores/filterStore"

// Status options constant
const STATUS_OPTIONS = [
  {
    id: 'published',
    label: 'Published',
    icon: IoCheckmark,
    color: 'bg-green-100 text-green-700',
    iconColor: 'text-green-600'
  },
  {
    id: 'inactive',
    label: 'Inactive',
    icon: IoCloseIcon,
    color: 'bg-red-100 text-red-700',
    iconColor: 'text-red-600'
  },
  {
    id: 'draft',
    label: 'Draft',
    icon: IoMail,
    color: 'bg-gray-100 text-gray-700',
    iconColor: 'text-gray-600'
  }
]

export function StatusDropdown() {
  const [open, setOpen] = useState(false)
  const { selectedStatus, setSelectedStatus, clearFilters } = useFilterStore()

  const handleStatusToggle = (statusId: string) => {
    const newSelection = selectedStatus.includes(statusId)
      ? selectedStatus.filter(id => id !== statusId)
      : [...selectedStatus, statusId]
    setSelectedStatus(newSelection)
  }

  const handleClearFilters = () => {
    clearFilters()
  }

  return (
    <div className="flex items-center space-x-4 poppins">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={"secondary"}>Status</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="start">
          <div className="p-3">
            {STATUS_OPTIONS.map((option) => {
              const IconComponent = option.icon
              const isSelected = selectedStatus.includes(option.id)
              
              return (
                <div key={option.id} className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => handleStatusToggle(option.id)}>
                  <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                    {isSelected && <IoCheckmark className="w-3 h-3 text-blue-600" />}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${option.color}`}>
                    <IconComponent className={`w-3 h-3 ${option.iconColor}`} />
                    {option.label}
                  </div>
                </div>
              )
            })}
            <Separator className="my-2" />
            <Button 
              variant="ghost" 
              className="w-full justify-center text-gray-600 hover:text-gray-800"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
