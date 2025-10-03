'use client'

import { useState, useEffect } from 'react'

interface CategoryData {
  total?: number
  byLevel?: {
    root?: number
    level1?: number
    level2?: number
  }
  categories?: Array<{
    id: string
    name: string
    level: number
    parentName?: string
    subCategoriesCount: number
  }>
}

export default function TestCategoriesPage() {
  const [data, setData] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/categories/debug')
        const result = await response.json()
        setData(result)
      } catch {
        // Test error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Отладка категорий</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Статистика:</h2>
        <p>Всего категорий: {data?.total}</p>
        <p>Корневых: {data?.byLevel?.root}</p>
        <p>Уровень 1: {data?.byLevel?.level1}</p>
        <p>Уровень 2: {data?.byLevel?.level2}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Все категории:</h2>
        <div className="space-y-2">
          {data?.categories?.map((cat) => (
            <div key={cat.id} className="p-2 border rounded">
              <div className="flex items-center space-x-4">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  Уровень {cat.level}
                </span>
                <span className="font-semibold">{cat.name}</span>
                <span className="text-gray-500">ID: {cat.id}</span>
                {cat.parentName && (
                  <span className="text-sm text-gray-600">
                    Родитель: {cat.parentName}
                  </span>
                )}
                <span className="text-sm text-blue-600">
                  Подкатегорий: {cat.subCategoriesCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
