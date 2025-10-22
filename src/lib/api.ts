/**
 * Получает базовый URL для API запросов
 * Работает как на сервере, так и в браузере
 */
export function getApiBaseUrl(): string {
  // В браузере используем текущий origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // На сервере используем переменные окружения
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Fallback для продакшена
  return 'https://unimark.kg'
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
