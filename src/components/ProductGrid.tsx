'use client'

import { Star } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SkeletonLoader from '@/components/SkeletonLoader'

interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  imageUrl?: string[] | null
  category: {
    id: string
    name: string
  }
  seller: {
    fullname: string
  }
  sizes: Array<{
    id: string
    name: string
  }>
  colors: Array<{
    id: string
    name: string
    colorCode?: string
  }>
  reviews: {
    rating: number
  }[]
  _count: {
    reviews: number
  }
}

interface ProductWithLike extends Product {
  averageRating: number
}

interface ProductGridProps {
  selectedCategory: string | null
  includeSubcategories?: boolean
  searchQuery?: string
  filters?: {
    categories: string[]
    priceRange: { min: number; max: number }
    sortBy: string
    seller?: string
    rating?: number
  }
  onProductsCountChange?: (count: number) => void
  onLoadingChange?: (loading: boolean) => void
}

export default function ProductGrid({ selectedCategory, includeSubcategories, searchQuery, filters, onProductsCountChange, onLoadingChange }: ProductGridProps) {
  const [products, setProducts] = useState<ProductWithLike[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSizes, setSelectedSizes] = useState<{[productId: string]: string}>({})
  const [selectedColors, setSelectedColors] = useState<{[productId: string]: string}>({})
  
  // Используем ref для стабилизации callback
  const onProductsCountChangeRef = useRef(onProductsCountChange)
  onProductsCountChangeRef.current = onProductsCountChange
  
  const onLoadingChangeRef = useRef(onLoadingChange)
  onLoadingChangeRef.current = onLoadingChange

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = '/api/products'
        const params = new URLSearchParams()
        
        // ProductGrid fetchProducts вызван
        
        if (selectedCategory) {
          params.append('categoryId', selectedCategory)
          if (includeSubcategories === true) {
            params.append('includeSubcategories', 'true')
          }
        }
        
        if (filters?.categories && filters.categories.length > 0) {
          filters.categories.forEach(cat => params.append('categories', cat))
        }
        
        if (filters?.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max < 10000)) {
          params.append('minPrice', filters.priceRange.min.toString())
          params.append('maxPrice', filters.priceRange.max.toString())
        }
        
        if (filters?.sortBy && filters.sortBy !== 'newest') {
          params.append('sortBy', filters.sortBy)
        } else if (filters?.sortBy === 'rating') {
          params.append('sortBy', 'rating')
        }

        if (filters?.rating && filters.rating > 0) {
          params.append('minRating', filters.rating.toString())
        }

        if (filters?.seller && filters.seller.trim()) {
          params.append('seller', filters.seller.trim())
        }

        if (searchQuery && searchQuery.trim()) {
          params.append('search', searchQuery.trim())
        }
        
        if (params.toString()) {
          url += '?' + params.toString()
        }

        // Загружаем товары
        const response = await fetch(url)
        if (response.ok) {
          const data: Product[] = await response.json()
          const productsWithLikes = data.map(product => ({
            ...product,
            averageRating: product.reviews.length > 0 
              ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
              : 5.0 // Показываем 5 звёзд по умолчанию, если нет отзывов
          }))
          setProducts(productsWithLikes)
          
          // Инициализируем выбранные размеры и цвета по умолчанию
          const initialSizes: {[productId: string]: string} = {}
          const initialColors: {[productId: string]: string} = {}
          
          productsWithLikes.forEach(product => {
            if (product.sizes && product.sizes.length > 0) {
              initialSizes[product.id] = product.sizes[0].id
            }
            if (product.colors && product.colors.length > 0) {
              initialColors[product.id] = product.colors[0].id
            }
          })
          
          setSelectedSizes(initialSizes)
          setSelectedColors(initialColors)
        } else {
          // Ошибка загрузки товаров
        }
      } catch {
        // Ошибка загрузки товаров
      } finally {
        setLoading(false)
        onLoadingChangeRef.current?.(false)
      }
    }

    setLoading(true)
    onLoadingChangeRef.current?.(true)
    fetchProducts()
  }, [selectedCategory, includeSubcategories, searchQuery, filters])

  // Уведомляем о количестве товаров при изменении
  useEffect(() => {
    if (onProductsCountChangeRef.current) {
      onProductsCountChangeRef.current(products.length)
    }
  }, [products.length])




  const formatPrice = (price: number) => `${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} с.`

  const getProductUrl = (productId: string) => {
    const selectedSizeId = selectedSizes[productId]
    const selectedColorId = selectedColors[productId]
    
    const params = new URLSearchParams()
    if (selectedSizeId) params.append('sizeId', selectedSizeId)
    if (selectedColorId) params.append('colorId', selectedColorId)
    
    const paramString = params.toString()
    return `/product/${productId}${paramString ? `?${paramString}` : ''}`
  }





  if (loading) {
    return <SkeletonLoader type="product" count={12} />
  }

  return (
    <div className="columns-2 gap-px md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-0.5">
      {products.filter(product => product && product.id && product.category?.id).map((product) => (
        <div key={product.id} className="bg-white rounded-sm overflow-hidden border-0 md:border md:border-gray-100 hover:shadow-lg transition-all duration-300 group break-inside-avoid mb-px md:mb-0">
          <Link href={getProductUrl(product.id)}>
            <div className="cursor-pointer">
              {/* Product Image */}
              <div className="relative bg-gray-100 overflow-hidden rounded-sm m-px md:m-0.5 md:aspect-square">
                {product.imageUrl && Array.isArray(product.imageUrl) && product.imageUrl.length > 0 ? (
                  <Image 
                    src={product.imageUrl[0]} 
                    alt={product.name}
                    width={300}
                    height={300}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300 rounded-sm md:absolute md:inset-0 md:w-full md:h-full"
                    style={{ aspectRatio: 'auto' }}
                  />
                ) : (
                  <div className="w-full aspect-square bg-gradient-to-br from-orange-200 to-orange-300 rounded-sm"></div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-0.5 space-y-px md:p-2 md:space-y-1">
                {/* Product Name */}
                <h3 className="font-medium text-gray-900 text-xs md:text-base leading-tight line-clamp-1">
                  {product.name}
                </h3>

                {/* Product Description */}
                <p className="text-xs md:text-sm text-gray-500 line-clamp-1">
                  {product.description || 'Описание товара'}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-px md:gap-0.5">
                  {[...Array(5)].map((_, index) => {
                    const rating = product.averageRating;
                    const isFullStar = index < Math.floor(rating);
                    const isHalfStar = index === Math.floor(rating) && rating % 1 >= 0.1;
                    
                    return (
                      <div key={index} className="relative w-3 h-3 md:w-4 md:h-4">
                        {/* Background star (gray) */}
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-gray-200 text-gray-200 absolute" />
                        
                        {/* Foreground star (orange) */}
                        {isFullStar && (
                          <Star className="w-3 h-3 md:w-4 md:h-4 fill-orange-400 text-orange-400 absolute" />
                        )}
                        
                        {/* Half star */}
                        {isHalfStar && (
                          <div className="absolute overflow-hidden w-3 h-3 md:w-4 md:h-4" style={{ clipPath: `inset(0 ${100 - ((rating % 1) * 100)}% 0 0)` }}>
                            <Star className="w-3 h-3 md:w-4 md:h-4 fill-orange-400 text-orange-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <span className="text-xs md:text-sm text-gray-600 ml-px md:ml-0.5">
                    {product._count.reviews}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm md:text-lg">
                    {formatPrice(Number(product.price))}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
