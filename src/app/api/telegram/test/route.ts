import { NextResponse } from 'next/server'
import { sendTestMessage } from '@/services/telegram/telegramService'

export async function POST() {
  try {
    const success = await sendTestMessage()
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Тестовое сообщение успешно отправлено в Telegram' 
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Не удалось отправить тестовое сообщение. Проверьте настройки Telegram.' 
        },
        { status: 500 }
      )
    }
  } catch {
    // Telegram test failed
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    )
  }
}

