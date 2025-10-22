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
  "name": "Unimark",
  "description": "Интернет-магазин качественной одежды в Кыргызстане",
  "url": "https://unimark.kg",
  "logo": "https://unimark.kg/unimark-logo.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+996-555-123-456",
    "contactType": "customer service",
    "email": "support@unimark.kg",
    "availableLanguage": ["Russian", "Kyrgyz"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KG",
    "addressLocality": "Бишкек"
  },
  "sameAs": [
    "https://www.facebook.com/unimark",
    "https://www.instagram.com/unimark"
  ]
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Unimark",
  "url": "https://unimark.kg",
  "description": "Интернет-магазин качественной одежды в Кыргызстане",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://unimark.kg/?search={search_term_string}"
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
    "item": `https://unimark.kg${item.url}`
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
    "url": `https://unimark.kg/product/${product.name}`,
    "seller": {
      "@type": "Organization",
      "name": "Unimark",
      "url": "https://unimark.kg"
    }
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Unimark"
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
