import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Получаем все категории с их связями
    const allCategories = await db.category.findMany({
      include: {
        parentCategory: true,
        subCategories: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Группируем по уровням
    const rootCategories = allCategories.filter(cat => !cat.categoryId)
    const level1Categories = allCategories.filter(cat => cat.categoryId && !cat.parentCategory?.categoryId)
    const level2Categories = allCategories.filter(cat => cat.categoryId && cat.parentCategory?.categoryId)

    return NextResponse.json({
      total: allCategories.length,
      byLevel: {
        root: rootCategories.length,
        level1: level1Categories.length,
        level2: level2Categories.length
      },
      categories: allCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        parentId: cat.categoryId,
        parentName: cat.parentCategory?.name || null,
        subCategoriesCount: cat.subCategories.length,
        level: !cat.categoryId ? 0 : (!cat.parentCategory?.categoryId ? 1 : 2)
      }))
    })
  } catch {
    // Categories debug failed
    return NextResponse.json(
      { error: 'Ошибка отладки категорий' },
      { status: 500 }
    )
  }
}
