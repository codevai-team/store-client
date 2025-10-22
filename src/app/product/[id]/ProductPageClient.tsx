'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Heart, Star, ShoppingBag, Plus, Minus, X, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useCart } from '@/context/CartContext'
import { useNotification } from '@/context/NotificationContext'
import AppLayout from '@/components/AppLayout'
import ReviewModal, { ReviewFormData } from '@/components/ReviewModal'
import RelatedProducts from '@/components/RelatedProducts'
import { canUserReviewProduct, saveUserReviewId, getUserReviewIdForProduct } from '@/lib/reviewStorage'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string[] | null
  category: {
    id: string
    name: string
  }
  seller: {
    id: string
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
  reviews: Array<{
    id: string
    clientName: string
    text: string
    rating: number
  }>
  averageRating: number
  _count: {
    reviews: number
  }
  attributes?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

interface Size {
  id: string
  name: string
}

interface Color {
  id: string
  name: string
  colorCode?: string
}

interface Review {
  id: string
  clientName: string
  text: string
  rating: number
}

interface ReviewApiResponse {
  review: {
    id: string
    clientName: string
    text: string
    rating: number
  }
  error?: string
}

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClient({ product: initialProduct }: ProductPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  
  const [product, setProduct] = useState<Product>(initialProduct)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(0)
  const [isInCart, setIsInCart] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [resetReviewForm, setResetReviewForm] = useState(false)
  const [userReviewId, setUserReviewId] = useState<string | null>(null)
  const [userReviewData, setUserReviewData] = useState<{ clientName: string; text: string; rating: number } | null>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToCart, removeFromCart, updateQuantity, cartItems } = useCart()
  const { showNotification } = useNotification()

  useEffect(() => {
    // Получаем параметры из URL
    const urlSizeId = searchParams.get('sizeId')
    const urlColorId = searchParams.get('colorId')
    
    // Устанавливаем размер из URL или первый доступный
    if (urlSizeId && product.sizes.find((s: Size) => s.id === urlSizeId)) {
      setSelectedSize(urlSizeId)
    } else if (product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].id)
    }
    
    // Устанавливаем цвет из URL или первый доступный
    if (urlColorId && product.colors.find((c: Color) => c.id === urlColorId)) {
      setSelectedColor(urlColorId)
    } else if (product.colors.length > 0) {
      setSelectedColor(product.colors[0].id)
    }
    
    // Проверяем, есть ли ID отзыва пользователя в localStorage
    const reviewId = getUserReviewIdForProduct(product.id)
    setUserReviewId(reviewId)
    
    // Если есть ID отзыва, загружаем его данные из API
    if (reviewId) {
      const userReview = product.reviews.find((r: Review) => r.id === reviewId)
      if (userReview) {
        setUserReviewData({
          clientName: userReview.clientName,
          text: userReview.text,
          rating: userReview.rating
        })
      }
    }
  }, [product, searchParams])

  // Проверяем, есть ли товар в корзине
  useEffect(() => {
    if (product) {
      const cartItem = cartItems.find(item => 
        item.id === product.id && 
        item.selectedSizeId === selectedSize && 
        item.selectedColorId === selectedColor
      )
      if (cartItem) {
        setIsInCart(true)
        setQuantity(cartItem.quantity)
      } else {
        setIsInCart(false)
        setQuantity(0)
      }
    }
  }, [product, cartItems, selectedSize, selectedColor])

  const handleToggleFavorite = async () => {
    if (product && product.id && product.category?.id && product.category?.name) {
      const favoriteItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        seller: product.seller,
        reviews: product.reviews,
        _count: product._count,
        averageRating: product.averageRating,
        sizes: product.sizes || [],
        colors: product.colors || []
      }
      
      const wasInFavorites = isFavorite(product.id)
      await toggleFavorite(favoriteItem)
      
      // Показываем уведомление только при добавлении
      if (!wasInFavorites) {
        showNotification({
          type: 'favorites',
          message: t.addedToFavorites,
          duration: 2000
        })
      }
    }
  }

  const formatPrice = (price: number) => `${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} с.`

  const updateUrlParams = (sizeId?: string, colorId?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (sizeId) {
      params.set('sizeId', sizeId)
    }
    if (colorId) {
      params.set('colorId', colorId)
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }

  const handleAddToCart = async () => {
    if (!product) return

    // Находим названия размеров и цветов по их ID
    const sizeName = product.sizes.find(size => size.id === selectedSize)?.name || selectedSize
    const colorName = product.colors.find(color => color.id === selectedColor)?.name || selectedColor

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      selectedSize: sizeName,
      selectedColor: colorName,
      selectedSizeId: selectedSize,
      selectedColorId: selectedColor,
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
      setIsInCart(true)
      setQuantity(1)
    }
  }

  const handleQuantityChange = async (delta: number) => {
    if (!product) return

    const newQuantity = quantity + delta
    
    if (newQuantity <= 0) {
      // Удаляем товар из корзины
      removeFromCart(product.id, selectedSize, selectedColor)
      setIsInCart(false)
      setQuantity(0)
    } else {
      // Обновляем количество в корзине
      updateQuantity(product.id, newQuantity, selectedSize, selectedColor)
      setQuantity(newQuantity)
    }
  }

  const handleReviewSubmit = async (reviewData: ReviewFormData) => {
    if (!product) return

    // Проверяем, может ли пользователь оставить отзыв (только если это не редактирование)
    if (!userReviewId && !canUserReviewProduct(product.id)) {
      showNotification({
        type: 'cart',
        message: t.alreadyReviewed,
        duration: 3000
      })
      return
    }

    setIsSubmittingReview(true)
    
    try {
      let response: Response
      let result: ReviewApiResponse

      if (userReviewId) {
        // Редактируем существующий отзыв
        response = await fetch(`/api/products/${product.id}/reviews`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reviewId: userReviewId,
            ...reviewData
          }),
        })
        result = await response.json()
      } else {
        // Создаем новый отзыв
        response = await fetch(`/api/products/${product.id}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        })
        result = await response.json()
      }

      if (response.ok) {
        // Сохраняем только ID отзыва в localStorage (компактный формат)
        saveUserReviewId(product.id, result.review.id)
        setUserReviewId(result.review.id)
        setUserReviewData({
          clientName: reviewData.clientName,
          text: reviewData.text,
          rating: reviewData.rating
        })

        // Обновляем товар, чтобы показать новый отзыв
        const updatedResponse = await fetch(`/api/products/${product.id}`)
        if (updatedResponse.ok) {
          const updatedProduct = await updatedResponse.json()
          setProduct(updatedProduct)
        }

        showNotification({
          type: 'cart',
          message: userReviewId ? t.reviewUpdated : t.reviewAdded,
          duration: 3000
        })
        
        handleReviewFormReset()
        setIsReviewModalOpen(false)
      } else {
        showNotification({
          type: 'cart',
          message: result.error || (userReviewId ? t.errorUpdatingReview : t.errorAddingReview),
          duration: 3000
        })
      }
    } catch {
      // Review submission failed
      showNotification({
        type: 'cart',
        message: 'Произошла ошибка',
        duration: 3000
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleReviewFormReset = () => {
    setResetReviewForm(true)
    setTimeout(() => setResetReviewForm(false), 100)
  }

  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const renderReviewText = (text: string, reviewId: string) => {
    const isExpanded = expandedReviews.has(reviewId)
    const shouldTruncate = text.length > 100

    if (!shouldTruncate || isExpanded) {
      return (
        <p className="text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
          {text}
        </p>
      )
    }

    return (
      <div>
        <p className="text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
          {text.substring(0, 100)}...
        </p>
        <button
          onClick={() => toggleReviewExpansion(reviewId)}
          className="text-orange-500 hover:text-orange-600 text-sm font-medium mt-1"
        >
          читать далее
        </button>
      </div>
    )
  }

  const images = product.imageUrl && Array.isArray(product.imageUrl) ? product.imageUrl : []

  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      {/* Header */}
      <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <h1 className="text-lg font-medium text-white">{t.productDetails}</h1>
        
        <button
          onClick={handleToggleFavorite}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Heart className={`w-5 h-5 ${product && isFavorite(product.id) ? 'fill-orange-500 text-orange-500' : 'text-orange-500'}`} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-1 md:px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images - Left Column */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {images.length > 0 ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                  <span className="text-orange-600 text-lg">{t.noImage}</span>
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index 
                        ? 'border-orange-500 ring-2 ring-orange-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right Column */}
          <div className="space-y-4">
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <span className="text-orange-500 text-sm font-medium">{product.category.name}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span className="text-gray-900 font-medium">{(product.averageRating > 0 ? product.averageRating : 5.0).toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({product._count.reviews})</span>
              </div>
            </div>

            {/* Product Name and Price */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight flex-1">
                {product.name}
              </h1>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-500 flex-shrink-0">
                {formatPrice(Number(product.price))}
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-4 bg-orange-500 rounded-full mr-2"></span>
                {t.productDetails}
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed">
                {product.description && product.description.length > 80 ? (
                  <>
                    <p>
                      {isDescriptionExpanded 
                        ? product.description 
                        : `${product.description.substring(0, 80)}...`
                      }
                    </p>
                    <button 
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-orange-500 font-medium mt-1 hover:text-orange-600 text-sm transition-colors block"
                    >
                      {isDescriptionExpanded ? 'Скрыть' : t.readMore}
                    </button>
                  </>
                ) : (
                  <p>{product.description || t.highQualityProduct}</p>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">{t.selectSize}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => {
                        setSelectedSize(size.id)
                        updateUrlParams(size.id, selectedColor)
                      }}
                      className={`min-w-[2rem] h-8 px-3 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${
                        selectedSize === size.id
                          ? 'border-orange-500 bg-orange-500 text-white shadow-md'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t.selectColor}: <span className="text-gray-600 font-normal text-xs">
                    {product.colors.find(c => c.id === selectedColor)?.name || product.colors[0]?.name}
                  </span>
                </h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setSelectedColor(color.id)
                        updateUrlParams(selectedSize, color.id)
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColor === color.id
                          ? 'border-orange-500 ring-2 ring-orange-200 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{
                        backgroundColor: color.colorCode || '#8B4513'
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">{t.selectColor}</h3>
                <div className="p-2 bg-gray-50 rounded-lg text-center">
                  <span className="text-gray-500 text-xs">{t.noColorsAvailable}</span>
                </div>
              </div>
            )}

            {/* Product Attributes */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">{t.specifications}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(product.attributes as Record<string, unknown>).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="text-xs font-semibold text-gray-900">
                        {typeof value === 'boolean' 
                          ? (value ? t.yes : t.no)
                          : String(value)
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button with integrated counter */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-xl flex items-center justify-between font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                {!isInCart ? (
                  <button 
                    onClick={handleAddToCart}
                    className="flex items-center space-x-2 w-full justify-center"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{t.addToCart}</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    {/* Кнопка минус */}
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-full flex items-center justify-center transition-colors shadow-md"
                    >
                      <Minus className="w-4 h-4 text-orange-600" />
                    </button>
                    
                    {/* Счётчик */}
                    <span className="text-lg font-bold min-w-[2rem] text-center text-white drop-shadow-lg">
                      {quantity}
                    </span>
                    
                    {/* Кнопка плюс */}
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-full flex items-center justify-center transition-colors shadow-md"
                    >
                      <Plus className="w-4 h-4 text-orange-600" />
                    </button>
                    
                    {/* Кнопка удаления */}
                    <button
                      onClick={() => {
                        removeFromCart(product.id, selectedSize, selectedColor)
                        setIsInCart(false)
                        setQuantity(0)
                      }}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors ml-2 shadow-md"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Review Button */}
              {userReviewId ? (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 md:px-6 py-2.5 md:py-3 rounded-xl flex items-center justify-center space-x-2 font-medium transition-colors border border-blue-200 hover:border-blue-300 text-sm md:text-base"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{t.editReview}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 md:px-6 py-2.5 md:py-3 rounded-xl flex items-center justify-center space-x-2 font-medium transition-colors border border-gray-200 hover:border-gray-300 text-sm md:text-base"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{t.leaveReview}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.reviews} {product.reviews.length > 0 && `(${product.reviews.length})`}
            </h2>
            <div className="flex items-center space-x-2">
              {renderStars(product.averageRating > 0 ? product.averageRating : 5.0)}
              <span className="text-sm font-medium text-gray-600">
                {(product.averageRating > 0 ? product.averageRating : 5.0).toFixed(1)} {t.outOf5}
              </span>
            </div>
          </div>

          {product.reviews.length === 0 ? (
            <div className="text-center py-6 md:py-12 bg-gray-50 rounded-xl">
              <MessageCircle className="w-8 h-8 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 md:mb-2">
                {t.noReviewsYet}
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 px-4">
                {t.beFirstToReview}
              </p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 md:py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                {t.writeReview}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {product.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 max-w-full overflow-hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base">
                        {review.clientName}
                      </h4>
                      {renderStars(review.rating, 'w-4 h-4')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {review.rating} {t.outOf5}
                    </div>
                  </div>
                  {renderReviewText(review.text, review.id)}
                </div>
              ))}
              
              {/* Show All Reviews Button */}
              {product.reviews.length > 3 && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => router.push(`/product/${product.id}/reviews`)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-colors inline-flex items-center space-x-2 text-sm md:text-base"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{t.showAllReviews} ({product.reviews.length})</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        <RelatedProducts 
          categoryId={product.category.id}
          currentProductId={product.id}
          limit={6}
        />
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        productName={product.name}
        isLoading={isSubmittingReview}
        editMode={!!userReviewId}
        initialData={userReviewData ? {
          clientName: userReviewData.clientName,
          text: userReviewData.text,
          rating: userReviewData.rating
        } : undefined}
        key={resetReviewForm ? 'reset' : 'normal'}
      />
    </AppLayout>
  )
}
