import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductPageClient from './ProductPageClient'
import StructuredData, { productSchema, breadcrumbSchema } from '@/components/StructuredData'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string[] | null
  category: {
    id: string
    name: string
  }
  seller: {
    id: string
    fullname: string
  }
  sizes: Array<{
    id: string
    name: string
  }>
  colors: Array<{
    id: string
    name: string
    colorCode?: string
  }>
  reviews: Array<{
    id: string
    clientName: string
    text: string
    rating: number
  }>
  averageRating: number
  _count: {
    reviews: number
  }
  attributes?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'no-store' // Всегда получаем свежие данные для SEO
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  if (!product) {
    return {
      title: 'Товар не найден | Unimark',
      description: 'Запрашиваемый товар не найден в каталоге Unimark.',
    }
  }

  const productImage = product.imageUrl && Array.isArray(product.imageUrl) && product.imageUrl.length > 0 
    ? product.imageUrl[0] 
    : '/unimark-logo.svg'

  const price = Number(product.price)
  const formattedPrice = `${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} с.`
  
  // Создаем SEO-оптимизированное описание
  const seoDescription = product.description 
    ? `${product.name} - ${product.description.substring(0, 120)}... Цена: ${formattedPrice}. Категория: ${product.category.name}. Быстрая доставка по Кыргызстану.`
    : `${product.name} в категории ${product.category.name}. Цена: ${formattedPrice}. Качественная одежда с быстрой доставкой по Кыргызстану. Рейтинг: ${product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}/5.`

  // Ключевые слова на основе товара
  const keywords = [
    product.name.toLowerCase(),
    product.category.name.toLowerCase(),
    'купить',
    'цена',
    'доставка',
    'кыргызстан',
    'бишкек',
    'интернет-магазин',
    'одежда',
    product.seller.fullname.toLowerCase(),
    ...product.sizes.map(size => size.name.toLowerCase()),
    ...product.colors.map(color => color.name.toLowerCase())
  ].filter(Boolean)

  return {
    title: `${product.name} - ${formattedPrice} | ${product.category.name} | Unimark`,
    description: seoDescription,
    keywords: keywords.join(', '),
    
    openGraph: {
      title: `${product.name} - ${formattedPrice}`,
      description: seoDescription,
      type: 'website',
      url: `/product/${product.id}`,
      images: [
        {
          url: productImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      siteName: 'Unimark',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${formattedPrice}`,
      description: seoDescription,
      images: [productImage],
    },
    
    alternates: {
      canonical: `/product/${product.id}`,
    },
    
    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': 'KGS',
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:brand': 'Unimark',
      'product:category': product.category.name,
    },
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  
  if (!product) {
    notFound()
  }

  // Создаем структурированные данные для товара
  const productStructuredData = productSchema({
    name: product.name,
    description: product.description || `Качественный товар в категории ${product.category.name}`,
    image: product.imageUrl && Array.isArray(product.imageUrl) && product.imageUrl.length > 0 
      ? `https://unimark.kg${product.imageUrl[0]}` 
      : 'https://unimark.kg/unimark-logo.svg',
    price: Number(product.price),
    currency: 'KGS',
    availability: 'InStock',
    brand: 'Unimark',
    category: product.category.name
  })

  // Хлебные крошки для SEO
  const breadcrumbs = breadcrumbSchema([
    { name: 'Главная', url: '/' },
    { name: 'Категории', url: '/categories' },
    { name: product.category.name, url: `/category/${product.category.id}` },
    { name: product.name, url: `/product/${product.id}` }
  ])

  // Дополнительные структурированные данные для отзывов
  const reviewsStructuredData = product.reviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "ratingValue": product.averageRating > 0 ? product.averageRating : 5.0,
    "reviewCount": product._count.reviews,
    "bestRating": 5,
    "worstRating": 1
  } : null

  return (
    <>
      {/* Структурированные данные для поисковых систем */}
      <StructuredData data={productStructuredData} />
      <StructuredData data={breadcrumbs} />
      {reviewsStructuredData && <StructuredData data={reviewsStructuredData} />}
      
      {/* Клиентский компонент для интерактивности */}
      <ProductPageClient product={product} />
    </>
  )
}

// Генерируем статические параметры для популярных товаров (опционально)
export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?limit=50`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return []
    }
    
    const products = await response.json()
    
    return products.map((product: Product) => ({
      id: product.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}