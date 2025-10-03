'use client'

import { Tag, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

interface Category {
  id: string
  name: string
  imageUrl?: string | null
  subCategories?: Category[]
}

// Иконка по умолчанию для всех категорий
const getDefaultIcon = () => {
  // Возвращаем иконку тега для всех категорий
  const DefaultIcon = (props: React.ComponentProps<typeof Tag>) => (
    <Tag {...props} />
  )
  DefaultIcon.displayName = 'DefaultIcon'
  return DefaultIcon
}

// Компонент для отображения хлебного пути
const Breadcrumb = ({ 
  path, 
  onNavigate,
  showAllButton = true,
  isCompact = false
}: {
  path: Array<{ id: string; name: string }>
  onNavigate: (categoryId: string | null) => void
  showAllButton?: boolean
  isCompact?: boolean
}) => {
  if (path.length === 0) return null

  return (
    <div className={`flex items-center space-x-2 text-sm text-gray-600 ${isCompact ? '' : 'bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm'}`}>
      {showAllButton && (
        <>
          <button
            onClick={() => onNavigate(null)}
            className="hover:text-orange-500 transition-colors"
          >
            Все товары
          </button>
          <ChevronRight className="w-4 h-4" />
        </>
      )}
      {path.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          <button
            onClick={() => onNavigate(item.id)}
            className="hover:text-orange-500 transition-colors"
          >
            {item.name}
          </button>
        </div>
      ))}
    </div>
  )
}


interface CategoriesProps {
  onCategoryClick: (categoryId: string | null, includeSubcategories?: boolean) => void
  selectedCategory: string | null
}

export default function Categories({ onCategoryClick, selectedCategory }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCategories, setCurrentCategories] = useState<Category[]>([])
  const [breadcrumbPath, setBreadcrumbPath] = useState<Array<{ id: string; name: string }>>([])
  const { t } = useLanguage()

  // Функция для поиска категории по ID в иерархии
  const findCategoryById = (categories: Category[], id: string): Category | null => {
    for (const category of categories) {
      if (category.id === id) return category
      if (category.subCategories) {
        const found = findCategoryById(category.subCategories, id)
        if (found) return found
      }
    }
    return null
  }

  // Функция для получения пути к категории
  const getCategoryPath = (categories: Category[], targetId: string, currentPath: Array<{ id: string; name: string }> = []): Array<{ id: string; name: string }> | null => {
    for (const category of categories) {
      const newPath = [...currentPath, { id: category.id, name: category.name }]
      
      if (category.id === targetId) {
        return newPath
      }
      
      if (category.subCategories) {
        const found = getCategoryPath(category.subCategories, targetId, newPath)
        if (found) return found
      }
    }
    return null
  }

  const handleCategoryClick = (categoryId: string) => {
    const category = findCategoryById(categories, categoryId)
    
    if (!category) return

    const hasSubcategories = category.subCategories && category.subCategories.length > 0
    
    if (hasSubcategories) {
      // Если есть подкатегории, показываем их
      setCurrentCategories(category.subCategories!)
      setBreadcrumbPath(getCategoryPath(categories, categoryId) || [])
      onCategoryClick(categoryId, true)
    } else {
      // Если нет подкатегорий, выбираем эту категорию
      onCategoryClick(categoryId, false)
    }
  }

  const handleBreadcrumbClick = (categoryId: string | null) => {
    if (categoryId === null) {
      // Возвращаемся к корневым категориям
      setCurrentCategories(categories)
      setBreadcrumbPath([])
      onCategoryClick(null, false)
    } else {
      // Переходим к выбранной категории
      const category = findCategoryById(categories, categoryId)
      if (category) {
        const hasSubcategories = category.subCategories && category.subCategories.length > 0
        
        if (hasSubcategories) {
          setCurrentCategories(category.subCategories!)
          setBreadcrumbPath(getCategoryPath(categories, categoryId) || [])
          onCategoryClick(categoryId, true)
        } else {
          onCategoryClick(categoryId, false)
        }
      }
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
          setCurrentCategories(data) // Инициализируем текущие категории корневыми
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black">{t.categories}</h2>
        </div>
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-4 min-w-max">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center space-y-3">
                <div className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-orange-100 rounded-2xl animate-pulse"></div>
                <div className="w-12 h-3 bg-orange-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Функция для получения последних 3 категорий из пути
  const getLastThreeCategories = (path: Array<{ id: string; name: string }>) => {
    if (path.length <= 3) return path
    return path.slice(-3)
  }

  // Проверяем, есть ли скрытые категории
  const hasHiddenCategories = breadcrumbPath.length > 3

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-black">{t.categories}</h2>
        {/* Заменяем кнопку "Смотреть все" на хлебные крошки */}
        {breadcrumbPath.length > 0 ? (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {hasHiddenCategories && (
              <>
                <span className="text-gray-400">...</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <Breadcrumb 
              path={getLastThreeCategories(breadcrumbPath)} 
              onNavigate={handleBreadcrumbClick}
              showAllButton={false}
              isCompact={true}
            />
          </div>
        ) : null}
      </div>

      {/* Горизонтальный скролл категорий (заменяется подкатегориями) */}
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-4 min-w-max">
            {/* Кнопка "Все товары" - всегда видима */}
            <div className="flex-shrink-0">
              <div 
                className="flex flex-col items-center space-y-3 cursor-pointer group"
                onClick={() => handleBreadcrumbClick(null)}
              >
                <div className={`w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 ${
                  selectedCategory === null && breadcrumbPath.length === 0
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-orange-50 hover:bg-orange-100 text-orange-600 group-hover:scale-105 group-hover:shadow-xl'
                }`}>
                  <svg className={`w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 ${selectedCategory === null && breadcrumbPath.length === 0 ? 'text-white' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className={`text-xs md:text-sm text-center leading-tight font-medium min-w-0 max-w-20 ${
                  selectedCategory === null && breadcrumbPath.length === 0 ? 'text-orange-500' : 'text-gray-600 group-hover:text-orange-500'
                }`}>
                  {t.allProducts}
                </span>
              </div>
            </div>

            {/* Отображаем текущие категории (либо корневые, либо подкатегории) */}
            {currentCategories.map((category) => {
              const IconComponent = getDefaultIcon()
              const isSelected = selectedCategory === category.id
              
              return (
                <div key={category.id} className="flex-shrink-0">
                  <div 
                    className="flex flex-col items-center space-y-3 cursor-pointer group"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className={`w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden border border-gray-100 hover:border-orange-200 ${
                      isSelected 
                        ? 'bg-orange-500 text-white border-orange-500' 
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-600 group-hover:scale-105 group-hover:shadow-xl'
                    }`}>
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <IconComponent className={`w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 ${isSelected ? 'text-white' : 'text-orange-600'}`} />
                      )}
                    </div>
                    <span className={`text-xs md:text-sm text-center leading-tight font-medium min-w-0 max-w-20 ${
                      isSelected ? 'text-orange-500' : 'text-gray-600 group-hover:text-orange-500'
                    }`}>
                      {category.name}
                    </span>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
