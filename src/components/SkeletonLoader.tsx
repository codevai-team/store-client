'use client'

interface SkeletonLoaderProps {
  type?: 'product' | 'page' | 'cart' | 'order' | 'category'
  count?: number
  className?: string
}

export default function SkeletonLoader({ type = 'product', count = 1, className = '' }: SkeletonLoaderProps) {
  const renderProductSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden border border-orange-100 shadow-sm">
      <div className="aspect-[3/4] bg-orange-100 animate-pulse"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-orange-100 rounded animate-pulse"></div>
        <div className="h-3 bg-orange-100 rounded w-2/3 animate-pulse"></div>
        <div className="h-4 bg-orange-100 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  )

  const renderPageSkeleton = () => (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
        <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
        <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div className="aspect-square bg-orange-100 rounded-2xl animate-pulse"></div>
          
          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="h-4 bg-orange-100 rounded w-1/3 animate-pulse"></div>
            <div className="h-8 bg-orange-100 rounded animate-pulse"></div>
            <div className="h-6 bg-orange-100 rounded w-1/2 animate-pulse"></div>
            <div className="h-20 bg-orange-100 rounded animate-pulse"></div>
            <div className="h-12 bg-orange-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCartSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="sticky top-0 bg-white z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Cart Items Skeleton */}
        <div className="space-y-4 mb-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex gap-4">
                {/* Product Image Skeleton */}
                <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse flex-shrink-0"></div>

                {/* Product Info Skeleton */}
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
                  
                  {/* Size and Color Options Skeleton */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls Skeleton */}
                <div className="flex flex-col items-end justify-center gap-2">
                  {/* Desktop Delete Button Skeleton */}
                  <div className="hidden md:block w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  
                  {/* Quantity Controls Skeleton */}
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 animate-pulse mx-2"></div>
                    <div className="w-8 h-8 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-16"></div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div className="flex justify-between">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-28 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Button Skeleton */}
        <div className="w-full h-14 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )

  const renderOrderSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="sticky top-0 bg-white z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="w-10 h-10 bg-orange-100 rounded-full animate-pulse"></div>
        <div className="w-32 h-6 bg-orange-100 rounded animate-pulse"></div>
        <div className="w-10 h-10 bg-orange-100 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Order Cards Skeleton */}
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-orange-100 rounded animate-pulse w-32"></div>
                <div className="h-6 bg-orange-100 rounded animate-pulse w-20"></div>
              </div>
              
              <div className="space-y-3">
                <div className="h-4 bg-orange-100 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-orange-100 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-orange-100 rounded animate-pulse w-2/3"></div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-orange-200">
                <div className="h-8 bg-orange-100 rounded animate-pulse w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )

  const renderCategorySkeleton = () => (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
        <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
        <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
      </div>

      {/* Content Skeleton */}
      <div className="px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-orange-100 rounded w-1/3"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-orange-100 rounded-xl aspect-square animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return renderProductSkeleton()
      case 'page':
        return renderPageSkeleton()
      case 'cart':
        return renderCartSkeleton()
      case 'order':
        return renderOrderSkeleton()
      case 'category':
        return renderCategorySkeleton()
      default:
        return renderProductSkeleton()
    }
  }

  if (type === 'product') {
    return (
      <div className={`grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      {renderSkeleton()}
    </div>
  )
}
