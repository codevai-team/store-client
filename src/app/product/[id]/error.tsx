'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, RefreshCw, Package } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ProductError({ error, reset }: ErrorProps) {
  const params = useParams()
  const productId = params.id

  useEffect(() => {
    console.error('Product page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-4">
            <Package className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Ошибка</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Не удалось загрузить товар
          </h2>
          <p className="text-gray-600 mb-8">
            Произошла ошибка при загрузке информации о товаре.
            {productId && (
              <span className="block mt-2 text-sm">
                ID товара: {productId}
              </span>
            )}
          </p>
        </div>

        {/* Error Details (только в development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Детали ошибки:</h3>
            <p className="text-xs text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                ID ошибки: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Попробовать снова
          </button>
          
          <Link
            href="/categories"
            className="inline-flex items-center justify-center w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors duration-200"
          >
            <Package className="w-5 h-5 mr-2" />
            Все товары
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            На главную
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Если проблема повторяется, пожалуйста, свяжитесь с поддержкой.</p>
        </div>
      </div>
    </div>
  )
}
