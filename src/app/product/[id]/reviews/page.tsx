'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, MessageCircle, Edit2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useNotification } from '@/context/NotificationContext'
import AppLayout from '@/components/AppLayout'
import ReviewModal, { ReviewFormData } from '@/components/ReviewModal'
import { getUserReviewIdForProduct, saveUserReviewId, canUserReviewProduct, testLocalStorage } from '@/lib/reviewStorage'

interface Review {
  id: string
  clientName: string
  text: string
  rating: number
}

interface Product {
  id: string
  name: string
  averageRating: number
  _count: {
    reviews: number
  }
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

export default function ProductReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const { showNotification } = useNotification()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [resetReviewForm, setResetReviewForm] = useState(false)
  const [userReviewId, setUserReviewId] = useState<string | null>(null)
  const [userReviewData, setUserReviewData] = useState<{ clientName: string; text: string; rating: number } | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Загружаем информацию о товаре
        const productResponse = await fetch(`/api/products/${params.id}`)
        if (productResponse.ok) {
          const productData = await productResponse.json()
          setProduct({
            id: productData.id,
            name: productData.name,
            averageRating: productData.averageRating,
            _count: productData._count
          })
        }

        // Загружаем отзывы
        const reviewsResponse = await fetch(`/api/products/${params.id}/reviews`)
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json()
          setReviews(reviewsData)
          
          // Проверяем, есть ли ID отзыва пользователя в localStorage
          if (params.id) {
            const reviewId = getUserReviewIdForProduct(params.id as string)
            setUserReviewId(reviewId)
            
            // Если есть ID отзыва, находим его данные
            if (reviewId) {
              const userReview = reviewsData.find((r: Review) => r.id === reviewId)
              if (userReview) {
                setUserReviewData({
                  clientName: userReview.clientName,
                  text: userReview.text,
                  rating: userReview.rating
                })
              }
            }
            
            // Тестируем localStorage
            testLocalStorage()
          }
        }
      } catch {
        // Data loading failed
        showNotification({
          type: 'cart',
          message: t.errorLoadingReviews,
          duration: 3000
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id, showNotification, t])

  const handleReviewSubmit = async (reviewData: ReviewFormData) => {
    if (!product) return

    // Проверяем, может ли пользователь оставить отзыв (только если это новый отзыв, а не редактирование)
    if (!isEditMode && !userReviewId && !canUserReviewProduct(product.id)) {
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

      if (isEditMode && userReviewId) {
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

        // Обновляем отзывы
        const updatedResponse = await fetch(`/api/products/${product.id}/reviews`)
        if (updatedResponse.ok) {
          const updatedReviews = await updatedResponse.json()
          setReviews(updatedReviews)
        }

        // Обновляем информацию о товаре
        const productResponse = await fetch(`/api/products/${product.id}`)
        if (productResponse.ok) {
          const productData = await productResponse.json()
          setProduct({
            id: productData.id,
            name: productData.name,
            averageRating: productData.averageRating,
            _count: productData._count
          })
        }

        showNotification({
          type: 'cart',
          message: isEditMode ? t.reviewUpdated : t.reviewSubmitted,
          duration: 3000
        })
        
        handleReviewFormReset()
        setIsReviewModalOpen(false)
        setIsEditMode(false)
      } else {
        showNotification({
          type: 'cart',
          message: result.error || t.reviewSubmitError,
          duration: 3000
        })
      }
    } catch {
      // Review submission failed
      showNotification({
        type: 'cart',
        message: t.reviewSubmitErrorGeneral,
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

  const handleEditReview = () => {
    if (userReviewId && userReviewData) {
      setIsEditMode(true)
      setIsReviewModalOpen(true)
    }
  }

  const handleNewReview = () => {
    setIsEditMode(false)
    setIsReviewModalOpen(true)
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

  if (loading) {
    return (
      <AppLayout showHeader={false} showBottomNav={true}>
        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="sticky top-0 bg-white z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
            <div className="w-32 h-6 bg-gray-100 rounded"></div>
            <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
          </div>
          
          {/* Loading skeleton */}
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!product) {
    return (
      <AppLayout showHeader={false} showBottomNav={true}>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Товар не найден</h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Назад
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      {/* Header */}
      <div className="sticky top-0 bg-white z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <h1 className="text-lg font-medium text-gray-900">Отзывы</h1>
        
        {canUserReviewProduct(params.id as string) ? (
          <button
            onClick={handleNewReview}
            className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button
            onClick={handleEditReview}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <Edit2 className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Product Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {renderStars(product.averageRating > 0 ? product.averageRating : 5.0)}
              <span className="text-sm font-medium text-gray-600">
                {(product.averageRating > 0 ? product.averageRating : 5.0).toFixed(1)} из 5
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {product._count.reviews} отзывов
            </span>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t.noReviewsYet}
            </h3>
            <p className="text-gray-600 mb-4">
              {t.beFirstToReview}
            </p>
            <button
              onClick={handleNewReview}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {t.writeReview}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Отзыв пользователя (если есть) */}
            {userReviewId && userReviewData && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 text-base">
                      {userReviewData.clientName}
                    </h4>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Ваш отзыв
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(userReviewData.rating, 'w-4 h-4')}
                    <button
                      onClick={handleEditReview}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                      title={t.editReview}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {userReviewData.text}
                </p>
              </div>
            )}

            {/* Остальные отзывы */}
            {reviews
              .filter(review => !userReviewId || review.id !== userReviewId)
              .map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base">
                        {review.clientName}
                      </h4>
                      {renderStars(review.rating, 'w-4 h-4')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {review.rating} из 5
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false)
          setIsEditMode(false)
        }}
        onSubmit={handleReviewSubmit}
        productName={product.name}
        isLoading={isSubmittingReview}
        editMode={isEditMode}
        initialData={isEditMode && userReviewData ? {
          clientName: userReviewData.clientName,
          text: userReviewData.text,
          rating: userReviewData.rating
        } : undefined}
        key={resetReviewForm ? 'reset' : 'normal'}
      />
    </AppLayout>
  )
}
