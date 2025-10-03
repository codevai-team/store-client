'use client'

import { Search, Filter, Home, ShoppingCart, Heart, X, Package, Grid3X3 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useCart } from '@/context/CartContext'
import { useOrders } from '@/context/OrdersContext'
import LanguageSwitcher from './LanguageSwitcher'

interface HeaderProps {
  onFilterClick: () => void
  onSearch?: (query: string) => void
}

export default function Header({ onFilterClick, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const { t } = useLanguage()
  const { favorites } = useFavorites()
  const { getTotalItems } = useCart()
  const { getTotalOrders } = useOrders()

  const navItems = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'categories', icon: Grid3X3, label: t.categories || 'Категории' },
    { id: 'cart', icon: ShoppingCart, label: t.cart },
    { id: 'favorites', icon: Heart, label: t.favorites },
    { id: 'orders', icon: Package, label: t.myOrders || 'Мои заказы' }
  ]

  const [hasSearched, setHasSearched] = useState(false)

  // Определяем появление клавиатуры на мобильных устройствах
  useEffect(() => {
    let initialHeight = window.visualViewport?.height || window.innerHeight

    const handleResize = () => {
      if (window.innerWidth < 768) { // только для мобильных
        const currentHeight = window.visualViewport?.height || window.innerHeight
        const heightDifference = initialHeight - currentHeight
        
        // Если высота уменьшилась более чем на 150px, считаем что клавиатура открыта
        const keyboardOpen = heightDifference > 150
        setIsKeyboardVisible(keyboardOpen)
        
        // Если клавиатура закрылась, обновляем начальную высоту
        if (!keyboardOpen) {
          initialHeight = currentHeight
        }
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    } else {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      } else {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // Управляем состоянием расширения поиска
  useEffect(() => {
    if (window.innerWidth < 768) { // только для мобильных
      if (isKeyboardVisible) {
        setIsSearchExpanded(true)
      } else if (!isKeyboardVisible) {
        // Возвращаем в исходное состояние при закрытии клавиатуры
        setIsSearchExpanded(false)
      }
    }
  }, [isKeyboardVisible])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    
    // Если пользователь изменил текст после поиска, сбрасываем флаг поиска
    if (hasSearched && newValue !== searchQuery) {
      setHasSearched(false)
    }
  }

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchQuery)
      setHasSearched(true)
    }
    // Закрываем клавиатуру на мобильных устройствах
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    // Возвращаем поиск в исходное состояние после поиска
    if (window.innerWidth < 768) {
      setIsSearchExpanded(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setHasSearched(false)
    if (onSearch) {
      onSearch('')
    }
    // Возвращаем поиск в исходное состояние после очистки
    if (window.innerWidth < 768) {
      setIsSearchExpanded(false)
    }
  }

  const handleSearchFocus = () => {
    if (window.innerWidth < 768) {
      setIsSearchExpanded(true)
    }
  }

  // Дополнительная проверка для сворачивания поиска
  useEffect(() => {
    const handleTouchStart = () => {
      // При касании экрана проверяем, нужно ли свернуть поиск
      if (window.innerWidth < 768 && isSearchExpanded && !isKeyboardVisible && !searchQuery) {
        setIsSearchExpanded(false)
      }
    }

    if (window.innerWidth < 768) {
      document.addEventListener('touchstart', handleTouchStart)
      return () => {
        document.removeEventListener('touchstart', handleTouchStart)
      }
    }
  }, [isSearchExpanded, isKeyboardVisible, searchQuery])

  const handleSearchBlur = () => {
    // Добавляем небольшую задержку для проверки, действительно ли клавиатура закрылась
    setTimeout(() => {
      if (window.innerWidth < 768 && !isKeyboardVisible) {
        setIsSearchExpanded(false)
      }
    }, 100)
  }

  // Обработка клика вне поля поиска
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 768 && isSearchExpanded) {
        const target = event.target as HTMLElement
        const searchContainer = searchInputRef.current?.closest('.relative')
        
        if (searchContainer && !searchContainer.contains(target)) {
          // Если клик был вне поля поиска, сворачиваем его
          setIsSearchExpanded(false)
          if (searchInputRef.current) {
            searchInputRef.current.blur()
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchExpanded])

  return (
    <div className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      {/* Desktop Navigation */}
      <div className="hidden md:block border-b border-orange-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <nav className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/client-store-logo.svg" 
                alt="Client Store" 
                width={120}
                height={48}
                className="h-12 w-auto hover:scale-105 transition-transform duration-200"
              />
            </Link>
            
            <div className="flex items-center justify-center flex-1">
              {navItems.map((item) => {
                const IconComponent = item.icon
                const isActive = (() => {
                  if (item.id === 'home') return pathname === '/'
                  if (item.id === 'categories') return pathname.startsWith('/categories') || pathname.startsWith('/category')
                  if (item.id === 'cart') return pathname.startsWith('/cart')
                  if (item.id === 'favorites') return pathname.startsWith('/favorites')
                  if (item.id === 'orders') return pathname.startsWith('/orders')
                  return false
                })()
                
                const NavButton = ({ children }: { children: React.ReactNode }) => (
                  <div
                    className={`relative flex items-center space-x-2 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-orange-500 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    {children}
                  </div>
                )
                
                if (item.id === 'cart') {
                  return (
                    <Link key={item.id} href="/cart">
                      <NavButton>
                        <div className="relative">
                          <IconComponent className="w-4 h-4" />
                          {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {getTotalItems() > 9 ? '9+' : getTotalItems()}
                            </span>
                          )}
                        </div>
                        <span>{item.label}</span>
                      </NavButton>
                    </Link>
                  )
                }

                if (item.id === 'favorites') {
                  return (
                    <Link key={item.id} href="/favorites">
                      <NavButton>
                        <div className="relative">
                          <IconComponent className="w-4 h-4" />
                          {favorites.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {favorites.length > 9 ? '9+' : favorites.length}
                            </span>
                          )}
                        </div>
                        <span>{item.label}</span>
                      </NavButton>
                    </Link>
                  )
                }

                if (item.id === 'categories') {
                  return (
                    <Link key={item.id} href="/categories">
                      <NavButton>
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavButton>
                    </Link>
                  )
                }

                if (item.id === 'orders') {
                  return (
                    <Link key={item.id} href="/orders">
                      <NavButton>
                        <div className="relative">
                          <IconComponent className="w-4 h-4" />
                          {getTotalOrders() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {getTotalOrders() > 9 ? '9+' : getTotalOrders()}
                            </span>
                          )}
                        </div>
                        <span>{item.label}</span>
                      </NavButton>
                    </Link>
                  )
                }
                
                return (
                  <Link key={item.id} href="/">
                    <NavButton>
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavButton>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="flex gap-3 items-center">
          {/* Mobile Logo - скрывается при расширении поиска */}
          <div className={`md:hidden transition-all duration-300 ${
            isSearchExpanded ? 'opacity-0 pointer-events-none w-0 overflow-hidden' : 'opacity-100'
          }`}>
            <Link href="/" className="flex items-center">
              <Image 
                src="/client-store-logo.svg" 
                alt="Client Store" 
                width={84}
                height={28}
                className="h-7 w-auto hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className={`relative flex transition-all duration-300 ${
            isSearchExpanded ? 'flex-1' : 'flex-1'
          }`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t.searchProducts}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="block w-full pl-11 pr-10 py-3 text-sm text-gray-900 border border-orange-200 rounded-l-xl bg-orange-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset focus:border-orange-500 focus:bg-white transition-all duration-200"
            />
            <button
              onClick={hasSearched ? handleClearSearch : handleSearchSubmit}
              className="px-4 py-3 bg-orange-500 text-white rounded-r-xl hover:bg-orange-600 transition-colors duration-200 border border-orange-500"
            >
              {hasSearched ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Language Switcher - скрывается при расширении поиска на мобильных */}
          <div className={`md:hidden transition-all duration-300 ${
            isSearchExpanded ? 'opacity-0 pointer-events-none w-0 overflow-hidden' : 'opacity-100'
          }`}>
            <LanguageSwitcher />
          </div>
          
          {/* Language Switcher for Desktop */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          
          {/* Filter Button - скрывается при расширении поиска на мобильных */}
          <button
            onClick={onFilterClick}
            className={`w-10 h-10 hover:bg-gray-100 rounded-full transition-all duration-300 flex items-center justify-center border border-gray-200 hover:border-gray-300 ${
              isSearchExpanded ? 'md:flex hidden' : 'flex'
            }`}
          >
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
