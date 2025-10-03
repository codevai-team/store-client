import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

interface CategoryWithSubs {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  categoryId?: string | null
  createdAt?: Date
  updatedAt?: Date
  subCategories: CategoryWithSubs[]
}

// Рекурсивная функция для построения иерархии подкатегорий
async function buildSubcategories(categoryId: string): Promise<CategoryWithSubs[]> {
  try {
    const subcategories = await db.category.findMany({
      where: {
        categoryId: categoryId
      },
      orderBy: {
        name: 'asc'
      }
    })

    const result: CategoryWithSubs[] = []
    
    for (const subcategory of subcategories) {
      const subSubcategories = await buildSubcategories(subcategory.id)
      
      const categoryWithSubs: CategoryWithSubs = {
        ...subcategory,
        subCategories: subSubcategories
      }
      
      result.push(categoryWithSubs)
    }
    
    return result
  } catch {
    // Subcategories building failed
    return []
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await db.category.findUnique({
      where: {
        id: id
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      )
    }

    // Загружаем подкатегории
    const subCategories = await buildSubcategories(id)

    const categoryWithSubs = {
      ...category,
      subCategories
    }

    return NextResponse.json(categoryWithSubs)
  } catch {
    // Category loading failed
    return NextResponse.json(
      { error: 'Ошибка загрузки категории' },
      { status: 500 }
    )
  }
}
