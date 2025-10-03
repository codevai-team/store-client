import { NextRequest, NextResponse } from 'next/server'
import { sendOrderNotification, sendTestMessage } from '@/services/telegram/telegramService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, orderData } = body

    if (type === 'order') {
      if (!orderData) {
        return NextResponse.json(
          { error: 'Данные заказа не предоставлены' },
          { status: 400 }
        )
      }

      const success = await sendOrderNotification(orderData)
      
      if (success) {
        return NextResponse.json({ success: true, message: 'Уведомление отправлено' })
      } else {
        return NextResponse.json(
          { error: 'Не удалось отправить уведомление' },
          { status: 500 }
        )
      }
    }

    if (type === 'test') {
      const success = await sendTestMessage()
      
      if (success) {
        return NextResponse.json({ success: true, message: 'Тестовое сообщение отправлено' })
      } else {
        return NextResponse.json(
          { error: 'Не удалось отправить тестовое сообщение' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Неверный тип уведомления' },
      { status: 400 }
    )

  } catch {
    // Telegram API error
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

