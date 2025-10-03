'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Clock, User, Truck, CheckCircle, XCircle, AlertCircle, ShoppingCart, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { validateOrdersCookie } from '@/lib/cookies'
import Link from 'next/link'
import SkeletonLoader from '@/components/SkeletonLoader'

// Типы для заказов (обновленные для соответствия БД)
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


type OrderStatus = 'active' | 'completed' | 'cancelled'

export default function OrdersPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<OrderStatus>('active')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка заказов из API по ID из cookies
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Получаем ID заказов из куков
        const orderIds = validateOrdersCookie()
        
        if (orderIds.length === 0) {
          setOrders([])
          setIsLoading(false)
          return
        }

        // Загружаем полные данные заказов из API
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: orderIds }),
        })

        if (response.ok) {
          const ordersData = await response.json()
          setOrders(ordersData)
        } else {
          setError('Не удалось загрузить заказы')
          setOrders([])
        }
      } catch {
        setError('Не удалось загрузить заказы')
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'CREATED':
        return {
          text: t.created,
          icon: AlertCircle,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600'
        }
      case 'COURIER_WAIT':
        return {
          text: t.courierWait,
          icon: Clock,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          iconColor: 'text-orange-600'
        }
      case 'COURIER_PICKED':
        return {
          text: t.courierPicked,
          icon: User,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          iconColor: 'text-purple-600'
        }
      case 'ENROUTE':
        return {
          text: t.enroute,
          icon: Truck,
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          iconColor: 'text-indigo-600'
        }
      case 'DELIVERED':
        return {
          text: t.delivered,
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-600'
        }
      case 'CANCELED':
        return {
          text: t.canceled,
          icon: XCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-600'
        }
      default:
        return {
          text: status,
          icon: AlertCircle,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          iconColor: 'text-gray-600'
        }
    }
  }

  const StatusBadge = ({ status }: { status: Order['status'] }) => {
    const statusInfo = getStatusInfo(status)
    const IconComponent = statusInfo.icon
    
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
        <IconComponent className={`w-3 h-3 ${statusInfo.iconColor}`} />
        <span>{statusInfo.text}</span>
      </div>
    )
  }

  const getFilteredOrders = (): Order[] => {
    let filtered: Order[] = []
    switch (activeTab) {
      case 'active':
        filtered = orders.filter(order => 
          ['CREATED', 'COURIER_WAIT', 'COURIER_PICKED', 'ENROUTE'].includes(order.status)
        )
        break
      case 'completed':
        filtered = orders.filter(order => order.status === 'DELIVERED')
        break
      case 'cancelled':
        filtered = orders.filter(order => order.status === 'CANCELED')
        break
      default:
        filtered = []
    }
    
    return filtered
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => `${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} с.`
  
  const calculateOrderTotal = (orderItems: OrderItem[]) => {
    return orderItems.reduce((total, item) => total + (Number(item.price) * item.amount), 0)
  }

  const filteredOrders = getFilteredOrders()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        
        <h1 className="text-lg font-medium text-white">{t.myOrders}</h1>
        
        <div className="w-10 h-10"></div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 md:px-6 lg:px-8 py-4 bg-white">
        <div className="flex justify-center w-full">
          <div className="flex w-full max-w-md justify-between">
            {[
              { key: 'active', label: t.active },
              { key: 'completed', label: t.completed },
              { key: 'cancelled', label: t.cancelled }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as OrderStatus)}
                className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors text-center ${
                  activeTab === tab.key
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-400 border-transparent hover:text-orange-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 md:px-6 lg:px-8 pt-6 pb-6">
        {isLoading ? (
          <SkeletonLoader type="order" />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-16 h-16 md:w-20 md:h-20 text-orange-300" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center">
              {t.errorLoading}
            </h3>
            <p className="text-gray-600 text-center text-sm max-w-md leading-relaxed">
              {error}
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-16 h-16 md:w-20 md:h-20 text-orange-300" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center">
              {t.noOrdersTitle}
            </h2>
            <p className="text-gray-600 text-center text-sm max-w-md leading-relaxed">
              {t.noOrdersSubtitle}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const totalAmount = calculateOrderTotal(order.orderItems)

              const handleOrderClick = (e: React.MouseEvent) => {
                // Проверяем, что клик не по кнопке "Детали"
                if (!(e.target as HTMLElement).closest('button')) {
                  router.push(`/orders/${order.id}/track`)
                }
              }

              return (
                <div 
                  key={order.id} 
                  className="bg-white rounded-2xl p-3 md:p-4 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={handleOrderClick}
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-gray-900 text-sm">{t.orderFrom} {formatDate(order.createdAt).split(',')[0]}</span>
                      </div>
                      <span className="font-bold text-orange-600 text-base">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 text-sm">{t.status}:</span>
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 mb-3"></div>

                    {/* Contact Info and Details Button */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span className="text-sm">{order.customerPhone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-3 h-3 mt-0.5" />
                          <span className="text-sm">{order.deliveryAddress.length > 25 ? order.deliveryAddress.substring(0, 25) + '...' : order.deliveryAddress}</span>
                        </div>
                      </div>
                      
                      {/* Details Button */}
                      <div className="ml-3 flex-shrink-0">
                        <Link href={`/orders/${order.id}/track`}>
                          <button 
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t.details}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-gray-900 text-sm">{t.orderFrom} {formatDate(order.createdAt).split(',')[0]}</span>
                      </div>
                      <span className="font-bold text-orange-600 text-base">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 text-sm">{t.status}:</span>
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 mb-4"></div>

                    {/* Contact Info and Details Button */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span className="text-sm">{order.customerPhone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-3 h-3 mt-0.5" />
                          <span className="text-sm">{order.deliveryAddress.length > 25 ? order.deliveryAddress.substring(0, 25) + '...' : order.deliveryAddress}</span>
                        </div>
                      </div>
                      
                      {/* Details Button */}
                      <div className="ml-3 flex-shrink-0">
                        <Link href={`/orders/${order.id}/track`}>
                          <button 
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t.details}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
