'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { validateOrdersCookie, setOrdersCookie } from '@/lib/cookies'

// Типы для элементов заказа
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

interface OrdersContextType {
  orders: Order[]
  getTotalOrders: () => number
  refreshOrders: () => void
  addOrder: (order: Order) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  // Функция для загрузки полных данных заказов из API по ID
  const loadOrdersFromAPI = async (orderIds: string[]) => {
    if (orderIds.length === 0) {
      setOrders([])
      return
    }

    try {
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
        // Orders loading failed
        setOrders([])
      }
    } catch {
      // Orders loading failed
      setOrders([])
    }
  }

  const refreshOrders = async () => {
    try {
      // Получаем ID заказов из куков
      const orderIds = validateOrdersCookie()
      await loadOrdersFromAPI(orderIds)
    } catch {
      // Orders loading failed
      setOrders([])
    }
  }

  // Загружаем заказы при инициализации
  useEffect(() => {
    // Загружаем ID из куков и получаем полные данные из API
    const orderIds = validateOrdersCookie()
    loadOrdersFromAPI(orderIds)
  }, [])

  const getTotalOrders = () => {
    return orders.length
  }

  const addOrder = (order: Order) => {
    // Добавляем заказ в локальный стейт
    setOrders(prev => [order, ...prev])
    
    // Сохраняем ID заказа в куки
    const currentOrderIds = validateOrdersCookie()
    const newOrderIds = [order.id, ...currentOrderIds.filter(id => id !== order.id)]
    setOrdersCookie(newOrderIds)
  }

  return (
    <OrdersContext.Provider value={{
      orders,
      getTotalOrders,
      refreshOrders,
      addOrder
    }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
