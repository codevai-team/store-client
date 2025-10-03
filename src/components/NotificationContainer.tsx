'use client'

import { useNotification } from '@/context/NotificationContext'
import NotificationToast from './NotificationToast'
import { useEffect, useState } from 'react'

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Предотвращаем рендеринг на сервере для избежания ошибок гидратации
  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div className="flex flex-col gap-3 items-end">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="pointer-events-auto transform-gpu w-auto notification-stack"
            style={{
              animationDelay: `${index * 100}ms`,
              zIndex: 9999 - index,
              transform: `translateY(${index * 8}px) translateX(${index * 4}px)`
            }}
          >
            <NotificationToast
              type={notification.type}
              message={notification.message}
              productName={notification.productName}
              isVisible={true}
              onClose={() => removeNotification(notification.id)}
              duration={notification.duration}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
