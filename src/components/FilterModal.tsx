'use client'

import { X, Check, Filter, ChevronDown, Star, DollarSign, Tag, LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
  categories: Array<{ id: string; name: string }>
}

interface FilterState {
  categories: string[]
  priceRange: { min: number; max: number }
  sortBy: string
  rating: number
}

export default function FilterModal({ isOpen, onClose, onApplyFilters, categories }: FilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    sortBy: 'newest',
    rating: 0
  })

  // Блокируем скролл при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    price: false,
    rating: false,
    sort: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => {
      // Если секция уже открыта, закрываем её
      if (prev[section]) {
        return {
          ...prev,
          [section]: false
        }
      }
      // Если секция закрыта, открываем её и закрываем все остальные
      return {
        categories: false,
        price: false,
        rating: false,
        sort: false,
        [section]: true
      }
    })
  }

  const sortOptions = [
    { id: 'newest', label: t.newestFirst },
    { id: 'oldest', label: t.oldestFirst },
    { id: 'price_low', label: t.priceLowToHigh },
    { id: 'price_high', label: t.priceHighToLow },
    { id: 'rating', label: t.highestRated }
  ]

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }))
  }

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 10000 },
      sortBy: 'newest',
      rating: 0
    })
  }

  if (!isOpen) return null

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    count 
  }: { 
    title: string; 
    icon: LucideIcon; 
    sectionKey: keyof typeof expandedSections;
    count?: number;
  }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl hover:from-orange-100 hover:to-orange-200/50 transition-all duration-200 group"
    >
      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="p-1.5 md:p-2 bg-orange-500 rounded-lg text-white group-hover:bg-orange-600 transition-colors">
          <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </div>
        <span className="font-semibold text-gray-800 text-sm md:text-base">{title}</span>
        {count !== undefined && (
          <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
            {count}
          </span>
        )}
      </div>
      <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-gray-600 transition-transform duration-200 ${
        expandedSections[sectionKey] ? 'rotate-180' : ''
      }`} />
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] md:max-h-[90vh] overflow-hidden border border-orange-200">
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
              <Filter className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-base md:text-xl font-bold">{t.filters}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 md:p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] md:max-h-[calc(90vh-180px)]">
          <div className="p-3 md:p-6 space-y-2 md:space-y-4">
            {/* Categories */}
            <div className="space-y-2 md:space-y-3">
              <SectionHeader 
                title={t.categories} 
                icon={Tag} 
                sectionKey="categories" 
                count={filters.categories.length}
              />
              {expandedSections.categories && (
                <div className="pl-3 md:pl-4 space-y-2 md:space-y-3 max-h-40 md:max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="sr-only"
                      />
                      <div className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 border-2 rounded-lg mr-2 md:mr-3 transition-all duration-200 ${
                        filters.categories.includes(category.id)
                          ? 'bg-orange-500 border-orange-500 scale-110'
                          : 'border-gray-300 group-hover:border-orange-400 group-hover:scale-105'
                      }`}>
                        {filters.categories.includes(category.id) && (
                          <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        )}
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="space-y-2 md:space-y-3">
              <SectionHeader 
                title={`${t.priceRange} (с.)`} 
                icon={DollarSign} 
                sectionKey="price" 
              />
              {expandedSections.price && (
                <div className="pl-3 md:pl-4 space-y-3 md:space-y-4">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">{t.min}</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={filters.priceRange.min || ''}
                          onChange={(e) => handlePriceChange('min', Number(e.target.value) || 0)}
                          className="w-full pl-2 md:pl-3 pr-8 md:pr-12 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          placeholder="0"
                        />
                        <span className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs md:text-sm">
                          с.
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">{t.max}</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={filters.priceRange.max || ''}
                          onChange={(e) => handlePriceChange('max', Number(e.target.value) || 0)}
                          className="w-full pl-2 md:pl-3 pr-8 md:pr-12 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          placeholder="10000"
                        />
                        <span className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs md:text-sm">
                          с.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-xs md:text-sm text-gray-500">
                    {filters.priceRange.min} с. - {filters.priceRange.max} с.
                  </div>
                </div>
              )}
            </div>


            {/* Rating Filter */}
            <div className="space-y-2 md:space-y-3">
              <SectionHeader 
                title={t.minimumRating} 
                icon={Star} 
                sectionKey="rating"
                count={filters.rating && filters.rating > 0 ? 1 : 0}
              />
              {expandedSections.rating && (
                <div className="pl-3 md:pl-4">
                  <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters(prev => ({ ...prev, rating }))}
                        className={`px-2 md:px-3 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium border-2 transition-all duration-200 ${
                          filters.rating === rating
                            ? 'bg-orange-500 text-white border-orange-500 scale-105 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                        }`}
                      >
                        {rating}★
                      </button>
                    ))}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, rating: 0 }))}
                      className={`px-2 md:px-3 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium border-2 transition-all duration-200 ${
                        filters.rating === 0
                          ? 'bg-orange-500 text-white border-orange-500 scale-105 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {t.any}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sort By */}
            <div className="space-y-2 md:space-y-3">
              <SectionHeader 
                title={t.sortBy} 
                icon={Filter} 
                sectionKey="sort" 
              />
              {expandedSections.sort && (
                <div className="pl-3 md:pl-4 space-y-1.5 md:space-y-2">
                  {sortOptions.map((option) => (
                    <label key={option.id} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.id}
                        checked={filters.sortBy === option.id}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="sr-only"
                      />
                      <div className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 border-2 rounded-full mr-2 md:mr-3 transition-all duration-200 ${
                        filters.sortBy === option.id
                          ? 'bg-orange-500 border-orange-500 scale-110'
                          : 'border-gray-300 group-hover:border-orange-400 group-hover:scale-105'
                      }`}>
                        {filters.sortBy === option.id && (
                          <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 md:space-x-4 p-3 md:p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex-1 px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg md:rounded-xl hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            {t.reset}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 border-2 border-transparent rounded-lg md:rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t.applyFilters}
          </button>
        </div>
      </div>
    </div>
  )
}
