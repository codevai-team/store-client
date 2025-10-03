'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import DesktopNavigation from './DesktopNavigation'
import Footer from './Footer'

interface DesktopLayoutProps {
  children: React.ReactNode
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const pathname = usePathname()

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

  // Для главной страницы не показываем навигацию и Footer в DesktopLayout,
  // так как они уже есть в самой странице
  const isHomePage = pathname === '/'

  return (
    <>
      {/* Desktop Navigation - показываем на всех страницах кроме главной для десктопа */}
      {isDesktop && !isHomePage && (
        <DesktopNavigation />
      )}
      
      {/* Main Content */}
      <main className={isDesktop && !isHomePage ? 'min-h-screen' : ''}>
        {children}
      </main>
      
      {/* Desktop Footer - показываем на всех страницах кроме главной для десктопа */}
      {isDesktop && !isHomePage && (
        <Footer />
      )}
    </>
  )
}
