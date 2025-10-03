import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.product.findFirst({
      where: {
        id: id,
        status: 'ACTIVE' // Показываем только активные товары
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
            color: true
          }
        },
        reviews: {
          select: {
            id: true,
            clientName: true,
            text: true,
            rating: true
          },
          orderBy: {
            id: 'desc'
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Вычисляем средний рейтинг
    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    // Форматируем данные для клиента
    const { productSizes, productColors, ...productWithoutIntermediate } = product
    const formattedProduct = {
      ...productWithoutIntermediate,
      averageRating,
      sizes: productSizes.map(ps => ps.size),
      colors: productColors.map(pc => pc.color)
    }

    return NextResponse.json(formattedProduct)
  } catch {
    // Product loading failed
    return NextResponse.json(
      { error: 'Ошибка загрузки товара' },
      { status: 500 }
    )
  }
}



