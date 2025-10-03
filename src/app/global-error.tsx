'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Логируем критическую ошибку
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="ru">
      <body className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-6xl font-bold text-gray-800 mb-2">Ошибка</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Критическая ошибка приложения
            </h2>
            <p className="text-gray-600 mb-8">
              Произошла критическая ошибка, которая повлияла на работу всего приложения.
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
              Перезагрузить приложение
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Если проблема повторяется, пожалуйста, обновите страницу или свяжитесь с поддержкой.</p>
          </div>
        </div>
      </body>
    </html>
  )
}
