import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

interface ProductWhereCondition {
  status: 'ACTIVE' | 'INACTIVE'
  categoryId?: string | { in: string[] }
  price?: {
    gte?: number
    lte?: number
  }
  seller?: {
    fullname: {
      contains: string
      mode: 'insensitive'
    }
  }
  OR?: Array<{
    name?: {
      contains: string
      mode: 'insensitive'
    }
    description?: {
      contains: string
      mode: 'insensitive'
    }
  }>
}

interface ProductWithIncludes {
  id: string
  name: string
  description: string | null
  price: unknown // Decimal type from Prisma
  imageUrl: unknown // JsonValue from Prisma
  categoryId: string
  sellerId: string
  status: string
  createdAt: Date
  updatedAt: Date
  attributes: unknown // JsonValue from Prisma
  category: {
    id: string
    name: string
  }
  seller: {
    fullname: string
  }
  productSizes: Array<{
    size: {
      id: string
      name: string
    }
  }>
  productColors: Array<{
    color: {
      id: string
      name: string
      colorCode: string | null
    }
  }>
  reviews: Array<{
    rating: number
  }>
  _count: {
    reviews: number
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    // Products API вызван
    
    // Получаем параметры фильтрации
    const categoryId = searchParams.get('categoryId')
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true'
    const categories = searchParams.getAll('categories')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'rating'
    const minRating = searchParams.get('minRating')
    const seller = searchParams.get('seller')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')

    // Строим условия фильтрации
    const where: ProductWhereCondition = {
      status: 'ACTIVE' // Показываем только активные товары
    }
    
    if (categoryId) {
      if (includeSubcategories) {
        // Если нужно включить подкатегории, загружаем их
        const categoryWithSubs = await db.category.findUnique({
          where: { id: categoryId },
          include: { subCategories: true }
        })
        
        if (categoryWithSubs) {
          const categoryIds = [categoryId, ...categoryWithSubs.subCategories.map(sub => sub.id)]
          where.categoryId = { in: categoryIds }
        } else {
          where.categoryId = categoryId
        }
      } else {
        where.categoryId = categoryId
      }
    } else if (categories.length > 0) {
      where.categoryId = {
        in: categories
      }
    }
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (seller) {
      where.seller = {
        fullname: {
          contains: seller,
          mode: 'insensitive'
        }
      }
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

            // Настраиваем сортировку
            let orderBy: { createdAt?: 'asc' | 'desc'; price?: 'asc' | 'desc' } = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'price_low':
        orderBy = { price: 'asc' }
        break
      case 'price_high':
        orderBy = { price: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'rating':
        // Для сортировки по рейтингу используем сортировку по дате создания как fallback
        // Реальная сортировка по рейтингу будет выполнена после загрузки данных
        orderBy = { createdAt: 'desc' }
        break
      default:
        // По умолчанию сортируем по рейтингу
        orderBy = { createdAt: 'desc' }
    }

    const products: ProductWithIncludes[] = await db.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        seller: {
          select: {
            fullname: true
          }
        },
        productSizes: {
          include: {
            size: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        productColors: {
          include: {
            color: {
              select: {
                id: true,
                name: true,
                colorCode: true
              }
            }
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy,
      take: limit ? parseInt(limit) : 50 // Используем переданный лимит или 50 по умолчанию
    })

    // Вычисляем средний рейтинг для каждого товара и преобразуем размеры/цвета
    const productsWithRating = products.map((product: ProductWithIncludes) => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / product.reviews.length
        : 0
      
      // Преобразуем productSizes и productColors в нужный формат
      const sizes = product.productSizes.map((ps: { size: { id: string; name: string } }) => ({
        id: ps.size.id,
        name: ps.size.name
      }))
      
      const colors = product.productColors.map((pc: { color: { id: string; name: string; colorCode: string | null } }) => ({
        id: pc.color.id,
        name: pc.color.name,
        colorCode: pc.color.colorCode
      }))
      
      return {
        ...product,
        sizes,
        colors,
        averageRating: avgRating
      }
    })

    // Фильтрация по минимальному рейтингу
    let filteredProducts = productsWithRating
    if (minRating) {
      const minRatingValue = parseFloat(minRating)
      filteredProducts = productsWithRating.filter(product => {
        return product.averageRating >= minRatingValue
      })
    }

    // Сортировка по рейтингу (по умолчанию или если выбрана)
    if (sortBy === 'rating') {
      filteredProducts.sort((a, b) => {
        // Сначала товары с рейтингом, потом без рейтинга
        if (a.averageRating === 0 && b.averageRating === 0) return 0
        if (a.averageRating === 0) return 1
        if (b.averageRating === 0) return -1
        return b.averageRating - a.averageRating
      })
    }

    // Товары найдены
    return NextResponse.json(filteredProducts)
  } catch {
    // Ошибка загрузки товаров
    // Products loading failed
    return NextResponse.json(
      { error: 'Ошибка загрузки товаров' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Проверяем, есть ли тело запроса
    const text = await request.text()
    if (!text || text.trim() === '') {
      // Empty request received
      return NextResponse.json(
        { error: 'Пустое тело запроса' },
        { status: 400 }
      )
    }
    
    let body
    try {
      body = JSON.parse(text)
     } catch {
      // JSON parsing error
      return NextResponse.json(
        { error: 'Некорректный JSON' },
        { status: 400 }
      )
    }
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Необходим массив ID товаров' },
        { status: 400 }
      )
    }

    const products: ProductWithIncludes[] = await db.product.findMany({
      where: {
        id: { in: ids },
        status: 'ACTIVE'
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        seller: {
          select: {
            id: true,
            fullname: true
          }
        },
        productSizes: {
          include: {
            size: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        productColors: {
          include: {
            color: {
              select: {
                id: true,
                name: true,
                colorCode: true
              }
            }
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })

    // Добавляем средний рейтинг и приводим к ожидаемому формату
    const productsWithRating = products.map((product: ProductWithIncludes) => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / product.reviews.length
        : 0
      
      // Преобразуем productSizes и productColors в нужный формат
      const sizes = product.productSizes.map((ps: { size: { id: string; name: string } }) => ({
        id: ps.size.id,
        name: ps.size.name
      }))
      
      const colors = product.productColors.map((pc: { color: { id: string; name: string; colorCode: string | null } }) => ({
        id: pc.color.id,
        name: pc.color.name,
        colorCode: pc.color.colorCode
      }))
      
      return {
        ...product,
        sizes,
        colors,
        averageRating: avgRating
      }
    })

    return NextResponse.json(productsWithRating)
  } catch {
    // Products by ID loading failed
    return NextResponse.json(
      { error: 'Ошибка загрузки товаров' },
      { status: 500 }
    )
  }
}
