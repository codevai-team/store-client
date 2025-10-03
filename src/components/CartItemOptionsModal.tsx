'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import { X, Check } from 'lucide-react'
import SkeletonLoader from '@/components/SkeletonLoader'

interface Size {
  id: string
  name: string
}

interface Color {
  id: string
  name: string
  colorCode: string
}

interface CartItemOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (sizeId?: string, colorId?: string, sizeName?: string, colorName?: string) => void
  currentSize?: string
  currentColor?: string
  productId: string
  productName: string
  optionType: 'color' | 'size'
}

const CartItemOptionsModal = memo(function CartItemOptionsModal({
  isOpen,
  onClose,
  onSave,
  currentSize,
  currentColor,
  productId,
  productName,
  optionType
}: CartItemOptionsModalProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string>('')
  const [selectedColorId, setSelectedColorId] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState(currentSize)
  const [selectedColor, setSelectedColor] = useState(currentColor)
  const [availableSizes, setAvailableSizes] = useState<Size[]>([])
  const [availableColors, setAvailableColors] = useState<Color[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Все хуки должны быть вызваны до любого условного возврата
  const handleSave = useCallback(() => {
    onSave(selectedSizeId, selectedColorId, selectedSize, selectedColor)
    onClose()
  }, [onSave, onClose, selectedSizeId, selectedColorId, selectedSize, selectedColor])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  // Загрузка данных товара
  useEffect(() => {
    if (isOpen && productId) {
      setIsLoading(true)
      setSelectedSize(currentSize)
      setSelectedColor(currentColor)
      document.body.style.overflow = 'hidden'

      // Загружаем данные товара из API
      fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(data => {
          if (data.sizes) {
            setAvailableSizes(data.sizes)
            // Находим ID текущего размера
            const currentSizeObj = data.sizes.find((size: Size) => size.name === currentSize)
            if (currentSizeObj) {
              setSelectedSizeId(currentSizeObj.id)
            }
          }
          if (data.colors) {
            setAvailableColors(data.colors)
            // Находим ID текущего цвета
            const currentColorObj = data.colors.find((color: Color) => color.name === currentColor)
            if (currentColorObj) {
              setSelectedColorId(currentColorObj.id)
            }
          }
        })
        .catch(() => {
          // Product data loading failed
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, productId, currentSize, currentColor])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-md mx-auto shadow-2xl transform transition-all duration-300 max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
          <h3 className="text-lg font-semibold text-gray-900">
            {optionType === 'color' ? 'Выбор цвета' : 'Выбор размера'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-4">
          {/* Product Name */}
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-sm text-gray-600 truncate">{productName}</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-6">
              <SkeletonLoader type="product" count={1} />
            </div>
          )}

          {/* Size Selection */}
          {!isLoading && optionType === 'size' && (
            <div className="p-6">
              <h4 className="text-base font-medium text-gray-900 mb-4">Размер</h4>
              {availableSizes.length === 0 ? (
                <p className="text-sm text-gray-500">Нет доступных размеров</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => {
                        setSelectedSize(size.name)
                        setSelectedSizeId(size.id)
                      }}
                      className={`h-12 rounded-xl border-2 font-medium transition-all ${
                        selectedSize === size.name
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Color Selection */}
          {!isLoading && optionType === 'color' && (
            <div className="p-6">
              <h4 className="text-base font-medium text-gray-900 mb-4">Цвет</h4>
              {availableColors.length === 0 ? (
                <p className="text-sm text-gray-500">Нет доступных цветов</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setSelectedColor(color.name)
                        setSelectedColorId(color.id)
                      }}
                      className={`relative h-12 rounded-xl border-2 transition-all overflow-hidden ${
                        selectedColor === color.name
                          ? 'border-orange-500 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color.colorCode }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className={`w-5 h-5 ${
                            color.colorCode === '#ffffff' || color.colorCode === '#eab308' 
                              ? 'text-gray-900' 
                              : 'text-white'
                          }`} />
                        </div>
                      )}
                      {color.colorCode === '#ffffff' && (
                        <div className="absolute inset-0 border border-gray-200 rounded-xl" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed Actions */}
        <div className="flex gap-3 p-4 pb-6 border-t-2 border-gray-200 bg-white relative z-10 rounded-b-3xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors active:bg-gray-300"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors active:bg-orange-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
})

export default CartItemOptionsModal
