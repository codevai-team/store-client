'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { setCookie, getCookie } from '@/lib/cookies'

export interface CartItem {
  id: string
  name: string
  price: number
  imageUrl?: string[] | null
  quantity: number
  selectedSize?: string
  selectedColor?: string
  selectedSizeId?: string
  selectedColorId?: string
  category: {
    id: string
    name: string
  }
  seller: {
    fullname: string
  }
}

// Типы для продукта из API
interface ProductSize {
  id: string
  name: string
}

interface ProductColor {
  id: string
  name: string
}

interface ProductFromAPI {
  id: string
  name: string
  price: number
  imageUrl?: string[] | null
  sizes?: ProductSize[]
  colors?: ProductColor[]
  category: {
    id: string
    name: string
  }
  seller: {
    fullname: string
  }
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<boolean>
  removeFromCart: (productId: string, selectedSizeId?: string, selectedColorId?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedSizeId?: string, selectedColorId?: string) => void
  updateItemOptions: (productId: string, currentSizeId?: string, currentColorId?: string, newSizeId?: string, newColorId?: string, newSize?: string, newColor?: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  isInCart: (productId: string) => boolean
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Функции для работы с куками корзины в компактном формате
// Формат: {id}:{size_id}:{color_id}:{quantity};{id}:{size_id}:{color_id}:{quantity}
export function setCartCookie(cartItems: CartItem[]) {
  const cartString = cartItems.map(item => 
    `${item.id}:${item.selectedSizeId || ''}:${item.selectedColorId || ''}:${item.quantity}`
  ).join(';')
  setCookie('cart', cartString)
}

export function getCartCookie(): string {
  try {
    const cartString = getCookie('cart')
    return cartString || ''
  } catch {
    // Игнорируем ошибки парсинга
  }
  return ''
}

// Функция для парсинга компактного формата корзины
export function parseCartCookie(cartString: string): Array<{id: string, sizeId: string, colorId: string, quantity: number}> {
  if (!cartString) return []
  
  try {
    return cartString.split(';').filter(item => item.trim()).map(item => {
      const [id, sizeId, colorId, quantity] = item.split(':')
      return {
        id: id || '',
        sizeId: sizeId || '',
        colorId: colorId || '',
        quantity: parseInt(quantity) || 1
      }
    }).filter(item => item.id) // Фильтруем пустые ID
  } catch {
    // Cart parsing error
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Функция для загрузки полных данных товаров из БД по ID
  const loadCartItemsFromDatabase = async (cartData: Array<{id: string, sizeId: string, colorId: string, quantity: number}>) => {
    if (cartData.length === 0) {
      setCartItems([])
      setIsLoading(false)
      return
    }

    try {
      const productIds = [...new Set(cartData.map(item => item.id))]
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: productIds }),
      })

      if (response.ok) {
        const products: ProductFromAPI[] = await response.json()
        
        const fullCartItems: CartItem[] = cartData.map(cartItem => {
          const product = products.find((p: ProductFromAPI) => p.id === cartItem.id)
          if (!product) return null

          // Находим размер и цвет по ID
          const size = product.sizes?.find((s: ProductSize) => s.id === cartItem.sizeId)
          const color = product.colors?.find((c: ProductColor) => c.id === cartItem.colorId)

          return {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: cartItem.quantity,
            selectedSize: size?.name || '',
            selectedColor: color?.name || '',
            selectedSizeId: cartItem.sizeId,
            selectedColorId: cartItem.colorId,
            category: product.category,
            seller: product.seller
          }
        }).filter(Boolean) as CartItem[]

        setCartItems(fullCartItems)
      } else {
        // Products loading failed
        setCartItems([])
      }
    } catch {
      // Cart products loading failed
      setCartItems([])
    } finally {
      setIsLoading(false)
    }
  }

  // Загружаем корзину из куков при инициализации
  useEffect(() => {
    const cartString = getCartCookie()
    const cartData = parseCartCookie(cartString)
    loadCartItemsFromDatabase(cartData)
  }, [])

  // Сохраняем корзину в куки при изменении
  useEffect(() => {
    if (!isLoading) {
      setCartCookie(cartItems)
    }
  }, [cartItems, isLoading])

  const addToCart = async (product: Omit<CartItem, 'quantity'>, quantity: number = 1): Promise<boolean> => {
    // Валидируем структуру товара перед добавлением
    if (!product || !product.id || !product.category?.id || !product.category?.name) {
      return false
    }

    setCartItems(prev => {
      // Проверяем, есть ли уже такой товар в корзине
      const existingItemIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedSizeId === product.selectedSizeId && 
        item.selectedColorId === product.selectedColorId
      )

      if (existingItemIndex >= 0) {
        // Если товар уже есть, увеличиваем количество
        const newItems = [...prev]
        newItems[existingItemIndex].quantity += quantity
        return newItems
      } else {
        // Если товара нет, добавляем новый
        return [...prev, { ...product, quantity }]
      }
    })
    
    return true
  }

  const removeFromCart = (productId: string, selectedSizeId?: string, selectedColorId?: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === productId && 
        item.selectedSizeId === selectedSizeId && 
        item.selectedColorId === selectedColorId)
    ))
  }

  const updateQuantity = (productId: string, quantity: number, selectedSizeId?: string, selectedColorId?: string) => {
    if (quantity <= 0) {
      // Если нужно удалить товар, ищем по ID, размеру и цвету
      setCartItems(prev => prev.filter(item => 
        !(item.id === productId && 
          item.selectedSizeId === selectedSizeId && 
          item.selectedColorId === selectedColorId)
      ))
      return
    }

    setCartItems(prev => 
      prev.map(item => {
        // Обновляем только если совпадают ID, размер и цвет
        if (item.id === productId && 
            item.selectedSizeId === selectedSizeId && 
            item.selectedColorId === selectedColorId) {
          return { ...item, quantity }
        }
        return item
      })
    )
  }

  const updateItemOptions = (productId: string, currentSizeId?: string, currentColorId?: string, newSizeId?: string, newColorId?: string, newSize?: string, newColor?: string) => {
    setCartItems(prev => {
      // Находим текущий товар
      const currentItemIndex = prev.findIndex(item => 
        item.id === productId && 
        (item.selectedSizeId || '') === (currentSizeId || '') && 
        (item.selectedColorId || '') === (currentColorId || '')
      )
      
      if (currentItemIndex === -1) {
        return prev // Товар не найден
      }
      
      const currentItem = prev[currentItemIndex]
      const finalSizeId = newSizeId || currentItem.selectedSizeId
      const finalColorId = newColorId || currentItem.selectedColorId
      const finalSize = newSize || currentItem.selectedSize
      const finalColor = newColor || currentItem.selectedColor
      
      // Проверяем, есть ли уже товар с новыми опциями
      const existingItemIndex = prev.findIndex(item => 
        item.id === productId && 
        (item.selectedSizeId || '') === (finalSizeId || '') && 
        (item.selectedColorId || '') === (finalColorId || '')
      )
      
      if (existingItemIndex !== -1 && existingItemIndex !== currentItemIndex) {
        // Если товар с новыми опциями уже существует, объединяем количества
        const newItems = [...prev]
        newItems[existingItemIndex].quantity += currentItem.quantity
        newItems.splice(currentItemIndex, 1) // Удаляем текущий товар
        return newItems
      } else {
        // Если товара с новыми опциями нет, просто обновляем опции
        return prev.map((item, index) => {
          if (index === currentItemIndex) {
            return { 
              ...item, 
              selectedSize: finalSize,
              selectedColor: finalColor,
              selectedSizeId: finalSizeId,
              selectedColorId: finalColorId
            }
          }
          return item
        })
      }
    })
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateItemOptions,
      clearCart,
      getTotalPrice,
      getTotalItems,
      isInCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
