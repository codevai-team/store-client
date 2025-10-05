'use client'

import React, { useState, useEffect } from 'react'
import { X, Star, Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reviewData: ReviewFormData) => void
  productName: string
  isLoading?: boolean
  editMode?: boolean
  initialData?: ReviewFormData
}

export interface ReviewFormData {
  clientName: string
  text: string
  rating: number
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  productName,
  isLoading = false,
  editMode = false,
  initialData
}: ReviewModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<ReviewFormData>({
    clientName: '',
    text: '',
    rating: 0
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ReviewFormData, string>>>({})
  const [hoveredRating, setHoveredRating] = useState(0)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReviewFormData, string>> = {}

    if (!formData.clientName.trim()) {
      newErrors.clientName = t.enterNameError
    } else if (formData.clientName.trim().length > 20) {
      newErrors.clientName = 'Имя не должно превышать 20 символов'
    }

    if (!formData.text.trim()) {
      newErrors.text = t.writeReviewError
    } else if (formData.text.trim().length < 10) {
      newErrors.text = t.minimumLengthError
    } else if (formData.text.trim().length > 200) {
      newErrors.text = 'Отзыв не должен превышать 200 символов'
    }

    if (formData.rating === 0) {
      newErrors.rating = t.setRatingError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      // Форма будет сброшена после успешной отправки в родительском компоненте
    }
  }

  const handleInputChange = (field: keyof ReviewFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleRatingClick = (rating: number) => {
    handleInputChange('rating', rating)
  }

  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  const resetForm = () => {
    setFormData({
      clientName: '',
      text: '',
      rating: 0
    })
    setErrors({})
    setHoveredRating(0)
  }

  // Инициализация формы при открытии в режиме редактирования
  useEffect(() => {
    if (isOpen && editMode && initialData) {
      setFormData(initialData)
    } else if (isOpen && !editMode) {
      resetForm()
    }
  }, [isOpen, editMode, initialData])

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  // Блокируем скролл страницы
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {editMode ? t.editReview : t.leaveReview}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{productName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.yourRating}
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  onMouseLeave={handleRatingLeave}
                  className="p-1 transition-transform hover:scale-110"
                  disabled={isLoading}
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || formData.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {formData.rating > 0 ? `${formData.rating} ${t.outOf5}` : t.notSelected}
              </span>
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.yourName}
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  handleInputChange('clientName', e.target.value)
                }
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white placeholder-gray-500 ${
                errors.clientName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t.enterYourName}
              disabled={isLoading}
              maxLength={20}
            />
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.yourReview}
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  handleInputChange('text', e.target.value)
                }
              }}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-gray-900 bg-white placeholder-gray-500 ${
                errors.text ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t.shareImpressions}
              disabled={isLoading}
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.text ? (
                <p className="text-sm text-red-600">{errors.text}</p>
              ) : (
                <p className="text-xs text-gray-500">{t.minimumCharacters}</p>
              )}
              <p className="text-xs text-gray-400">
                {formData.text.length}/200
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{editMode ? t.saving : t.sending}</span>
                </>
              ) : (
                editMode ? t.save : t.send
              )}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            {t.reviewHelp}
          </p>
        </div>
      </div>
    </div>
  )
}
