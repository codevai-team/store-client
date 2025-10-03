'use client'

import { useState, useRef, useEffect, memo, useCallback } from 'react'
import Image from 'next/image'
import { Minus, Plus, Trash2, Palette, Ruler } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { CartItem } from '@/context/CartContext'
import CartItemOptionsModal from './CartItemOptionsModal'

interface SwipeableCartItemProps {
  item: CartItem
  onQuantityChange: (itemId: string, quantity: number, selectedSizeId?: string, selectedColorId?: string) => void
  onRemove: (itemId: string) => void
  onOptionsChange?: (itemId: string, currentSizeId?: string, currentColorId?: string, newSizeId?: string, newColorId?: string, newSize?: string, newColor?: string) => void
}

const SwipeableCartItem = memo(function SwipeableCartItem({ item, onQuantityChange, onRemove, onOptionsChange }: SwipeableCartItemProps) {
  const { t } = useLanguage()
  const [isSwipeActive, setIsSwipeActive] = useState(false)
  const [translateX, setTranslateX] = useState(0)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isColorModalOpen, setIsColorModalOpen] = useState(false)
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  const formatPrice = useCallback((price: number) => `${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} с.`, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentX = e.touches[0].clientX
    const diffX = startX - currentX

    // Ограничиваем свайп только влево и не более чем на 80px
    if (diffX > 0 && diffX <= 80) {
      setTranslateX(-diffX)
    } else if (diffX <= 0) {
      setTranslateX(0)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    
    // Если свайпнули больше чем на 40px, показываем кнопку удаления
    if (Math.abs(translateX) > 40) {
      setTranslateX(-80)
      setIsSwipeActive(true)
    } else {
      setTranslateX(0)
      setIsSwipeActive(false)
    }
  }


  const handleRemoveClick = useCallback(() => {
    onRemove(item.id)
  }, [onRemove, item.id])

  const handleQuantityDecrease = useCallback(() => {
    onQuantityChange(item.id, item.quantity - 1, item.selectedSizeId, item.selectedColorId)
  }, [onQuantityChange, item.id, item.quantity, item.selectedSizeId, item.selectedColorId])

  const handleQuantityIncrease = useCallback(() => {
    onQuantityChange(item.id, item.quantity + 1, item.selectedSizeId, item.selectedColorId)
  }, [onQuantityChange, item.id, item.quantity, item.selectedSizeId, item.selectedColorId])

  // Закрываем свайп при клике вне элемента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        setTranslateX(0)
        setIsSwipeActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={itemRef} className="relative bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Delete Button (показывается при свайпе на мобильных) */}
      <div className="absolute right-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center md:hidden">
        <button
          onClick={handleRemoveClick}
          className="w-full h-full flex items-center justify-center text-white"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div
        className="bg-white p-4 transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
            {item.imageUrl && Array.isArray(item.imageUrl) && item.imageUrl.length > 0 ? (
              <Image 
                src={item.imageUrl[0]} 
                alt={item.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300"></div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{item.name}</h3>
            <div className="text-sm font-bold text-gray-900 mb-2">{formatPrice(Number(item.price))}</div>
            
            {/* Size and Color Option Buttons */}
            <div className="flex flex-col gap-2 mt-2">
              {item.selectedSize && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSizeModalOpen(true)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs text-gray-600 border border-gray-200"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Размер</span>
                  </button>
                  <span className="text-xs font-medium text-gray-700">{item.selectedSize}</span>
                </div>
              )}
              {item.selectedColor && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsColorModalOpen(true)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs text-gray-600 border border-gray-200"
                  >
                    <Palette className="w-3 h-3" />
                    <span>Цвет</span>
                  </button>
                  <span className="text-xs font-medium text-gray-700">{item.selectedColor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quantity Controls and Desktop Delete Button */}
          <div className="flex flex-col items-end justify-center gap-2">
            {/* Desktop Delete Button */}
            <button
              onClick={handleRemoveClick}
              className="hidden md:block p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title={t.removeFromCart}
            >
              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
            </button>
            
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={handleQuantityDecrease}
                className="p-1.5 hover:bg-gray-50 transition-colors disabled:opacity-30"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-3 h-3 text-gray-600" />
              </button>
              <div className="px-3 py-1.5 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                {item.quantity}
              </div>
              <button
                onClick={handleQuantityIncrease}
                className="p-1.5 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-3 h-3 text-gray-600" />
              </button>
            </div>
            
            {/* Hint text when swiped (mobile only) */}
            {isSwipeActive && (
              <div className="text-xs text-gray-500 md:hidden">
                ← {t.removeFromCart}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Color Modal */}
      <CartItemOptionsModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSave={(_sizeId, colorId, _sizeName, colorName) => {
          if (onOptionsChange && (colorId || colorName)) {
            onOptionsChange(item.id, item.selectedSizeId, item.selectedColorId, item.selectedSizeId, colorId, item.selectedSize, colorName)
          }
        }}
        currentSize={item.selectedSize}
        currentColor={item.selectedColor}
        productId={item.id}
        productName={item.name}
        optionType="color"
      />

      {/* Size Modal */}
      <CartItemOptionsModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        onSave={(sizeId, _colorId, sizeName) => {
          if (onOptionsChange && (sizeId || sizeName)) {
            onOptionsChange(item.id, item.selectedSizeId, item.selectedColorId, sizeId, item.selectedColorId, sizeName, item.selectedColor)
          }
        }}
        currentSize={item.selectedSize}
        currentColor={item.selectedColor}
        productId={item.id}
        productName={item.name}
        optionType="size"
      />
    </div>
  )
})

export default SwipeableCartItem
