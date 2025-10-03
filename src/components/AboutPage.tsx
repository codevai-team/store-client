'use client'

import { useMemo, memo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, Users, Award, Heart, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Translations } from '@/lib/i18n'

// Статические данные для иконок - не зависят от переводов
const STATS_CONFIG = [
  { id: 1, icon: Users, keys: ['customersCount', 'customersCountValue', 'loyalCustomers'] },
  { id: 2, icon: Award, keys: ['experienceYears', 'experienceYearsValue', 'years'] },
  { id: 3, icon: ShoppingBag, keys: ['productsCount', 'productsCountValue', 'variousProducts'] },
  { id: 4, icon: Heart, keys: ['reliability', 'reliabilityValue', 'customerSatisfaction'] }
]

const VALUES_KEYS = ['qualityValue', 'satisfactionValue', 'innovationValue', 'reliabilityValueText']

// Мемоизированный компонент статистики
const StatsCard = memo(({ stat, t }: { stat: typeof STATS_CONFIG[0], t: Translations }) => {
  const IconComponent = stat.icon
  return (
    <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
      </div>
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
        {t[stat.keys[0] as keyof typeof t]}
      </h3>
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">{t[stat.keys[1] as keyof typeof t]}</p>
      <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
        {t[stat.keys[2] as keyof typeof t]}
      </p>
    </div>
  )
})

StatsCard.displayName = 'StatsCard'

export default function AboutPage() {
  const { t } = useLanguage()
  const router = useRouter()

  // Упрощенная мемоизация только для ключей переводов
  const companyValues = useMemo(() => 
    VALUES_KEYS.map((key, index) => ({ id: index + 1, text: t[key as keyof typeof t] })),
    [t]
  )

  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header как на странице Возвратов */}
        <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-medium text-white">{t.aboutUs}</h1>
          
          <div className="w-10 h-10"></div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t.storeName}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t.storeDescription}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {STATS_CONFIG.map((stat) => (
            <StatsCard key={stat.id} stat={stat} t={t} />
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {t.ourStory}
          </h3>
          <div className="prose max-w-none">
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
              {t.storyParagraph1}
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t.storyParagraph2}
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t.ourValues}
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {companyValues.map((value) => (
                <li key={value.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-600">
                    {value.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t.ourMission}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
              {t.missionDescription}
            </p>
            <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
              <p className="text-sm sm:text-base text-orange-800 font-medium">
                {t.missionQuote}
              </p>
            </div>
          </div>
        </div>

      </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </AppLayout>
  )
}
