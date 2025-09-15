import { create } from 'zustand'
import { Product } from '@/lib/product-data'

interface ProductStore {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
}

// Initial products data (moved from product-data.tsx)
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Screwdriver",
    sku: "SD123",
    price: 12.99,
    category: "Others",
    status: "draft",
    quantityInStock: 50,
    supplier: "ToolSupplier Inc.",
    icon: "🔧"
  },
  {
    id: "2",
    name: "Hammer",
    sku: "HM456",
    price: 15.50,
    category: "Others",
    status: "published",
    quantityInStock: 30,
    supplier: "ToolSupplier Inc.",
    icon: "🔨"
  },
  {
    id: "3",
    name: "Smartphone",
    sku: "SP789",
    price: 499.99,
    category: "Electronics",
    status: "published",
    quantityInStock: 100,
    supplier: "TechWorld",
    icon: "📱"
  },
  {
    id: "4",
    name: "Laptop",
    sku: "LT101",
    price: 899.99,
    category: "Electronics",
    status: "inactive",
    quantityInStock: 25,
    supplier: "TechWorld",
    icon: "💻"
  },
  {
    id: "5",
    name: "Microwave Oven",
    sku: "MO202",
    price: 120.00,
    category: "Furniture",
    status: "draft",
    quantityInStock: 15,
    supplier: "HomeGoods Co.",
    icon: "📺"
  },
  {
    id: "6",
    name: "Washing Machine",
    sku: "WM303",
    price: 450.00,
    category: "Home Decor",
    status: "published",
    quantityInStock: 10,
    supplier: "HomeGoods Co.",
    icon: "🏠"
  },
  {
    id: "7",
    name: "Refrigerator",
    sku: "RF404",
    price: 799.99,
    category: "Home Appliances",
    status: "inactive",
    quantityInStock: 8,
    supplier: "HomeGoods Co.",
    icon: "❄️"
  },
  {
    id: "8",
    name: "Tablet",
    sku: "TB505",
    price: 199.99,
    category: "Electronics",
    status: "draft",
    quantityInStock: 60,
    supplier: "TechWorld",
    icon: "📱"
  }
]

export const useProductStore = create<ProductStore>((set, get) => ({
  products: initialProducts,
  
  addProduct: (newProduct) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(), // Simple ID generation
    }
    set((state) => ({
      products: [...state.products, product]
    }))
  },
  
  updateProduct: (id, updatedProduct) => {
    set((state) => ({
      products: state.products.map(product => 
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    }))
  },
  
  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter(product => product.id !== id)
    }))
  },
  
  getProduct: (id) => {
    return get().products.find(product => product.id === id)
  }
}))
