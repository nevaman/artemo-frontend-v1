import { useState, useEffect } from 'react'
import { SupabaseApiService } from '../services/supabaseApi'
import type { AdminCategory, CategoriesApiResponse } from '../types'

export const useSupabaseCategories = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const api = SupabaseApiService.getInstance()

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response: CategoriesApiResponse = await api.getCategories()
      if (response.success && response.data) {
        setCategories(response.data.sort((a, b) => a.displayOrder - b.displayOrder))
      } else {
        setError(response.error || 'Failed to fetch categories')
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async (categoryData: Omit<AdminCategory, 'id'>) => {
    const response = await api.createCategory(categoryData)
    if (response.success && response.data) {
      setCategories(prev => [...prev, response.data!].sort((a, b) => a.displayOrder - b.displayOrder))
      return response.data
    } else {
      throw new Error(response.error || 'Failed to create category')
    }
  }

  const updateCategory = async (id: string, updates: Partial<AdminCategory>) => {
    const response = await api.updateCategory(id, updates)
    if (response.success && response.data) {
      setCategories(prev => 
        prev.map(cat => cat.id === id ? response.data! : cat)
           .sort((a, b) => a.displayOrder - b.displayOrder)
      )
      return response.data
    } else {
      throw new Error(response.error || 'Failed to update category')
    }
  }

  const deleteCategory = async (id: string) => {
    const response = await api.deleteCategory(id)
    if (response.success) {
      setCategories(prev => prev.filter(cat => cat.id !== id))
    } else {
      throw new Error(response.error || 'Failed to delete category')
    }
  }

  // Computed values
  const activeCategories = categories.filter(cat => cat.active)

  return {
    categories: activeCategories,
    allCategories: categories, // Include inactive for admin
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}