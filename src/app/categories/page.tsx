import type { Metadata } from 'next'
import CategoriesPage from '@/components/CategoriesPage'
import AppLayout from '@/components/AppLayout'

export const metadata: Metadata = {
  title: "Категории товаров - Store Client",
  description: "Все категории одежды в Store Client: футболки, брюки, платья, куртки и многое другое. Удобная навигация по каталогу товаров.",
  keywords: ["категории", "каталог", "футболки", "брюки", "платья", "куртки", "одежда", "мужская одежда", "женская одежда"],
  openGraph: {
    title: "Категории товаров - Store Client",
    description: "Все категории одежды в Store Client: футболки, брюки, платья, куртки и многое другое.",
    type: "website",
    url: "/categories",
  },
  alternates: {
    canonical: '/categories',
  },
}

export default function Categories() {
  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      <CategoriesPage />
    </AppLayout>
  )
}
