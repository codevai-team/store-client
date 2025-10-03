'use client'

import { memo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, Package, CheckCircle, XCircle, Phone, Mail, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Translations } from '@/lib/i18n'

// Статические конфигурации
const RETURN_STEPS_CONFIG = [
  {
    id: 1,
    titleKey: 'step1Title',
    descKey: 'step1Desc',
    color: 'bg-orange-500',
    icon: '1'
  },
  {
    id: 2,
    titleKey: 'step2Title',
    descKey: 'step2Desc',
    color: 'bg-blue-500',
    icon: '2'
  },
  {
    id: 3,
    titleKey: 'step3Title',
    descKey: 'step3Desc',
    color: 'bg-green-500',
    icon: '3'
  }
]

const RETURN_CONDITIONS_CONFIG = {
  possible: {
    titleKey: 'returnPossible',
    items: [
      {
        icon: Package,
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-100',
        titleKey: 'onDeliveryReturn',
        descKey: 'onDeliveryReturnDesc'
      },
      {
        icon: CheckCircle,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        titleKey: 'checkOnDelivery',
        descKey: 'checkOnDeliveryDesc'
      }
    ]
  },
  impossible: {
    titleKey: 'noOtherReturns',
    descKey: 'noOtherReturnsDesc'
  }
}

const CONTACT_INFO_CONFIG = [
  {
    id: 1,
    icon: Phone,
    title: '+996 555 123 456',
    subtitleKey: 'alwaysAvailable'
  },
  {
    id: 2,
    icon: Mail,
    title: 'support@storeclient.kg',
    subtitleKey: 'responseWithin24h'
  }
]

// Мемоизированные компоненты
const ReturnStep = memo(({ step, t, isLast }: { step: typeof RETURN_STEPS_CONFIG[0], t: Translations, isLast: boolean }) => (
  <>
    <div className="flex gap-4">
      <div className={`flex-shrink-0 w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold`}>
        {step.icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">{t[step.titleKey as keyof typeof t]}</h4>
        <p className="text-gray-600">{t[step.descKey as keyof typeof t]}</p>
      </div>
    </div>
    
    {!isLast && (
      <div className="flex justify-center mt-6">
        <div className="w-6 h-6 border-r-2 border-b-2 border-gray-300 transform rotate-45"></div>
      </div>
    )}
  </>
))

ReturnStep.displayName = 'ReturnStep'

const ContactCard = memo(({ contact, t }: { contact: typeof CONTACT_INFO_CONFIG[0], t: Translations }) => {
  const IconComponent = contact.icon
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="font-semibold">{contact.title}</div>
        <div className="text-orange-100 text-sm">{t[contact.subtitleKey as keyof typeof t]}</div>
      </div>
    </div>
  )
})

ContactCard.displayName = 'ContactCard'

export default function ReturnsPage() {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      <div className="min-h-screen bg-gray-50">
      {/* Header как на странице Избранное */}
      <div className="sticky top-0 bg-orange-500 z-50 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <h1 className="text-lg font-medium text-white">{t.returns}</h1>
        
        <div className="w-10 h-10"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {t.returnPolicy}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.returnPolicyDescription}
          </p>
        </div>

        {/* Return Conditions */}
        <div className="grid gap-6 md:gap-8 mb-8">
          {/* Возврат возможен */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-green-50 border-b border-green-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-green-800">{t[RETURN_CONDITIONS_CONFIG.possible.titleKey as keyof typeof t]}</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {RETURN_CONDITIONS_CONFIG.possible.items.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className="flex gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t[item.titleKey as keyof typeof t]}</h4>
                      <p className="text-gray-600">{t[item.descKey as keyof typeof t]}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Возврат невозможен */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-red-50 border-b border-red-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-red-800">{t[RETURN_CONDITIONS_CONFIG.impossible.titleKey as keyof typeof t]}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600">{t[RETURN_CONDITIONS_CONFIG.impossible.descKey as keyof typeof t]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return Delivery Cost */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800">{t.returnDeliveryCost}</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">{t.returnDeliveryCostDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Return Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            {t.returnSteps}
          </h3>
          
          <div className="space-y-6">
            {RETURN_STEPS_CONFIG.map((step, index) => (
              <div key={step.id}>
                <ReturnStep step={step} t={t} isLast={index === RETURN_STEPS_CONFIG.length - 1} />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">{t.contactSupport}</h3>
            <p className="text-orange-100">{t.contactSupportDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONTACT_INFO_CONFIG.map((contact) => (
              <ContactCard key={contact.id} contact={contact} t={t} />
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">{t.importantNotice}</h4>
              <p className="text-yellow-700">
                {t.returnProcessInfo}
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
