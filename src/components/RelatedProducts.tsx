'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingBag, Plus, Minus } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { useNotification } from '@/context/NotificationContext'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import SkeletonLoader from '@/components/SkeletonLoader'

interface RelatedProduct {
  id: string
  name: string
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
  averageRating: number
  _count: {
    reviews: number
  }
}

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
  limit?: number
}

export default function RelatedProducts({ 
  categoryId, 
  currentProductId, 
  limit = 6 
}: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<{[productId: string]: string}>({})
  const [selectedColors, setSelectedColors] = useState<{[productId: string]: string}>({})
  const [quantities, setQuantities] = useState<{[productId: string]: number}>({})
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set())
  const { toggleFavorite, isFavorite } = useFavorites()
  const { showNotification } = useNotification()
  const { addToCart, removeFromCart, updateQuantity, cartItems, isLoading: cartLoading } = useCart()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/products?categoryId=${categoryId}&limit=${limit + 1}`)
        
        if (response.ok) {
          const data = await response.json()
          // Исключаем текущий товар из списка
          const filteredProducts = data.filter((product: RelatedProduct) => 
            product.id !== currentProductId
          ).slice(0, limit)
          
          // Обрабатываем рейтинги - показываем 5.0 по умолчанию, если нет отзывов
          const processedProducts = filteredProducts.map((product: RelatedProduct) => ({
            ...product,
            averageRating: product._count.reviews > 0 ? product.averageRating : 5.0
          }))
          
          setProducts(processedProducts)
          
          // Инициализируем выбранные размеры и цвета по умолчанию
          const initialSizes: {[productId: string]: string} = {}
          const initialColors: {[productId: string]: string} = {}
          
          filteredProducts.forEach((product: RelatedProduct) => {
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
          setError('Ошибка загрузки товаров')
        }
      } catch {
        // Related products loading failed
        setError('Ошибка загрузки товаров')
      } finally {
        setLoading(false)
      }
    }

    if (categoryId && currentProductId) {
      fetchRelatedProducts()
    }
  }, [categoryId, currentProductId, limit])

  // Обновляем количества при изменении товаров или корзины
  useEffect(() => {
    if (products.length > 0) {
      const newQuantities: {[productId: string]: number} = {}
      products.forEach(product => {
        const cartItem = cartItems.find(item => item.id === product.id)
        newQuantities[product.id] = cartItem ? cartItem.quantity : 0
      })
      setQuantities(newQuantities)
    }
  }, [products, cartItems])

  const formatPrice = (price: number) => `${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} с.`


  const handleToggleFavorite = (product: RelatedProduct) => {
    try {
      if (!product || !product.id || !product.category?.id || !product.category?.name) {
        showNotification({
          type: 'error',
          message: t.errorInsufficientData,
          duration: 2000
        })
        return
      }

      toggleFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        seller: product.seller,
        sizes: product.sizes,
        colors: product.colors,
        reviews: [],
        _count: product._count,
        averageRating: product.averageRating
      })

      const message = isFavorite(product.id) ? 'Удалено из избранного' : t.addedToFavorites
      showNotification({
        type: 'favorites',
        message,
        duration: 2000
      })
    } catch {
      showNotification({
        type: 'error',
        message: t.errorAddingToFavorites,
        duration: 2000
      })
    }
  }

  const handleSizeSelect = (productId: string, sizeId: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: sizeId }))
  }

  const handleColorSelect = (productId: string, colorId: string) => {
    setSelectedColors(prev => ({ ...prev, [productId]: colorId }))
  }

  const handleAddToCart = async (product: RelatedProduct) => {
    if (!product || processingItems.has(product.id)) return

    setProcessingItems(prev => new Set(prev).add(product.id))

    const selectedSizeId = selectedSizes[product.id]
    const selectedColorId = selectedColors[product.id]

    const sizeName = product.sizes?.find(size => size.id === selectedSizeId)?.name || ''
    const colorName = product.colors?.find(color => color.id === selectedColorId)?.name || ''

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      selectedSize: sizeName,
      selectedColor: colorName,
      selectedSizeId: selectedSizeId,
      selectedColorId: selectedColorId,
      category: product.category,
      seller: product.seller
    }

    const success = await addToCart(cartItem, 1)
    
    if (success) {
      showNotification({
        type: 'cart',
        message: t.addedToCart,
        duration: 2000
      })
      setQuantities(prev => ({ ...prev, [product.id]: 1 }))
    }

    setProcessingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(product.id)
      return newSet
    })
  }

  const handleQuantityChange = async (product: RelatedProduct, delta: number) => {
    if (processingItems.has(product.id)) return

    setProcessingItems(prev => new Set(prev).add(product.id))

    const currentQuantity = quantities[product.id] || 0
    const newQuantity = currentQuantity + delta
    const selectedSizeId = selectedSizes[product.id]
    const selectedColorId = selectedColors[product.id]
    
    if (newQuantity <= 0) {
      removeFromCart(product.id, selectedSizeId, selectedColorId)
      setQuantities(prev => ({ ...prev, [product.id]: 0 }))
      showNotification({
        type: 'cart',
        message: 'Товар удален из корзины',
        duration: 2000
      })
    } else {
      updateQuantity(product.id, newQuantity, selectedSizeId, selectedColorId)
      setQuantities(prev => ({ ...prev, [product.id]: newQuantity }))
    }

    setProcessingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(product.id)
      return newSet
    })
  }

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
    return (
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Другие товары из этой категории
        </h2>
        <SkeletonLoader type="product" count={6} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" />
      </div>
    )
  }

  if (error || products.length === 0) {
    return null // Не показываем секцию, если нет товаров или ошибка
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {t.relatedProducts}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {products.filter(product => product && product.id && product.category?.id).map((product) => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group relative">
            {/* Product Image */}
            <Link href={getProductUrl(product.id)}>
              <div className="relative p-2 cursor-pointer">
                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                  {product.imageUrl && Array.isArray(product.imageUrl) && product.imageUrl.length > 0 ? (
                    <Image 
                      src={product.imageUrl[0]} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-300"></div>
                  )}
                  
                  {/* Favorite Button - Top Right */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleToggleFavorite(product)
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 z-10"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 ${isFavorite(product.id) ? 'fill-orange-500 text-orange-500' : 'text-orange-500'}`} 
                    />
                  </button>

                  {/* Color Selection - Bottom Right */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="absolute bottom-2 right-2 flex space-x-1 z-10">
                      {product.colors.slice(0, 3).map((color) => (
                        <button
                          key={color.id}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleColorSelect(product.id, color.id)
                          }}
                          className={`w-4 h-4 rounded-full border-2 transition-all shadow-sm ${
                            selectedColors[product.id] === color.id
                              ? 'border-white ring-2 ring-orange-400 scale-110'
                              : 'border-white hover:border-gray-200'
                          }`}
                          style={{
                            backgroundColor: color.colorCode || '#8B4513',
                            touchAction: 'manipulation'
                          }}
                          title={color.name}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <div className="w-4 h-4 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm">
                          <span className="text-[8px] font-bold text-gray-700">+{product.colors.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>

            {/* Product Info */}
            <div className="px-3 pb-3 space-y-2">
              {/* Title and Rating */}
              <Link href={getProductUrl(product.id)}>
                <div className="cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-black text-sm md:text-base leading-tight flex-1 truncate hover:text-orange-600 transition-colors">
                      {product.name.length > 25 ? `${product.name.substring(0, 25)}...` : product.name}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      <span className="text-xs text-gray-600 font-medium">
                        {product.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-black text-base">
                      {formatPrice(Number(product.price))}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-gray-700">{t.sizeLabel}</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.slice(0, 3).map((size) => (
                      <button
                        key={size.id}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleSizeSelect(product.id, size.id)
                        }}
                        className={`min-w-[1.5rem] h-6 px-2 rounded-md border text-xs font-medium transition-all ${
                          selectedSizes[product.id] === size.id
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                        style={{ touchAction: 'manipulation' }}
                      >
                        {size.name}
                      </button>
                    ))}
                    {product.sizes.length > 3 && (
                      <div className="min-w-[1.5rem] h-6 px-2 rounded-md border border-gray-300 bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">+{product.sizes.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="pt-1">
                {cartLoading ? (
                  // Loading state
                  <div className="w-full bg-orange-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 font-medium text-sm">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Загрузка...</span>
                  </div>
                ) : (quantities[product.id] || 0) === 0 ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                    className={`w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all text-sm ${
                      processingItems.has(product.id) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToCartButton}</span>
                  </button>
                ) : (
                  <div className="w-full bg-orange-500 text-white px-3 py-2 rounded-lg flex items-center justify-between font-medium">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleQuantityChange(product, -1)
                      }}
                      className={`w-6 h-6 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-full flex items-center justify-center transition-colors ${
                        processingItems.has(product.id) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Minus className="w-3 h-3 text-orange-600" />
                    </button>
                    
                    <span className="text-sm font-bold min-w-[1.5rem] text-center">
                      {quantities[product.id] || 0}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleQuantityChange(product, 1)
                      }}
                      className={`w-6 h-6 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-full flex items-center justify-center transition-colors ${
                        processingItems.has(product.id) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Plus className="w-3 h-3 text-orange-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
