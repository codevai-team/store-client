import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

interface CategoryWithHierarchy {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  categoryId?: string | null
  createdAt?: Date
  updatedAt?: Date
  subCategories?: CategoryWithHierarchy[]
}

// Рекурсивная функция для построения полной иерархии категорий
async function buildCategoryHierarchy(categories: CategoryWithHierarchy[], level = 0): Promise<CategoryWithHierarchy[]> {
  try {
    const result: CategoryWithHierarchy[] = []
    
    for (const category of categories) {
      // Загружаем подкатегории
      const subCategories = await db.category.findMany({
        where: {
          categoryId: category.id
        },
        orderBy: {
          name: 'asc'
        }
      })
      
      const categoryWithSubs: CategoryWithHierarchy = {
        ...category,
        subCategories: subCategories.length > 0 ? await buildCategoryHierarchy(subCategories, level + 1) : []
      }
      
      result.push(categoryWithSubs)
    }
    
    return result
  } catch {
    // Category hierarchy building failed
    return []
  }
}

export async function GET() {
  try {
    // Получаем все корневые категории (без родителя)
    const rootCategories = await db.category.findMany({
      where: {
        categoryId: null
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Строим полную иерархию рекурсивно
    const fullHierarchy = await buildCategoryHierarchy(rootCategories)

    return NextResponse.json(fullHierarchy)
  } catch {
    // Categories loading failed
    return NextResponse.json(
      { error: 'Ошибка загрузки категорий' },
      { status: 500 }
    )
  }
}
