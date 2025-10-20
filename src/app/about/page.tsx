import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import SkeletonLoader from '@/components/SkeletonLoader'

export const metadata: Metadata = {
  title: "О нас - История и ценности Unimark",
  description: "Узнайте больше о Unimark - интернет-магазине качественной одежды. Наша история, ценности, миссия и достижения. Более 10 лет опыта в сфере моды.",
  keywords: ["о нас", "история компании", "Unimark", "интернет-магазин одежды", "ценности", "миссия", "качество"],
  openGraph: {
    title: "О нас - История и ценности Unimark",
    description: "Узнайте больше о Unimark - интернет-магазине качественной одежды. Наша история, ценности, миссия и достижения.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "О нас - История и ценности Unimark",
    description: "Узнайте больше о Unimark - интернет-магазине качественной одежды. Наша история, ценности, миссия и достижения.",
  },
  alternates: {
    canonical: '/about',
  },
}

// Ленивая загрузка компонента
const AboutPage = dynamic(() => import('@/components/AboutPage'), {
  loading: () => <SkeletonLoader type="page" />,
})

export default function About() {
  return (
    <Suspense fallback={<SkeletonLoader type="page" />}>
      <AboutPage />
    </Suspense>
  )
}
