'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Categories from '@/components/Categories'
import ProductGrid from '@/components/ProductGrid'
import BottomNavigation from '@/components/BottomNavigation'
import FilterModal from '@/components/FilterModal'
import Footer from '@/components/Footer'
import { useLanguage } from '@/context/LanguageContext'
import SkeletonLoader from '../components/SkeletonLoader'

interface FilterState {
  categories: string[]
  priceRange: { min: number; max: number }
  sortBy: string
  rating?: number
}

// Типы для категорий из API
interface SubCategory {
  id: string
  name: string
}

interface ParentCategory {
  id: string
  name: string
  subCategories?: SubCategory[]
}

function HomeContent() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [includeSubcategories, setIncludeSubcategories] = useState<boolean>(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    sortBy: 'rating',
    rating: 0
  })
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const { t } = useLanguage()

  // Обрабатываем параметр поиска из URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
      setSelectedCategory(null) // Сбрасываем выбранную категорию при поиске
    }
  }, [searchParams])

  useEffect(() => {
    // Загружаем категории для фильтра (плоский список для фильтра)
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data: ParentCategory[] = await response.json()
          // Преобразуем иерархическую структуру в плоский список для фильтра
          const flatCategories: Array<{ id: string; name: string }> = []
          data.forEach((parent: ParentCategory) => {
            flatCategories.push({ id: parent.id, name: parent.name })
            if (parent.subCategories) {
              parent.subCategories.forEach((sub: SubCategory) => {
                flatCategories.push({ id: sub.id, name: sub.name })
              })
            }
          })
          setCategories(flatCategories)
        }
      } catch {
        // Categories loading failed
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (categoryId: string | null, includeSubcategoriesParam: boolean = false) => {
    setSelectedCategory(categoryId)
    setIncludeSubcategories(includeSubcategoriesParam)
    // Сбрасываем фильтры при выборе категории
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 10000 },
      sortBy: 'rating',
      rating: 0
    })
  }

  const handleFilterClick = () => {
    setIsFilterOpen(true)
  }

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters)
    // Если в фильтрах выбраны категории, сбрасываем выбранную категорию
    if (newFilters.categories.length > 0) {
      setSelectedCategory(null)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Сбрасываем выбранную категорию при поиске
    setSelectedCategory(null)
  }

  const getProductsTitle = () => {
    if (searchQuery) {
      return `Результаты поиска: "${searchQuery}"`
    }
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(cat => cat.id === selectedCategory)
      if (category) {
        return `${category.name} ${t.categoryProducts}`
      }
    }
    if (filters.categories.length > 0) {
      return t.filteredProducts
    }
    return t.featuredProducts
  }

  return (
    <>
      {/* Header - всегда показываем на главной странице */}
      <Header onFilterClick={handleFilterClick} onSearch={handleSearch} />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section - Carousel */}
        <HeroSection />
        
        {/* Categories from Database */}
        <Categories 
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />
        
        {/* Products from Database */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-20 md:pb-12">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              {getProductsTitle()}
            </h2>
            <ProductGrid 
              selectedCategory={selectedCategory}
              includeSubcategories={includeSubcategories}
              searchQuery={searchQuery}
              filters={filters}
            />
          </div>
        </div>
        
        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          categories={categories}
        />
      </div>
      
      {/* Footer - всегда показываем на главной странице */}
      <Footer />
      
      {/* Bottom Navigation - только для мобильных */}
      <div className="pb-20 md:pb-0">
        <BottomNavigation />
      </div>
    </>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<SkeletonLoader type="page" />}>
      <HomeContent />
    </Suspense>
  )
}
