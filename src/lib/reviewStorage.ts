// Интерфейс для ID отзыва пользователя
export interface UserReviewId {
  productId: string
  reviewId: string
}

// Ключ для localStorage
const REVIEWS_STORAGE_KEY = 'user_reviews'

// Компактный формат хранения (как в избранном): productId:reviewId;productId:reviewId;...
// Формат: только ID товара и ID отзыва через двоеточие, записи через точку с запятой

// Получить строку с ID отзывов из localStorage
function getUserReviewIdsString(): string {
  if (typeof window === 'undefined') return ''
  
  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY)
    return stored || ''
  } catch {
    return ''
  }
}

// Сохранить строку с ID отзывов в localStorage
function saveUserReviewIdsString(reviewsString: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, reviewsString)
  } catch {
    // Silently fail
  }
}

// Получить все ID отзывов пользователя
export function getAllUserReviewIds(): UserReviewId[] {
  try {
    const reviewsString = getUserReviewIdsString()
    if (!reviewsString) return []
    
    const reviewEntries = reviewsString.split(';').filter(entry => entry.trim())
    const reviewIds: UserReviewId[] = []
    
    for (const entry of reviewEntries) {
      const parts = entry.split(':')
      if (parts.length === 2) {
        reviewIds.push({
          productId: parts[0],
          reviewId: parts[1]
        })
      }
    }
    
    return reviewIds
  } catch {
    return []
  }
}

// Получить ID отзыва для конкретного товара
export function getUserReviewIdForProduct(productId: string): string | null {
  const reviewIds = getAllUserReviewIds()
  const found = reviewIds.find(review => review.productId === productId)
  return found ? found.reviewId : null
}

// Сохранить ID отзыва пользователя
export function saveUserReviewId(productId: string, reviewId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const reviewIds = getAllUserReviewIds()
    const existingIndex = reviewIds.findIndex(r => r.productId === productId)
    
    if (existingIndex >= 0) {
      // Обновляем существующий ID отзыва
      reviewIds[existingIndex] = { productId, reviewId }
    } else {
      // Добавляем новый ID отзыва
      reviewIds.push({ productId, reviewId })
    }
    
    // Конвертируем в компактный формат
    const reviewsString = reviewIds.map(r => `${r.productId}:${r.reviewId}`).join(';')
    saveUserReviewIdsString(reviewsString)
  } catch {
    // Silently fail
  }
}

// Удалить ID отзыва пользователя
export function removeUserReviewId(productId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const reviewIds = getAllUserReviewIds()
    const filteredReviewIds = reviewIds.filter(review => review.productId !== productId)
    
    // Конвертируем в компактный формат
    const reviewsString = filteredReviewIds.map(r => `${r.productId}:${r.reviewId}`).join(';')
    saveUserReviewIdsString(reviewsString)
  } catch {
    // Silently fail
  }
}

// Проверить, может ли пользователь оставить отзыв (один отзыв на товар)
export function canUserReviewProduct(productId: string): boolean {
  const reviewId = getUserReviewIdForProduct(productId)
  return reviewId === null
}

// Проверить, есть ли у пользователя отзыв для товара
export function hasUserReviewForProduct(productId: string): boolean {
  const reviewId = getUserReviewIdForProduct(productId)
  return reviewId !== null
}

// Тестовая функция для проверки localStorage (для отладки)
export function testLocalStorage(): void {
  if (typeof window === 'undefined') return
  
  try {
    // Test storage functionality - logs removed for production
    getUserReviewIdsString()
    getAllUserReviewIds()
  } catch {
    // Silently fail
  }
}

