'use client'

import { Home, ShoppingCart, Heart, Package, Grid3X3 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useCart } from '@/context/CartContext'
import { useOrders } from '@/context/OrdersContext'

export default function DesktopNavigation() {
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

  return (
    <div className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      {/* Desktop Navigation Only */}
      <div className="border-b border-orange-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <nav className="flex items-center justify-center py-3">
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
                            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold leading-none">
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
                            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold leading-none">
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
                            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold leading-none">
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
    </div>
  )
}



