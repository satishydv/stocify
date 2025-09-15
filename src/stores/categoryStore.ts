"use client"

import { create } from "zustand"
import { Category } from "@/lib/category-data"

interface CategoryStore {
  categories: Category[]
  isLoading: boolean
  addCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void
  deleteCategory: (id: string) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  fetchCategories: () => Promise<void>
  setCategories: (categories: Category[]) => void
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,
  
  addCategory: (newCategory) => set((state) => ({
    categories: [
      ...state.categories,
      {
        ...newCategory,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
    ]
  })),
  
  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter((category) => category.id !== id)
  })),
  
  updateCategory: (id, updates) => set((state) => ({
    categories: state.categories.map((category) =>
      category.id === id
        ? { ...category, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : category
    )
  })),
  
  fetchCategories: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/categories')
      const result = await response.json()
      
      if (response.ok) {
        set({ categories: result.categories, isLoading: false })
      } else {
        console.error('Failed to fetch categories:', result.error)
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      set({ isLoading: false })
    }
  },

  setCategories: (categories) => set({ categories })
}))
