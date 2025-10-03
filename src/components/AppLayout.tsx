'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import BottomNavigation from './BottomNavigation'
import FilterModal from './FilterModal'

interface AppLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showBottomNav?: boolean
}

export default function AppLayout({ 
  children, 
  showHeader = true, 
  showBottomNav = true 
}: AppLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Определяем, является ли устройство десктопом
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768) // md breakpoint
    }

    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)

    return () => {
      window.removeEventListener('resize', checkIsDesktop)
    }
  }, [])

  const handleFilterClick = () => {
    setIsFilterOpen(true)
  }

  const handleApplyFilters = () => {
    // Эта логика будет обрабатываться на главной странице
    setIsFilterOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header показываем только на мобильных устройствах, если showHeader=true */}
      {showHeader && !isDesktop && <Header onFilterClick={handleFilterClick} />}
      
      <main className={showBottomNav ? 'pb-20 md:pb-0' : ''}>
        {children}
      </main>
      
      {/* BottomNavigation показываем только на мобильных устройствах */}
      {showBottomNav && !isDesktop && <BottomNavigation />}
      
      {/* Filter Modal показываем только на мобильных устройствах */}
      {!isDesktop && (
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          categories={[]}
        />
      )}
    </div>
  )
}



