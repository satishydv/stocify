"use client"

import { create } from "zustand"
import { Supplier } from "@/lib/supplier-data"

interface SupplierStore {
  suppliers: Supplier[]
  isLoading: boolean
  addSupplier: (supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">) => void
  deleteSupplier: (id: string) => void
  updateSupplier: (id: string, updates: Partial<Supplier>) => void
  fetchSuppliers: () => Promise<void>
  setSuppliers: (suppliers: Supplier[]) => void
}

export const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: [],
  isLoading: false,
  
  addSupplier: (newSupplier) => set((state) => ({
    suppliers: [
      ...state.suppliers,
      {
        ...newSupplier,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
    ]
  })),
  
  deleteSupplier: (id) => set((state) => ({
    suppliers: state.suppliers.filter((supplier) => supplier.id !== id)
  })),
  
  updateSupplier: (id, updates) => set((state) => ({
    suppliers: state.suppliers.map((supplier) =>
      supplier.id === id
        ? { ...supplier, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : supplier
    )
  })),
  
  fetchSuppliers: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/suppliers')
      const result = await response.json()
      
      if (response.ok) {
        set({ suppliers: result.suppliers, isLoading: false })
      } else {
        console.error('Failed to fetch suppliers:', result.error)
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      set({ isLoading: false })
    }
  },

  setSuppliers: (suppliers) => set({ suppliers })
}))
