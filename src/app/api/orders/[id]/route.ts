import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Получение конкретного заказа по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = await db.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch {
    // Order loading failed
    return NextResponse.json(
      { error: 'Ошибка загрузки заказа' },
      { status: 500 }
    )
  }
}

// Обновление статуса заказа
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { status, customerComment, cancelComment } = body

    // Валидация статуса
    const validStatuses = ['CREATED', 'COURIER_WAIT', 'COURIER_PICKED', 'ENROUTE', 'DELIVERED', 'CANCELED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Недопустимый статус заказа' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли заказ
    const existingOrder = await db.order.findUnique({
      where: { id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      )
    }

    // Обновляем заказ
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(customerComment !== undefined && { customerComment }),
        ...(cancelComment !== undefined && { cancelComment })
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Заказ успешно обновлен'
    })

  } catch {
    // Order update failed
    return NextResponse.json(
      { error: 'Ошибка обновления заказа' },
      { status: 500 }
    )
  }
}
