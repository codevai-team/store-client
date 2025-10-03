// Утилиты для работы с куками

export function setCookie(name: string, value: string, days?: number) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  } else {
    // Если дни не указаны, кука будет храниться очень долго (100 лет)
    const date = new Date()
    date.setTime(date.getTime() + (100 * 365 * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  // Кодируем значение для безопасного хранения в куки
  const encodedValue = encodeURIComponent(value || '')
  document.cookie = name + '=' + encodedValue + expires + '; path=/'
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null // SSR safety
  }
  
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) {
      const encodedValue = c.substring(nameEQ.length, c.length)
      // Декодируем значение из куки
      try {
        const decodedValue = decodeURIComponent(encodedValue)
        return decodedValue
      } catch {
        return encodedValue // Возвращаем исходное значение в случае ошибки
      }
    }
  }
  return null
}

export function eraseCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

// Специальные функции для работы с избранными в компактном формате
// Формат: {id};{id};{id}... - только ID товаров через точку с запятой
export function setFavoritesCookie(favoriteIds: string[]) {
  try {
    const favoritesString = favoriteIds.join(';')
    setCookie('favorites', favoritesString)
  } catch {
    // Silently fail
  }
}

export function getFavoritesCookie(): string[] {
  try {
    const favoritesString = getCookie('favorites')
    if (favoritesString) {
      const favoriteIds = favoritesString.split(';').filter(id => id.trim())
      return favoriteIds
    }
    return []
  } catch {
    return []
  }
}

export function addFavoriteToCookie(productId: string) {
  try {
    const existingFavoriteIds = getFavoritesCookie()
    
    // Проверяем, что товар не дублируется
    if (existingFavoriteIds.includes(productId)) {
      return
    }
    
    // Ограничиваем количество избранных в куки до 1000, так как теперь храним только ID
    const maxFavorites = 1000
    let updatedFavoriteIds = [productId, ...existingFavoriteIds]
    
    // Если избранных больше максимума, оставляем только последние
    if (updatedFavoriteIds.length > maxFavorites) {
      updatedFavoriteIds = updatedFavoriteIds.slice(0, maxFavorites)
    }
    
    setFavoritesCookie(updatedFavoriteIds)
  } catch {
    // Silently fail
  }
}

export function removeFavoriteFromCookie(productId: string) {
  try {
    const existingFavoriteIds = getFavoritesCookie()
    const updatedFavoriteIds = existingFavoriteIds.filter(id => id !== productId)
    setFavoritesCookie(updatedFavoriteIds)
    return true
  } catch {
    return false
  }
}

export function clearFavoritesCookie() {
  try {
    eraseCookie('favorites')
    return true
  } catch {
    return false
  }
}

export function validateFavoritesCookie(): string[] {
  try {
    const favoriteIds = getFavoritesCookie()
    if (!Array.isArray(favoriteIds)) {
      clearFavoritesCookie()
      return []
    }
    // Проверяем, что все элементы - строки
    const validFavoriteIds = favoriteIds.filter(id => typeof id === 'string' && id.trim())
    if (validFavoriteIds.length !== favoriteIds.length) {
      setFavoritesCookie(validFavoriteIds)
    }
    return validFavoriteIds
  } catch {
    clearFavoritesCookie()
    return []
  }
}

// Специальные функции для работы с заказами в компактном формате
// Формат: {id};{id};{id}... - только ID заказов через точку с запятой
export function setOrdersCookie(orderIds: string[]) {
  try {
    const ordersString = orderIds.join(';')
    setCookie('user_orders', ordersString)
  } catch {
    // Silently fail
  }
}

export function getOrdersCookie(): string[] {
  try {
    const ordersString = getCookie('user_orders')
    if (ordersString) {
      const orderIds = ordersString.split(';').filter(id => id.trim())
      return orderIds
    }
    return []
  } catch {
    return []
  }
}

export function addOrderToCookie(orderId: string) {
  try {
    const existingOrderIds = getOrdersCookie()
    
    // Проверяем, что заказ не дублируется
    if (existingOrderIds.includes(orderId)) {
      return
    }
    
    // Ограничиваем количество заказов в куки до 500, так как теперь храним только ID
    const maxOrders = 500
    let updatedOrderIds = [orderId, ...existingOrderIds]
    
    // Если заказов больше максимума, оставляем только последние
    if (updatedOrderIds.length > maxOrders) {
      updatedOrderIds = updatedOrderIds.slice(0, maxOrders)
    }
    
    setOrdersCookie(updatedOrderIds)
  } catch {
    // Silently fail
  }
}

// Функция для удаления заказа из cookies (например, при отмене)
export function removeOrderFromCookie(orderId: string) {
  try {
    const existingOrderIds = getOrdersCookie()
    const updatedOrderIds = existingOrderIds.filter(id => id !== orderId)
    setOrdersCookie(updatedOrderIds)
    return true
  } catch {
    return false
  }
}

// Функция для очистки куки заказов (если они повреждены)
export function clearOrdersCookie() {
  try {
    eraseCookie('user_orders')
    return true
  } catch {
    return false
  }
}

// Функция для проверки и восстановления куки заказов
export function validateOrdersCookie(): string[] {
  try {
    const orderIds = getOrdersCookie()
    if (!Array.isArray(orderIds)) {
      clearOrdersCookie()
      return []
    }
    // Проверяем, что все элементы - строки
    const validOrderIds = orderIds.filter(id => typeof id === 'string' && id.trim())
    if (validOrderIds.length !== orderIds.length) {
      setOrdersCookie(validOrderIds)
    }
    return validOrderIds
  } catch {
    clearOrdersCookie()
    return []
  }
}
