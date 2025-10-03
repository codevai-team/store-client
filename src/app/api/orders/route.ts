import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendOrderNotification } from '@/services/telegram/telegramService'

// Получение всех заказов
export async function GET() {
  try {
    const orders = await db.order.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch {
    // Orders loading failed
    return NextResponse.json(
      { error: 'Ошибка загрузки заказов' },
      { status: 500 }
    )
  }
}

// Создание нового заказа или получение заказов по ID
export async function POST(request: NextRequest) {
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
    
    // Если передан массив ids, возвращаем заказы по этим ID
    if (body.ids && Array.isArray(body.ids)) {
      const orders = await db.order.findMany({
        where: {
          id: { in: body.ids }
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Сортируем заказы в том же порядке, что и переданные ID
      const sortedOrders = body.ids.map((id: string) => 
        orders.find(order => order.id === id)
      ).filter(Boolean)

      return NextResponse.json(sortedOrders)
    }
    
    const {
      customerName,
      customerPhone,
      deliveryAddress,
      customerComment,
      cartItems
    } = body

    // Валидация данных для создания заказа
    if (!customerName || !customerPhone || !deliveryAddress) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      )
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Корзина пуста' },
        { status: 400 }
      )
    }

    // Проверяем, что все товары существуют и активны
    const productIds = cartItems.map(item => item.id)
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        status: 'ACTIVE'
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Некоторые товары больше не доступны' },
        { status: 400 }
      )
    }

    // Создаем заказ в транзакции
    const result = await db.$transaction(async (tx) => {
      // Создаем заказ
      const order = await tx.order.create({
        data: {
          customerName,
          customerPhone,
          deliveryAddress,
          customerComment: customerComment || null,
          status: 'CREATED'
        }
      })

      // Создаем позиции заказа
      const orderItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = products.find(p => p.id === item.id)
          if (!product) {
            throw new Error(`Товар с ID ${item.id} не найден`)
          }

          return tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.id,
              amount: item.quantity,
              price: product.price,
              sizeId: item.selectedSizeId || null,
              colorId: item.selectedColorId || null
            }
          })
        })
      )

      return { order, orderItems }
    })

    // Возвращаем созданный заказ с позициями
    const createdOrder = await db.order.findUnique({
      where: { id: result.order.id },
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
            },
            size: {
              select: {
                name: true
              }
            },
            color: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    // Отправляем уведомление в Telegram
    if (createdOrder) {
      try {
        const totalAmount = createdOrder.orderItems.reduce((sum, item) => 
          sum + (Number(item.price) * item.amount), 0
        )

        const orderData = {
          id: createdOrder.id,
          customerName: createdOrder.customerName,
          customerPhone: createdOrder.customerPhone,
          customerAddress: createdOrder.deliveryAddress,
          totalAmount,
          items: createdOrder.orderItems.map(item => ({
            name: item.product.name,
            quantity: item.amount,
            price: Number(item.price),
            size: item.size?.name,
            color: item.color?.name
          })),
          createdAt: createdOrder.createdAt
        }

        await sendOrderNotification(orderData)
       } catch {
        // Telegram notification failed
        // Не прерываем создание заказа из-за ошибки Telegram
      }
    }

    return NextResponse.json({
      success: true,
      order: createdOrder,
      message: 'Заказ успешно создан'
    }, { status: 201 })

  } catch {
    // Order creation failed
    return NextResponse.json(
      { error: 'Ошибка создания заказа' },
      { status: 500 }
    )
  }
}
