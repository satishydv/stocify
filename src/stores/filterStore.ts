import { create } from 'zustand'

interface FilterStore {
  selectedStatus: string[]
  selectedCategories: string[]
  searchQuery: string
  setSelectedStatus: (status: string[]) => void
  setSelectedCategories: (categories: string[]) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedStatus: [],
  selectedCategories: [],
  searchQuery: '',
  
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () => set({ 
    selectedStatus: [], 
    selectedCategories: [], 
    searchQuery: '' 
  })
}))
