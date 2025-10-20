import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import SkeletonLoader from '@/components/SkeletonLoader'

export const metadata: Metadata = {
  title: "Политика конфиденциальности - Unimark",
  description: "Политика конфиденциальности Unimark. Узнайте, как мы собираем, используем и защищаем ваши персональные данные. Ваши права и обязанности.",
  keywords: ["политика конфиденциальности", "защита данных", "персональные данные", "безопасность", "права пользователей"],
  openGraph: {
    title: "Политика конфиденциальности - Unimark",
    description: "Политика конфиденциальности Unimark. Узнайте, как мы собираем, используем и защищаем ваши персональные данные.",
    type: "website",
    url: "/privacy",
  },
  twitter: {
    card: "summary",
    title: "Политика конфиденциальности - Unimark",
    description: "Политика конфиденциальности Unimark. Узнайте, как мы собираем, используем и защищаем ваши персональные данные.",
  },
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: true,
    follow: false, // Обычно страницы политики не индексируют для follow
  },
}

// Ленивая загрузка компонента
const PrivacyPage = dynamic(() => import('@/components/PrivacyPage'), {
  loading: () => <SkeletonLoader type="page" />,
})

export default function Privacy() {
  return (
    <Suspense fallback={<SkeletonLoader type="page" />}>
      <PrivacyPage />
    </Suspense>
  )
}
