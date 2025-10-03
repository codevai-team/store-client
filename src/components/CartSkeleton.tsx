export default function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="sticky top-0 bg-white z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="w-10 h-10 bg-orange-100 rounded-full animate-pulse"></div>
        <div className="w-24 h-6 bg-orange-100 rounded animate-pulse"></div>
        <div className="w-10 h-10 bg-orange-100 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Cart Items Skeleton */}
        <div className="space-y-4 mb-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm">
              <div className="flex gap-4">
                {/* Product Image Skeleton */}
                <div className="w-20 h-20 bg-orange-100 rounded-xl animate-pulse flex-shrink-0"></div>

                {/* Product Info Skeleton */}
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-orange-100 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-4 bg-orange-100 rounded animate-pulse mb-2 w-1/2"></div>
                  
                  {/* Size and Color Options Skeleton */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-6 bg-orange-100 rounded animate-pulse"></div>
                      <div className="w-8 h-4 bg-orange-100 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-6 bg-orange-100 rounded animate-pulse"></div>
                      <div className="w-12 h-4 bg-orange-100 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls Skeleton */}
                <div className="flex flex-col items-end justify-center gap-2">
                  {/* Desktop Delete Button Skeleton */}
                  <div className="hidden md:block w-8 h-8 bg-orange-100 rounded-lg animate-pulse"></div>
                  
                  {/* Quantity Controls Skeleton */}
                  <div className="flex items-center border border-orange-200 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 animate-pulse"></div>
                    <div className="w-8 h-8 bg-orange-100 animate-pulse mx-2"></div>
                    <div className="w-8 h-8 bg-orange-100 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 mb-6">
          <div className="h-6 bg-orange-100 rounded animate-pulse mb-4 w-16"></div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="w-20 h-4 bg-orange-100 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-orange-100 rounded animate-pulse"></div>
            </div>
            
            <div className="flex justify-between">
              <div className="w-24 h-4 bg-orange-100 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-orange-100 rounded animate-pulse"></div>
            </div>
            
            <div className="border-t border-orange-200 pt-3">
              <div className="flex justify-between">
                <div className="w-16 h-5 bg-orange-100 rounded animate-pulse"></div>
                <div className="w-28 h-5 bg-orange-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Button Skeleton */}
        <div className="w-full h-14 bg-orange-100 rounded-xl animate-pulse"></div>
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
