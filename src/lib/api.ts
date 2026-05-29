/**
 * Получает базовый URL для API запросов
 * Работает как на сервере, так и в браузере
 */
export function getApiBaseUrl(): string {
  // В браузере используем текущий origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // На сервере проверяем переменные окружения
  // 1. API_URL - серверная переменная для продакшена (runtime)
  if (process.env.API_URL) {
    console.log('[API] Using API_URL:', process.env.API_URL)
    return process.env.API_URL
  }
  
  // 2. NEXT_PUBLIC_API_URL - публичный URL (build time)
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('[API] Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  // 3. Vercel автоматически предоставляет VERCEL_URL
  if (process.env.VERCEL_URL) {
    console.log('[API] Using VERCEL_URL:', process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`
  }
  
  // 4. Fallback на localhost для локальной разработки
  const port = process.env.PORT || '3000'
  const fallbackUrl = `http://localhost:${port}`
  console.warn('[API] ⚠️ No API_URL set! Using fallback:', fallbackUrl)
  console.warn('[API] Available env vars:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME
  })
  return fallbackUrl
}

/**
 * Выполняет API запрос с правильным базовым URL
 */
export async function apiRequest(endpoint: string, options?: RequestInit): Promise<Response> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
}
