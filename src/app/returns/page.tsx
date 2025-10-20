import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import SkeletonLoader from '@/components/SkeletonLoader'

export const metadata: Metadata = {
  title: "Возвраты и обмен товаров - Unimark",
  description: "Политика возврата и обмена товаров в Unimark. Условия возврата, пошаговая инструкция, контактная информация. Возврат при доставке и проверка товара.",
  keywords: ["возврат товара", "обмен", "политика возврата", "возврат при доставке", "проверка товара", "гарантия"],
  openGraph: {
    title: "Возвраты и обмен товаров - Unimark",
    description: "Политика возврата и обмена товаров в Unimark. Условия возврата, пошаговая инструкция, контактная информация.",
    type: "website",
    url: "/returns",
  },
  twitter: {
    card: "summary",
    title: "Возвраты и обмен товаров - Unimark",
    description: "Политика возврата и обмена товаров в Unimark. Условия возврата, пошаговая инструкция, контактная информация.",
  },
  alternates: {
    canonical: '/returns',
  },
}

// Ленивая загрузка компонента
const ReturnsPage = dynamic(() => import('@/components/ReturnsPage'), {
  loading: () => <SkeletonLoader type="page" />,
})

export default function Returns() {
  return (
    <Suspense fallback={<SkeletonLoader type="page" />}>
      <ReturnsPage />
    </Suspense>
  )
}
