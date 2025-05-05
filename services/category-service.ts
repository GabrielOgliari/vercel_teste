// Type definition for Category
export interface Category {
  id: string
  name: string
  description: string
  type: "income" | "expense"
  color: string
  count: number
}

// Sample data - this would be replaced with actual API calls in a real app
const initialCategories: Category[] = [
  {
    id: "1",
    name: "Moradia",
    description: "Despesas relacionadas à moradia, como aluguel e condomínio",
    type: "expense",
    color: "#3b82f6",
    count: 12,
  },
  {
    id: "2",
    name: "Alimentação",
    description: "Despesas com alimentação, como supermercado e restaurantes",
    type: "expense",
    color: "#10b981",
    count: 8,
  },
  {
    id: "3",
    name: "Transporte",
    description: "Despesas com transporte, como combustível e transporte público",
    type: "expense",
    color: "#f59e0b",
    count: 5,
  },
  {
    id: "4",
    name: "Lazer",
    description: "Despesas com lazer, como cinema e viagens",
    type: "expense",
    color: "#ef4444",
    count: 3,
  },
  {
    id: "5",
    name: "Saúde",
    description: "Despesas com saúde, como plano de saúde e medicamentos",
    type: "expense",
    color: "#8b5cf6",
    count: 2,
  },
  {
    id: "6",
    name: "Salário",
    description: "Receitas de salário",
    type: "income",
    color: "#22c55e",
    count: 1,
  },
  {
    id: "7",
    name: "Freelance",
    description: "Receitas de trabalhos freelance",
    type: "income",
    color: "#06b6d4",
    count: 3,
  },
  {
    id: "8",
    name: "Investimentos",
    description: "Receitas de investimentos",
    type: "income",
    color: "#eab308",
    count: 4,
  },
  {
    id: "9",
    name: "Utilidades",
    description: "Despesas com utilidades como água, luz e internet",
    type: "expense",
    color: "#64748b",
    count: 7,
  },
  {
    id: "10",
    name: "Dívidas",
    description: "Pagamentos de empréstimos e cartões de crédito",
    type: "expense",
    color: "#dc2626",
    count: 5,
  },
  {
    id: "11",
    name: "Seguros",
    description: "Despesas com seguros diversos",
    type: "expense",
    color: "#9333ea",
    count: 2,
  },
]

// Simulating localStorage persistence
let categories: Category[] = [...initialCategories]

// In a real app, these would be API calls
export const CategoryService = {
  getAll: (): Category[] => {
    // Try to get from localStorage first
    const stored = localStorage.getItem("categories")
    if (stored) {
      categories = JSON.parse(stored)
    }
    return categories
  },

  getAllByType: (type: "income" | "expense"): Category[] => {
    return CategoryService.getAll().filter((category) => category.type === type)
  },

  getById: (id: string): Category | undefined => {
    return CategoryService.getAll().find((category) => category.id === id)
  },

  create: (category: Omit<Category, "id" | "count">): Category => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substring(2, 9),
      count: 0,
    }
    categories = [...categories, newCategory]
    localStorage.setItem("categories", JSON.stringify(categories))
    return newCategory
  },

  update: (id: string, data: Partial<Omit<Category, "id" | "count">>): Category | undefined => {
    const index = categories.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories[index] = { ...categories[index], ...data }
      localStorage.setItem("categories", JSON.stringify(categories))
      return categories[index]
    }
    return undefined
  },

  delete: (id: string): boolean => {
    const filtered = categories.filter((c) => c.id !== id)
    if (filtered.length !== categories.length) {
      categories = filtered
      localStorage.setItem("categories", JSON.stringify(categories))
      return true
    }
    return false
  },

  incrementCount: (id: string): Category | undefined => {
    const index = categories.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        count: categories[index].count + 1,
      }
      localStorage.setItem("categories", JSON.stringify(categories))
      return categories[index]
    }
    return undefined
  },

  decrementCount: (id: string): Category | undefined => {
    const index = categories.findIndex((c) => c.id === id)
    if (index !== -1 && categories[index].count > 0) {
      categories[index] = {
        ...categories[index],
        count: categories[index].count - 1,
      }
      localStorage.setItem("categories", JSON.stringify(categories))
      return categories[index]
    }
    return undefined
  },
}
