/**
 * Получает базовый URL для API запросов
 * Работает как на сервере, так и в браузере
 */
export function getApiBaseUrl(): string {
  // В браузере используем текущий origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // На сервере — обращаемся к самому себе через localhost
  // Это необходимо, т.к. внешний домен может быть недоступен изнутри контейнера
  const port = process.env.PORT || '3000'
  return `http://localhost:${port}`
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
