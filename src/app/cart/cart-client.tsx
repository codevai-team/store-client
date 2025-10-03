'use client'

import { useState, useCallback, useMemo } from 'react'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { useCart, CartItem } from '@/context/CartContext'
import { useNotification } from '@/context/NotificationContext'
import { useOrders } from '@/context/OrdersContext'
import CheckoutModal from '@/components/CheckoutModal'
import ConfirmModal from '@/components/ConfirmModal'
import SwipeableCartItem from '@/components/SwipeableCartItem'
import CartSkeleton from '@/components/CartSkeleton'
import AppLayout from '@/components/AppLayout'

export default function CartPageClient() {
  const { t } = useLanguage()
  const router = useRouter()
  const { cartItems: items, updateQuantity, removeFromCart: removeItem, getTotalPrice, clearCart, updateItemOptions, isLoading } = useCart()
  const { showNotification } = useNotification()
  const { addOrder } = useOrders()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<{ isOpen: boolean; item: CartItem | null }>({
    isOpen: false,
    item: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuantityChange = useCallback((id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const item = items.find(item => item.id === id)
      if (item) {
        setConfirmRemove({ isOpen: true, item })
      }
    } else {
      const item = items.find(item => item.id === id)
      if (item) {
        updateQuantity(id, newQuantity, item.selectedSizeId, item.selectedColorId)
      }
    }
  }, [items, updateQuantity])

  const handleRemoveItem = useCallback((itemId: string) => {
    const item = items.find(item => item.id === itemId)
    if (item) {
      setConfirmRemove({ isOpen: true, item })
    }
  }, [items])

  const confirmRemoveItem = useCallback(() => {
    if (confirmRemove.item) {
      removeItem(confirmRemove.item.id, confirmRemove.item.selectedSizeId, confirmRemove.item.selectedColorId)
      showNotification({ message: t.removeFromCart, type: 'success' })
    }
    setConfirmRemove({ isOpen: false, item: null })
  }, [confirmRemove.item, removeItem, showNotification, t.removeFromCart])

  const handleOptionsChange = useCallback((itemId: string, currentSizeId?: string, currentColorId?: string, newSizeId?: string, newColorId?: string, newSize?: string, newColor?: string) => {
    updateItemOptions(itemId, currentSizeId, currentColorId, newSizeId, newColorId, newSize, newColor)
    showNotification({ message: 'Опции товара обновлены', type: 'success' })
  }, [updateItemOptions, showNotification])

  const handleCheckout = async (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    customerComment?: string;
  }) => {
    setIsSubmitting(true)
    try {
      // Подготавливаем данные для отправки на сервер
      const orderPayload = {
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        deliveryAddress: orderData.deliveryAddress,
        customerComment: orderData.customerComment,
        cartItems: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          selectedSizeId: item.selectedSizeId,
          selectedColorId: item.selectedColorId
        }))
      }

      // Отправляем заказ на сервер
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Добавляем заказ в контекст
        addOrder(result.order)
        
        // Очищаем корзину
        clearCart()
        
        showNotification({ message: 'Заказ успешно оформлен!', type: 'success' })
        setIsCheckoutOpen(false)
        router.push('/orders')
      } else {
        const errorData = await response.json()
        showNotification({ 
          message: errorData.error || 'Ошибка при оформлении заказа', 
          type: 'error' 
        })
      }
    } catch (error) {
      console.error('Order creation error:', error)
      showNotification({ message: 'Ошибка при оформлении заказа', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }


  const { subtotal, deliveryFee, total } = useMemo(() => {
    const subtotal = getTotalPrice()
    const deliveryFee = subtotal > 2000 ? 0 : 200
    const total = subtotal + deliveryFee
    return { subtotal, deliveryFee, total }
  }, [getTotalPrice])

  // Показываем скелетон во время загрузки
  if (isLoading) {
    return (
      <AppLayout showHeader={false} showBottomNav={true}>
        <CartSkeleton />
      </AppLayout>
    )
  }

  if (items.length === 0) {
    return (
      <AppLayout showHeader={false} showBottomNav={true}>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <h1 className="text-lg font-medium text-white">{t.myCart}</h1>
            
            <div className="w-10 h-10"></div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.emptyCartTitle}</h2>
            <p className="text-gray-600 text-center mb-8 max-w-sm">{t.emptyCartSubtitle}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              {t.startShopping}
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-medium text-white">{t.myCart}</h1>
          
          <div className="w-10 h-10 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {items.length}
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <SwipeableCartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                onOptionsChange={handleOptionsChange}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Итого</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>{t.subtotal}</span>
                <span>{subtotal.toLocaleString()} сом</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>{t.deliveryFee}</span>
                <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                  {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee.toLocaleString()} сом`}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>{t.totalCost}</span>
                  <span>{total.toLocaleString()} сом</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors"
          >
            {t.proceedToCheckout}
          </button>
        </div>

        {/* Bottom spacing for mobile navigation */}
        <div className="h-20"></div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckout}
        totalAmount={total}
        isLoading={isSubmitting}
      />

      {/* Confirm Remove Modal */}
      <ConfirmModal
        isOpen={confirmRemove.isOpen}
        onClose={() => setConfirmRemove({ isOpen: false, item: null })}
        onConfirm={confirmRemoveItem}
        title={t.confirmRemoveFromCartTitle}
        message={t.confirmRemoveFromCartMessage}
        confirmText={t.yesRemove}
      />

    </AppLayout>
  )
}
