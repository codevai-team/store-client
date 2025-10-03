'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Banner {
  id: number
  url: string
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  // const { t } = useLanguage() // Не используется в новой версии

  // Загружаем баннеры из API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners')
        const data = await response.json()
        
        if (data.banners && Array.isArray(data.banners)) {
          const bannerList = data.banners.map((url: string, index: number) => ({
            id: index + 1,
            url: url
          }))
          setBanners(bannerList)
        }
      } catch {
        // Banners loading failed
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
      setIsAnimating(false)
    }, 300)
  }, [banners.length])

  // Функция для получения текущих 3 баннеров для десктопа
  const getCurrentDesktopBanners = () => {
    if (banners.length === 0) return []
    if (banners.length <= 3) return banners
    
    // Показываем баннеры с текущего индекса и следующие 2
    const startIndex = currentSlide % banners.length
    const result = []
    
    for (let i = 0; i < 3; i++) {
      const index = (startIndex + i) % banners.length
      result.push(banners[index])
    }
    
    return result
  }

  const goToSlide = (index: number) => {
    if (index === currentSlide) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsAnimating(false)
    }, 300)
    setIsAutoPlay(false)
    // Возобновляем автопрокрутку через 5 секунд
    setTimeout(() => setIsAutoPlay(true), 5000)
  }

  useEffect(() => {
    if (!isAutoPlay || banners.length === 0) return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlay, nextSlide, banners.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX
    
    const handleTouchEnd = (endEvent: TouchEvent) => {
      const touchEndX = endEvent.changedTouches[0].clientX
      const difference = touchStartX - touchEndX
      
      if (Math.abs(difference) > 50 && banners.length > 0) {
        if (difference > 0) {
          // Swipe left - next slide
          nextSlide()
        } else {
          // Swipe right - previous slide
          setIsAnimating(true)
          setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
            setIsAnimating(false)
          }, 300)
        }
        setIsAutoPlay(false)
        setTimeout(() => setIsAutoPlay(true), 5000)
      }
      
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchend', handleTouchEnd)
  }

  // Показываем загрузку если баннеры еще не загружены
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Мобильная версия скелетона */}
        <div className="block lg:hidden">
          <div className="relative rounded-2xl overflow-hidden bg-orange-100 animate-pulse">
            <div className="aspect-[4/1] bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100"></div>
          </div>
        </div>

        {/* Десктопная версия скелетона */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden bg-orange-100 animate-pulse">
                <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Если баннеров нет, не показываем секцию
  if (banners.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Мобильная версия - один баннер */}
      <div className="block lg:hidden">
        <div 
          className="relative rounded-2xl overflow-hidden cursor-pointer shadow-lg"
          onTouchStart={handleTouchStart}
        >
          {/* Slides */}
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="w-full flex-shrink-0 relative bg-gray-100">
                <Image
                  src={banner.url}
                  alt={`Баннер ${banner.id}`}
                  width={800}
                  height={180}
                  className="w-full h-auto max-h-[150px] sm:max-h-[180px] object-contain object-center"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Dots indicator - показываем только если баннеров больше одного */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Десктопная версия - анимированные три баннера */}
      <div className="hidden lg:block">
        <div className="relative">
          <div 
            className={`grid grid-cols-3 gap-4 transition-all duration-500 ease-in-out ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {getCurrentDesktopBanners().map((banner, index) => (
              <div 
                key={`${banner.id}-${Math.floor(currentSlide / 3)}`} 
                className="relative rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-gray-100"
                onClick={() => goToSlide((currentSlide + index) % banners.length)}
              >
                <Image
                  src={banner.url}
                  alt={`Баннер ${banner.id}`}
                  width={400}
                  height={280}
                  className="w-full h-auto max-h-[250px] xl:max-h-[280px] object-contain object-center"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Навигационные стрелки для десктопа */}
          {banners.length > 3 && (
            <>
              <button
                onClick={() => {
                  setIsAnimating(true)
                  setTimeout(() => {
                    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
                    setIsAnimating(false)
                  }, 300)
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => nextSlide()}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        {/* Индикаторы для десктопа - вынесены ниже баннеров */}
        {banners.length > 3 && (
          <div className="flex justify-center mt-4 space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
