'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, Heart, ShoppingBag, X, AlertCircle } from 'lucide-react'

interface NotificationToastProps {
  type: 'cart' | 'favorites' | 'success' | 'error'
  message: string
  isVisible: boolean
  onClose: () => void
  productName?: string
  duration?: number
}

export default function NotificationToast({ 
  type, 
  message, 
  isVisible, 
  onClose, 
  productName,
  duration = 3000 
}: NotificationToastProps) {
  const [progress, setProgress] = useState(100)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  const handleClose = useCallback(() => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      onClose()
    }, 300) // Время анимации исчезновения
  }, [onClose])

  useEffect(() => {
    if (isVisible) {
      // Анимация прогресс-бара
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50))
          return Math.max(0, newProgress)
        })
      }, 50)

      // Автоматическое закрытие
      const closeTimer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(closeTimer)
      }
    }
  }, [isVisible, duration, handleClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'cart':
        return <ShoppingBag className="w-5 h-5 text-white" />
      case 'favorites':
        return <Heart className="w-5 h-5 text-white fill-white" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-white" />
      default:
        return <CheckCircle className="w-5 h-5 text-white" />
    }
  }

  const getStyles = () => {
    // Единый стиль прозрачного стекла с оранжевым оттенком для всех типов уведомлений
    return {
      background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(234, 88, 12, 0.25) 50%, rgba(251, 146, 60, 0.15) 100%)',
      iconBg: 'bg-orange-500/20',
      progressBg: 'bg-orange-400/30',
      borderColor: 'border-orange-300/30'
    }
  }

  const styles = getStyles()

  return (
    <div 
      className={`
        relative
        text-white 
        p-3 sm:p-3 md:p-4
        rounded-xl sm:rounded-xl md:rounded-2xl 
        shadow-2xl
        flex items-center 
        gap-3 sm:gap-3 md:gap-4
        w-full max-w-[280px] sm:max-w-sm md:max-w-sm 
        backdrop-blur-2xl
        border ${styles.borderColor}
        transition-all duration-500 ease-out
        transform-gpu
        ${isAnimatingOut 
          ? 'opacity-0 translate-x-full scale-95 animate-slide-out-right' 
          : isVisible 
            ? 'opacity-100 translate-x-0 scale-100 animate-slide-in-right' 
            : 'opacity-0 translate-x-full scale-95'
        }
      `}
      style={{
        background: styles.background,
        boxShadow: '0 20px 40px -12px rgba(251, 146, 60, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 146, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
      }}
    >
      {/* Иконка */}
      <div className={`
        flex-shrink-0 
        w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 
        rounded-full 
        ${styles.iconBg}
        flex items-center justify-center
        backdrop-blur-sm
        border border-orange-400/40
        animate-bounce-in
        shadow-lg
      `}>
        {getIcon()}
      </div>
      
      {/* Контент */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm sm:text-sm md:text-base leading-tight mb-1 text-white">
          {message}
        </p>
        {productName && (
          <p className="text-xs text-white/80 truncate">
            {productName}
          </p>
        )}
      </div>

      {/* Кнопка закрытия */}
      <button
        onClick={handleClose}
        className="
          flex-shrink-0
          w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8
          flex items-center justify-center
          hover:bg-white/20 
          rounded-full 
          transition-all duration-200
          hover:scale-110
          active:scale-95
          group
          border border-white/30
        "
      >
        <X className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:rotate-90 transition-transform duration-200 text-white" />
      </button>

      {/* Прогресс-бар */}
      <div className={`
        absolute bottom-0 left-0 right-0 
        h-1 
        ${styles.progressBg}
        rounded-b-xl md:rounded-b-2xl 
        overflow-hidden
      `}>
        <div 
          className="h-full bg-orange-300/80 transition-all duration-75 ease-linear rounded-b-xl md:rounded-b-2xl shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-2 right-8 w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-200/40 rounded-full animate-pulse" />
      <div className="absolute top-4 md:top-5 right-12 md:right-14 w-1 h-1 bg-orange-300/50 rounded-full animate-pulse delay-300" />
      
      {/* Дополнительный блик стеклянного эффекта */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-orange-100/30 via-orange-200/20 to-transparent rounded-t-xl md:rounded-t-2xl pointer-events-none" />
      
      {/* Дополнительный эффект стекла */}
      <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-200/10 via-transparent to-orange-400/10 pointer-events-none" />
    </div>
  )
}
