interface StructuredDataProps {
  data: object
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Предопределенные схемы для разных типов страниц
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Store Client",
  "description": "Интернет-магазин качественной одежды в Кыргызстане",
  "url": "https://storeclient.kg",
  "logo": "https://storeclient.kg/client-store-logo.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+996-555-123-456",
    "contactType": "customer service",
    "email": "support@storeclient.kg",
    "availableLanguage": ["Russian", "Kyrgyz"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KG",
    "addressLocality": "Бишкек"
  },
  "sameAs": [
    "https://www.facebook.com/storeclient",
    "https://www.instagram.com/storeclient"
  ]
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Store Client",
  "url": "https://storeclient.kg",
  "description": "Интернет-магазин качественной одежды в Кыргызстане",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://storeclient.kg/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://storeclient.kg${item.url}`
  }))
})

export const productSchema = (product: {
  name: string
  description: string
  image: string
  price: number
  currency: string
  availability: string
  brand: string
  category: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "brand": {
    "@type": "Brand",
    "name": product.brand
  },
  "category": product.category,
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": product.currency,
    "availability": `https://schema.org/${product.availability}`,
    "seller": {
      "@type": "Organization",
      "name": "Store Client"
    }
  }
})

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
})
