"use client"

import { create } from "zustand"
import { Role, roles } from "@/lib/role-data"

interface RoleStore {
  roles: Role[]
  isLoading: boolean
  addRole: (role: Omit<Role, "id" | "createdAt" | "updatedAt">) => void
  deleteRole: (id: string) => void
  updateRole: (id: string, updates: Partial<Role>) => void
  updateRolePermissions: (roleId: string, module: string, permission: string, value: boolean) => void
  fetchRoles: () => Promise<void>
  setRoles: (roles: Role[]) => void
}

export const useRoleStore = create<RoleStore>((set, get) => ({
  roles: roles,
  isLoading: false,
  
  addRole: (newRole) => set((state) => ({
    roles: [
      ...state.roles,
      {
        ...newRole,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
    ]
  })),
  
  deleteRole: (id) => set((state) => ({
    roles: state.roles.filter((role) => role.id !== id)
  })),
  
  updateRole: (id, updates) => set((state) => ({
    roles: state.roles.map((role) =>
      role.id === id
        ? { ...role, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : role
    )
  })),
  
  updateRolePermissions: (roleId, module, permission, value) => set((state) => ({
    roles: state.roles.map((role) =>
      role.id === roleId
        ? {
            ...role,
            permissions: {
              ...role.permissions,
              [module]: {
                ...role.permissions[module as keyof typeof role.permissions],
                [permission]: value
              }
            },
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : role
    )
  })),

  fetchRoles: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/roles')
      const result = await response.json()
      
      if (response.ok) {
        set({ roles: result.roles, isLoading: false })
      } else {
        console.error('Failed to fetch roles:', result.error)
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      set({ isLoading: false })
    }
  },

  setRoles: (roles) => set({ roles })
}))
