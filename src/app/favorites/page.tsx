'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Heart, Star, ShoppingBag, X, Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useNotification } from '@/context/NotificationContext'
import { useCart } from '@/context/CartContext'
import SkeletonLoader from '@/components/SkeletonLoader'

// Импортируем тип из контекста
interface FavoriteItem {
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
  reviews: {
    rating: number
  }[]
  _count: {
    reviews: number
  }
  averageRating: number
}
import ConfirmModal from '@/components/ConfirmModal'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

export default function FavoritesPage() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const { favorites, removeFromFavorites, isLoading } = useFavorites()
  const { showNotification } = useNotification()
  const { addToCart, removeFromCart, updateQuantity, cartItems, isLoading: cartLoading } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [productToRemove, setProductToRemove] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<{[productId: string]: string}>({})
  const [selectedColors, setSelectedColors] = useState<{[productId: string]: string}>({})
  const [quantities, setQuantities] = useState<{[productId: string]: number}>({})
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set())

  const formatPrice = (price: number) => `${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} с.`

  const handleRemoveClick = (productId: string) => {
    setProductToRemove(productId)
    setIsConfirmModalOpen(true)
  }

  const handleConfirmRemove = () => {
    if (productToRemove) {
      removeFromFavorites(productToRemove)
      setProductToRemove(null)
    }
  }

  const handleCloseModal = () => {
    setIsConfirmModalOpen(false)
    setProductToRemove(null)
  }

  // Инициализируем размеры и цвета при загрузке избранных товаров
  useMemo(() => {
    const initialSizes: {[productId: string]: string} = {}
    const initialColors: {[productId: string]: string} = {}
    const initialQuantities: {[productId: string]: number} = {}
    
    favorites.forEach(product => {
      // Инициализируем размеры только если их еще нет в состоянии
      if (product.sizes && product.sizes.length > 0 && !selectedSizes[product.id]) {
        initialSizes[product.id] = product.sizes[0].id
      }
      // Инициализируем цвета только если их еще нет в состоянии
      if (product.colors && product.colors.length > 0 && !selectedColors[product.id]) {
        initialColors[product.id] = product.colors[0].id
      }
      
      // Ищем товар в корзине
      const cartItem = cartItems.find(item => item.id === product.id)
      initialQuantities[product.id] = cartItem ? cartItem.quantity : 0
    })
    
    // Обновляем состояние только если есть новые данные
    if (Object.keys(initialSizes).length > 0) {
      setSelectedSizes(prev => ({ ...prev, ...initialSizes }))
    }
    if (Object.keys(initialColors).length > 0) {
      setSelectedColors(prev => ({ ...prev, ...initialColors }))
    }
    setQuantities(initialQuantities)
  }, [favorites, cartItems, selectedSizes, selectedColors])

  const handleSizeSelect = (productId: string, sizeId: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: sizeId }))
  }

  const handleColorSelect = (productId: string, colorId: string) => {
    setSelectedColors(prev => ({ ...prev, [productId]: colorId }))
  }

  const handleAddToCart = async (product: FavoriteItem) => {
    if (!product || processingItems.has(product.id)) return

    setProcessingItems(prev => new Set(prev).add(product.id))

    const selectedSizeId = selectedSizes[product.id]
    const selectedColorId = selectedColors[product.id]

    // Находим названия размеров и цветов по их ID
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

  const handleQuantityChange = async (product: FavoriteItem, delta: number) => {
    if (processingItems.has(product.id)) return

    setProcessingItems(prev => new Set(prev).add(product.id))

    const currentQuantity = quantities[product.id] || 0
    const newQuantity = currentQuantity + delta
    const selectedSizeId = selectedSizes[product.id]
    const selectedColorId = selectedColors[product.id]
    
    if (newQuantity <= 0) {
      // Удаляем товар из корзины
      removeFromCart(product.id, selectedSizeId, selectedColorId)
      setQuantities(prev => ({ ...prev, [product.id]: 0 }))
      // Показываем уведомление об удалении
      showNotification({
        type: 'cart',
        message: 'Товар удален из корзины',
        duration: 2000
      })
    } else {
      // Обновляем количество в корзине
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

  // Получаем уникальные категории из избранных товаров
  const categories = useMemo(() => {
    // Используем Set для хранения уникальных ID категорий
    const uniqueCategoryIds = new Set<string>()
    const uniqueCategories: { id: string; name: string }[] = []
    
    favorites.forEach(item => {
      // Проверяем, что у товара есть категория и все нужные поля
      if (item?.category?.id && item?.category?.name && !uniqueCategoryIds.has(item.category.id)) {
        uniqueCategoryIds.add(item.category.id)
        uniqueCategories.push({
          id: item.category.id,
          name: item.category.name
        })
      }
    })

    // Сортируем категории по имени для консистентности
    uniqueCategories.sort((a, b) => a.name.localeCompare(b.name))
    
    return [{ id: 'all', name: t.all }, ...uniqueCategories]
  }, [favorites, t.all])

  // Фильтруем товары по выбранной категории
  const filteredFavorites = useMemo(() => {
    if (selectedCategory === 'all') {
      return favorites
    }
    return favorites.filter(item => item?.category?.id === selectedCategory)
  }, [favorites, selectedCategory])

  // Показываем индикатор загрузки пока данные загружаются
  if (isLoading) {
    return (
      <AppLayout showHeader={false} showBottomNav={true}>
        <SkeletonLoader type="page" />
      </AppLayout>
    )
  }

  if (favorites.length === 0) {
    return (
      <AppLayout showHeader={false} showBottomNav={true}>
        {/* Header */}
        <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-medium text-white">{t.myWishlist}</h1>
          
          <div className="w-10 h-10"></div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-16 h-16 md:w-20 md:h-20 text-orange-300" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center">
            {t.noFavoritesTitle}
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
            {t.noFavoritesSubtitle}
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            {t.startShopping}
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      {/* Header */}
      <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <h1 className="text-lg font-medium text-white">{t.myWishlist}</h1>
        
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {favorites.length}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={`category-${category.id}`}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative flex-shrink-0 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-300'
                }`}
                style={{
                  minWidth: 'fit-content'
                }}
              >
                <span className="relative z-10">
                  {category.name}
                  {category.id !== 'all' && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                      selectedCategory === category.id
                        ? 'bg-white/25 text-white'
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {favorites.filter(item => item?.category?.id === category.id).length}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredFavorites.map((product) => (
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
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-300"></div>
                    )}
                    
                    {/* Remove from favorites button - Top Right */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemoveClick(product.id)
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 z-10"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <X className="w-3.5 h-3.5 text-red-500" />
                    </button>

                    {/* Heart indicator - Top Left */}
                    <div className="absolute top-2 left-2 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                      <Heart className="w-3.5 h-3.5 text-white fill-white" />
                    </div>

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

        {/* No results for filtered category */}
        {filteredFavorites.length === 0 && selectedCategory !== 'all' && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'kg' ? 'Бул категорияда товар жок' : 'Нет товаров в этой категории'}
            </h3>
            <p className="text-gray-600 text-center">
              {language === 'kg' 
                ? 'Башка категорияны тандап көрүңүз' 
                : 'Попробуйте выбрать другую категорию'
              }
            </p>
          </div>
        )}
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20 md:h-0"></div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRemove}
        title={t.confirmRemoveTitle}
        message={t.confirmRemoveMessage}
        confirmText={t.remove}
        cancelText={t.cancel}
        isDestructive={true}
      />
    </AppLayout>
  )
}
