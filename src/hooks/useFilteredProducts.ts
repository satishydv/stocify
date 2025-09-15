import { useProductStore } from '@/stores/productStore'
import { useFilterStore } from '@/stores/filterStore'
import { useMemo } from 'react'

export const useFilteredProducts = () => {
  const products = useProductStore((state) => state.products)
  const { selectedStatus, selectedCategories, searchQuery } = useFilterStore()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by status
      if (selectedStatus.length > 0 && !selectedStatus.includes(product.status)) {
        return false
      }

      // Filter by category
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false
      }

      // Filter by search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      return true
    })
  }, [products, selectedStatus, selectedCategories, searchQuery])

  return filteredProducts
}
