'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Package, ClipboardList, Truck, CheckCircle, Clock, User } from 'lucide-react'
import { getOrdersCookie } from '@/lib/cookies'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import SkeletonLoader from '@/components/SkeletonLoader'

// Типы для отслеживания заказа
interface OrderItem {
  id: string
  amount: number
  price: number
  product: {
    id: string
    name: string
    imageUrl?: string[] | null
    category: {
      name: string
    }
  }
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  status: 'CREATED' | 'COURIER_WAIT' | 'COURIER_PICKED' | 'ENROUTE' | 'DELIVERED' | 'CANCELED'
  createdAt: string
  updatedAt: string
  customerComment?: string
  cancelComment?: string
  orderItems: OrderItem[]
}

interface StatusStep {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  completed: boolean
  current: boolean
}


export default function TrackOrderPage() {
  const params = useParams()
  const orderId = params?.id as string
  const { t } = useLanguage()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка данных заказа из API по ID
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Проверяем, есть ли ID заказа в куках (для проверки доступности)
        const orderIds = getOrdersCookie()
        if (!orderIds.includes(orderId)) {
          setError(t.orderNotFound)
          setIsLoading(false)
          return
        }

        // Загружаем полные данные заказа из API
        const response = await fetch(`/api/orders/${orderId}`)
        
        if (response.ok) {
          const orderData = await response.json()
          setOrder(orderData)
        } else if (response.status === 404) {
          setError(t.orderNotFound)
        } else {
          setError(t.failedToLoad)
        }
      } catch {
        // Order loading failed
        setError(t.failedToLoad)
      } finally {
        setIsLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, t.orderNotFound, t.failedToLoad])


  const getStatusSteps = (currentStatus: Order['status']): StatusStep[] => {
    const allStatuses = ['CREATED', 'COURIER_WAIT', 'COURIER_PICKED', 'ENROUTE', 'DELIVERED'] as const
    const currentIndex = allStatuses.indexOf(currentStatus as typeof allStatuses[number])
    
    return [
      {
        key: 'CREATED',
        label: t.orderPlaced,
        icon: ClipboardList,
        completed: currentIndex >= 0,
        current: currentStatus === 'CREATED'
      },
      {
        key: 'COURIER_WAIT',
        label: t.waitingCourier,
        icon: Clock,
        completed: currentIndex >= 1,
        current: currentStatus === 'COURIER_WAIT'
      },
      {
        key: 'COURIER_PICKED',
        label: t.courierTook,
        icon: User,
        completed: currentIndex >= 2,
        current: currentStatus === 'COURIER_PICKED'
      },
      {
        key: 'ENROUTE',
        label: t.inTransit,
        icon: Truck,
        completed: currentIndex >= 3,
        current: currentStatus === 'ENROUTE'
      },
      {
        key: 'DELIVERED',
        label: t.deliveredStatus,
        icon: CheckCircle,
        completed: currentStatus === 'DELIVERED',
        current: currentStatus === 'DELIVERED'
      }
    ]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => `${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} с.`

  const calculateOrderTotal = (orderItems: OrderItem[]) => {
    return orderItems.reduce((total, item) => total + (Number(item.price) * item.amount), 0)
  }

  if (isLoading) {
    return <SkeletonLoader type="page" />
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/orders">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
          
          <h1 className="text-lg font-medium text-white">{t.order}</h1>
          
          <div className="w-10 h-10"></div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t.orderNotFound}</h3>
          <p className="text-gray-500 text-center">{error || t.orderNotFoundDesc}</p>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps(order.status)
  const totalAmount = calculateOrderTotal(order.orderItems)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/orders">
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </Link>
        
        <h1 className="text-lg font-medium text-white">{t.orderDetails}</h1>
        
        <div className="w-10 h-10"></div>
      </div>

      <div className="px-4 py-6">
        {/* Product Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.itemsInOrder}</h3>
          <div className="space-y-4">
            {order.orderItems.map((item) => {
              const productImage = item.product.imageUrl && Array.isArray(item.product.imageUrl) && item.product.imageUrl.length > 0 
                ? item.product.imageUrl[0] 
                : null

              return (
                <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {productImage ? (
                      <Image 
                        src={productImage} 
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {t.category}: {item.product.category.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {t.quantity}: {item.amount} {t.pieces}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(Number(item.price))}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.orderDetails}
          </h3>
          
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t.customerName}</span>
              <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t.phone}</span>
              <span className="text-sm font-medium text-gray-900">{order.customerPhone}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">{t.deliveryAddress}</span>
              <span className="text-sm font-medium text-gray-900 text-right max-w-xs">
                {order.deliveryAddress}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t.createdDate}</span>
              <span className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</span>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
              <span className="text-base font-semibold text-gray-900">{t.total}</span>
              <span className="text-lg font-bold text-orange-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.deliveryStatus}
          </h3>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {statusSteps.map((step) => {
                const IconComponent = step.icon
                
                return (
                  <div key={step.key} className="relative flex items-start">
                    {/* Status Circle */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-orange-500' 
                        : step.current
                        ? 'bg-orange-200'
                        : 'bg-gray-200'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        step.completed 
                          ? 'text-white' 
                          : step.current
                          ? 'text-orange-600'
                          : 'text-gray-400'
                      }`} />
                    </div>

                    {/* Status Content */}
                    <div className="ml-4 flex-1">
                      <h4 className={`text-sm font-medium ${
                        step.completed || step.current
                          ? 'text-gray-900' 
                          : 'text-gray-500'
                      }`}>
                        {step.label}
                      </h4>
                      {step.current && (
                        <p className="text-xs text-orange-600 font-medium">
                          {t.currentStatus}
                        </p>
                      )}
                      {step.completed && !step.current && (
                        <p className="text-xs text-gray-500">
                          {t.completed}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>


        {/* Customer Comment */}
        {order.customerComment && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              {t.orderComment}
            </h4>
            <p className="text-sm text-blue-700">
              {order.customerComment}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
