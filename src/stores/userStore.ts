"use client"

import { create } from "zustand"
import { User } from "@/lib/user-data"

interface UserStore {
  users: User[]
  isLoading: boolean
  addUser: (user: Omit<User, "id" | "status">) => void
  deleteUser: (id: string) => void
  updateUser: (id: string, updates: Partial<User>) => void
  fetchUsers: () => Promise<void>
  setUsers: (users: User[]) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  
  addUser: (newUser) => set((state) => ({
    users: [
      ...state.users,
      {
        ...newUser,
        id: Date.now().toString(),
        status: 'active' as const
      }
    ]
  })),
  
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((user) => user.id !== id)
  })),
  
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map((user) =>
      user.id === id
        ? { ...user, ...updates }
        : user
    )
  })),
  
  fetchUsers: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/users')
      const result = await response.json()
      
      if (response.ok) {
        set({ users: result.users, isLoading: false })
      } else {
        console.error('Failed to fetch users:', result.error)
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      set({ isLoading: false })
    }
  },

  setUsers: (users) => set({ users })
}))
