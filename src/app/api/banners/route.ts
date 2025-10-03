import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const setting = await db.setting.findUnique({
      where: {
        key: 'add_banners'
      }
    })

    if (!setting) {
      return NextResponse.json({ banners: [] })
    }

    // Парсим JSON из value
    let banners: string[] = []
    try {
      banners = JSON.parse(setting.value)
    } catch {
      // Banner parsing failed
      return NextResponse.json({ banners: [] })
    }

    return NextResponse.json({ banners })
  } catch {
    // Banners loading failed
    return NextResponse.json(
      { error: 'Ошибка загрузки баннеров' },
      { status: 500 }
    )
  }
}

