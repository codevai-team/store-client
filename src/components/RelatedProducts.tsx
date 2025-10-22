'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { useNotification } from '@/context/NotificationContext'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import SkeletonLoader from '@/components/SkeletonLoader'

interface RelatedProduct {
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
  const { addToCart, removeFromCart, updateQuantity, cartItems, isLoading: _cartLoading } = useCart()
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


  const _handleToggleFavorite = (product: RelatedProduct) => {
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

  const _handleSizeSelect = (productId: string, sizeId: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: sizeId }))
  }

  const _handleColorSelect = (productId: string, colorId: string) => {
    setSelectedColors(prev => ({ ...prev, [productId]: colorId }))
  }

  const _handleAddToCart = async (product: RelatedProduct) => {
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

  const _handleQuantityChange = async (product: RelatedProduct, delta: number) => {
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
    </div>
  )
}
