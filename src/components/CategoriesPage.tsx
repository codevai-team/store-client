'use client'

import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import SkeletonLoader from './SkeletonLoader'

interface Category {
  id: string
  name: string
  description?: string
  imageUrl?: string
  subCategories: Category[]
}


export default function CategoriesPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Загружаем категории из API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          // Данные категорий загружены успешно
          
          setCategories(data)
        } else {
          // Categories loading failed
        }
      } catch {
        // Categories loading failed
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])


  const filteredCategories = categories

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-medium text-white">{t.categories}</h1>
          
          <div className="w-10 h-10"></div>
        </div>

        {/* Loading skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SkeletonLoader type="product" count={10} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <h1 className="text-lg font-medium text-white">{t.categories}</h1>
        
        <div className="w-10 h-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => router.push(`/category/${category.id}`)}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={category.imageUrl || '/api/placeholder/300/300'}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {category.subCategories.length}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-orange-500 transition-colors line-clamp-2">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 text-gray-400">📁</div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'kg' ? 'Категориялар табылган жок' : 'Категории не найдены'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'kg' 
                ? 'Категориялар жүктөлүп жатат.'
                : 'Категории загружаются.'
              }
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
