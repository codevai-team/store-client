import type { Metadata } from 'next'
import CartPageClient from './cart-client'

export const metadata: Metadata = {
  title: "Корзина - Unimark",
  description: "Корзина покупок Unimark. Просмотрите выбранные товары, измените количество, оформите заказ. Быстрое и удобное оформление покупок.",
  keywords: ["корзина", "покупки", "заказ", "оформление заказа", "товары"],
  openGraph: {
    title: "Корзина - Unimark",
    description: "Корзина покупок Unimark. Просмотрите выбранные товары, измените количество, оформите заказ.",
    type: "website",
    url: "/cart",
  },
  robots: {
    index: false, // Корзина не должна индексироваться
    follow: false,
  },
}

export default function CartPage() {
  return <CartPageClient />
}