'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface Notification {
  id: string
  type: 'cart' | 'favorites' | 'success' | 'error'
  message: string
  productName?: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Автоматически удаляем уведомление через указанное время
    setTimeout(() => {
      removeNotification(id)
    }, notification.duration || 3000)
  }, [removeNotification])

  // Слушаем кастомные события для уведомлений
  useEffect(() => {
    const handleCustomNotification = (event: CustomEvent) => {
      showNotification(event.detail)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('showNotification', handleCustomNotification as EventListener)
      
      return () => {
        window.removeEventListener('showNotification', handleCustomNotification as EventListener)
      }
    }
  }, [showNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
