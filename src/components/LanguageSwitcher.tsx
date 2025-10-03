'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Language } from '@/lib/i18n'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages: { code: Language; name: string; shortName: string }[] = [
    { code: 'ru', name: 'Русский', shortName: 'RUS' },
    { code: 'kg', name: 'Кыргызча', shortName: 'KG' }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center justify-center border border-gray-200 hover:border-gray-300"
      >
        <Globe className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-orange-200 rounded-lg shadow-lg z-50 min-w-[100px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-orange-50'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Globe className="w-3 h-3" />
                <span>{lang.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
