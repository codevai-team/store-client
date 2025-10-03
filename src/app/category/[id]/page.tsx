'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Package } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import AppLayout from '@/components/AppLayout'
import ProductGrid from '@/components/ProductGrid'
import SkeletonLoader from '@/components/SkeletonLoader'

interface Category {
  id: string
  name: string
  description?: string
  imageUrl?: string
  subCategories: Category[]
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  
  const [category, setCategory] = useState<Category | null>(null)
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [productsCount, setProductsCount] = useState(0)
  const [productsLoading, setProductsLoading] = useState(false)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true)
        
        // Загружаем данные категории
        const categoryResponse = await fetch(`/api/categories/${params.id}`)
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json()
          setCategory(categoryData)
          setSubcategories(categoryData.subCategories || [])
        }
        
      } catch {
        // Category loading failed
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCategoryData()
    }
  }, [params.id, t])

  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)
  }

  const handleBackToCategory = () => {
    setSelectedSubcategory(null)
  }

  const handleProductsCountChange = useCallback((count: number) => {
    setProductsCount(count)
  }, [])

  const handleProductsLoadingChange = useCallback((loading: boolean) => {
    setProductsLoading(loading)
  }, [])

  const filters = useMemo(() => ({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    sortBy: 'rating',
    rating: 0
  }), [])

  if (loading) {
    return (
      <AppLayout showHeader={false} showBottomNav={true}>
        <SkeletonLoader type="category" />
      </AppLayout>
    )
  }

  if (!category) {
    return (
      <AppLayout showHeader={false} showBottomNav={true}>
        <div className="min-h-screen bg-white">
          <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <h1 className="text-lg font-medium text-white">{t.category}</h1>
            
            <div className="w-10 h-10"></div>
          </div>
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.categoryNotFound}</h3>
            <p className="text-gray-500 text-center">{t.categoryNotFoundDesc}</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-medium text-white">
            {selectedSubcategory 
              ? subcategories.find(sub => sub.id === selectedSubcategory)?.name || t.subcategory
              : category.name
            }
          </h1>
          
          <div className="w-10 h-10"></div>
        </div>

        <div className="px-4 py-6">
          {/* Subcategories */}
          {subcategories.length > 0 && !selectedSubcategory && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t.subcategories}
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    onClick={() => handleSubcategoryClick(subcategory.id)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden border border-gray-200 hover:border-orange-300 flex-shrink-0 w-24"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={subcategory.imageUrl || '/api/placeholder/300/300'}
                        alt={subcategory.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-2">
                      <h3 className="font-medium text-gray-900 text-xs group-hover:text-orange-500 transition-colors line-clamp-2 text-center">
                        {subcategory.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to category button */}
          {selectedSubcategory && (
            <div className="mb-6">
              <button
                onClick={handleBackToCategory}
                className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">{t.backToCategory} &quot;{category.name}&quot;</span>
              </button>
            </div>
          )}

          {/* Products */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedSubcategory ? t.productsInSubcategory : t.productsInCategory}
                </h2>
                {productsLoading ? (
                  <span className="text-sm text-gray-500">
                    {t.loading}...
                  </span>
                ) : productsCount > 0 && (
                  <span className="text-sm text-gray-500">
                    {productsCount} {t.categoryProductsCount}
                  </span>
                )}
              </div>
              <ProductGrid 
                selectedCategory={selectedSubcategory || (category?.id || null)}
                includeSubcategories={!selectedSubcategory}
                searchQuery=""
                filters={filters}
                onProductsCountChange={handleProductsCountChange}
                onLoadingChange={handleProductsLoadingChange}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
