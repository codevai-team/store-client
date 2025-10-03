'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (orderData: OrderFormData) => void
  totalAmount: number
  isLoading?: boolean
}

export interface OrderFormData {
  customerName: string
  customerPhone: string
  deliveryAddress: string
  customerComment?: string
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  totalAmount,
  isLoading = false 
}: CheckoutModalProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    customerComment: ''
  })
  const [errors, setErrors] = useState<Partial<OrderFormData>>({})
  const { t, language } = useLanguage()

  const formatPrice = (price: number) => `${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} с.`

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = t.enterName
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = t.enterPhone
    } else if (!/^\+?996\s?\d{3}\s?\d{3}\s?\d{3}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = t.phoneValidation
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = t.enterAddress
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    // Применяем ограничения по символам
    let limitedValue = value
    switch (field) {
      case 'customerName':
        limitedValue = value.slice(0, 20)
        break
      case 'deliveryAddress':
        limitedValue = value.slice(0, 25)
        break
      case 'customerComment':
        limitedValue = value.slice(0, 150)
        break
      default:
        limitedValue = value
    }
    
    setFormData(prev => ({ ...prev, [field]: limitedValue }))
    
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePhoneChange = (value: string) => {
    // Автоматическое форматирование номера телефона
    let formatted = value.replace(/\D/g, '')
    
    if (formatted.startsWith('996')) {
      formatted = '+' + formatted
    } else if (formatted.startsWith('0')) {
      formatted = '+996' + formatted.slice(1)
    } else if (!formatted.startsWith('+996') && formatted.length > 0) {
      formatted = '+996' + formatted
    }

    // Добавляем пробелы для читаемости
    if (formatted.length > 4) {
      formatted = formatted.slice(0, 4) + ' ' + formatted.slice(4)
    }
    if (formatted.length > 8) {
      formatted = formatted.slice(0, 8) + ' ' + formatted.slice(8)
    }
    if (formatted.length > 12) {
      formatted = formatted.slice(0, 12) + ' ' + formatted.slice(12, 15)
    }

    handleInputChange('customerPhone', formatted)
  }

  // Блокируем скролл страницы
  React.useEffect(() => {
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t.orderCheckout}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-700 font-medium">{t.orderTotal}:</span>
            <span className="text-lg sm:text-xl font-bold text-orange-600">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.customerName} * <span className="text-xs text-gray-500">({formData.customerName.length}/20)</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              maxLength={20}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white placeholder-gray-500 text-sm sm:text-base ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t.enterName}
              disabled={isLoading}
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.customerPhone} *
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white placeholder-gray-500 text-sm sm:text-base ${
                errors.customerPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+996 XXX XXX XXX"
              disabled={isLoading}
            />
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
            )}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.deliveryAddress} * <span className="text-xs text-gray-500">({formData.deliveryAddress.length}/25)</span>
            </label>
            <textarea
              value={formData.deliveryAddress}
              onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
              maxLength={25}
              rows={2}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-gray-900 bg-white placeholder-gray-500 text-sm sm:text-base ${
                errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={language === 'kg' ? 'Толук даректи киргизиңиз (шаар, көчө, үй, батир)' : 'Введите полный адрес доставки (город, улица, дом, квартира)'}
              disabled={isLoading}
            />
            {errors.deliveryAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
            )}
          </div>

          {/* Customer Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.customerComment} <span className="text-xs text-gray-500">({(formData.customerComment || '').length}/150)</span>
            </label>
            <textarea
              value={formData.customerComment || ''}
              onChange={(e) => handleInputChange('customerComment', e.target.value)}
              maxLength={150}
              rows={3}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-gray-900 bg-white placeholder-gray-500 text-sm sm:text-base"
              placeholder={t.optionalComment}
              disabled={isLoading}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
              disabled={isLoading}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg sm:rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading 
                ? (language === 'kg' ? 'Берилүүдө...' : 'Оформление...') 
                : t.placeOrder}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
          <p className="text-xs text-gray-600 text-center">
{language === 'kg' 
              ? 'Ырастагандан кийин менеджер сиз менен жеткирүүнүн деталдарын так билүү үчүн байланышат'
              : 'После подтверждения с вами свяжется менеджер для уточнения деталей доставки'}
          </p>
        </div>
      </div>
    </div>
  )
}
