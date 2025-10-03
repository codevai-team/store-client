'use client'

import { useMemo, memo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, Shield, Lock, Eye, User, Database, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Translations } from '@/lib/i18n'

// Статические конфигурации
const PRIVACY_SECTIONS_CONFIG = [
  {
    id: 1,
    titleKey: 'dataCollection',
    icon: Database,
    content: [
      { subtitleKey: 'personalInfo', textKey: 'personalInfoDesc' },
      { subtitleKey: 'technicalInfo', textKey: 'technicalInfoDesc' }
    ]
  },
  {
    id: 2,
    titleKey: 'dataUsage',
    icon: User,
    content: [
      { subtitleKey: 'serviceProvision', textKey: 'serviceProvisionDesc' },
      { subtitleKey: 'notifications', textKey: 'notificationsDesc' }
    ]
  },
  {
    id: 3,
    titleKey: 'dataSharing',
    icon: Eye,
    content: [
      { subtitleKey: 'thirdParties', textKey: 'thirdPartiesDesc' },
      { subtitleKey: 'employees', textKey: 'employeesDesc' }
    ]
  },
  {
    id: 4,
    titleKey: 'security',
    icon: Lock,
    content: [
      { subtitleKey: 'dataProtection', textKey: 'dataProtectionDesc' },
      { subtitleKey: 'encryption', textKey: 'encryptionDesc' }
    ]
  }
]

const USER_RIGHTS_CONFIG = [
  {
    id: 1,
    titleKey: 'accessRight',
    descKey: 'accessRightDesc',
    icon: Eye,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 2,
    titleKey: 'editRight',
    descKey: 'editRightDesc',
    icon: User,
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 3,
    titleKey: 'deleteRight',
    descKey: 'deleteRightDesc',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-800'
  }
]

// Мемоизированные компоненты
const PrivacySection = memo(({ section, t }: { section: typeof PRIVACY_SECTIONS_CONFIG[0], t: Translations }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
        <section.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t[section.titleKey as keyof typeof t]}</h3>
    </div>
    
    <div className="space-y-4 sm:space-y-6">
      {section.content.map((item, index: number) => (
        <div key={index} className="border-l-4 border-orange-200 pl-4 sm:pl-6">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {t[item.subtitleKey as keyof typeof t]}
          </h4>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {t[item.textKey as keyof typeof t]}
          </p>
        </div>
      ))}
    </div>
  </div>
))

PrivacySection.displayName = 'PrivacySection'

const UserRightCard = memo(({ right, t, importantLabel }: { right: typeof USER_RIGHTS_CONFIG[0], t: Translations, importantLabel: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
    <div className="flex items-center space-x-3 mb-3 sm:mb-4">
      <right.icon className="w-6 h-6 text-orange-500" />
      <h4 className="text-base sm:text-lg font-semibold text-gray-900">{t[right.titleKey as keyof typeof t]}</h4>
    </div>
    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
      {t[right.descKey as keyof typeof t]}
    </p>
    <div className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${right.color}`}>
      {importantLabel}
    </div>
  </div>
))

UserRightCard.displayName = 'UserRightCard'

export default function PrivacyPage() {
  const { t, language } = useLanguage()
  const router = useRouter()

  // Мемоизируем статические переводы
  const staticTexts = useMemo(() => ({
    userObligationsTitle: language === 'kg' ? 'Колдонуучунун милдеттенмелери' : 'Обязанности пользователя',
    accurateInfoTitle: language === 'kg' ? 'Туура маалымат берүү' : 'Предоставление точной информации',
    accurateInfoDesc: language === 'kg' 
      ? 'Сиз бардык маалыматтарды туура жана толук берүүгө милдеттүүсүз.'
      : 'Вы обязаны предоставлять всю информацию точно и полностью.',
    properUseTitle: language === 'kg' ? 'Кызматтарды туура колдонуу' : 'Правильное использование услуг',
    properUseDesc: language === 'kg' 
      ? 'Сиз биздин кызматтарды мыйзамга каршы эмес жол менен колдонууга милдеттүүсүз.'
      : 'Вы обязаны использовать наши услуги законным способом.',
    prohibitedActionsTitle: language === 'kg' ? 'Тыйылган иш-аракеттер' : 'Запрещенные действия',
    acceptanceTitle: language === 'kg' ? 'Шарттарды кабыл алуу' : 'Принятие условий',
    acceptanceDesc: language === 'kg' 
      ? 'Биздин кызматтарды колдонуу менен сиз бул шарттарды толук кабыл аласыз. Эгерде сиз бул шарттар менен макул эмес болсоңуз, кызматтарды колдонбоңуз.'
      : 'Используя наши услуги, вы полностью принимаете эти условия. Если вы не согласны с этими условиями, не используйте услуги.',
    termsOfUseTitle: language === 'kg' ? 'Колдонуу шарттары' : 'Условия использования',
    importantLabel: language === 'kg' ? 'Маанилүү' : 'Важно'
  }), [language])

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
          
          <h1 className="text-lg font-medium text-white text-center flex-1 px-2 truncate">{t.privacy}</h1>
          
          <div className="w-10 h-10"></div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t.privacy}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto">
            {t.privacyDescription}
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-16">
          {PRIVACY_SECTIONS_CONFIG.map((section) => (
            <PrivacySection key={section.id} section={section} t={t} />
          ))}
        </div>

        {/* User Rights */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            {t.yourRights}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {USER_RIGHTS_CONFIG.map((right) => (
              <UserRightCard key={right.id} right={right} t={t} importantLabel={staticTexts.importantLabel} />
            ))}
          </div>
        </div>

        {/* Terms of Use Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {staticTexts.termsOfUseTitle}
          </h3>
          
          {/* User Obligations */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {staticTexts.userObligationsTitle}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    {staticTexts.accurateInfoTitle}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {staticTexts.accurateInfoDesc}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    {staticTexts.properUseTitle}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {staticTexts.properUseDesc}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    {t.personalDataProtection}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {t.personalDataDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prohibited Actions */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {staticTexts.prohibitedActionsTitle}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-800 mb-1">{t.falseInformation}</h5>
                  <p className="text-sm text-red-700">{t.accountBlocked}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-800 mb-1">{t.serviceDisruption}</h5>
                  <p className="text-sm text-red-700">{t.accessSuspended}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-800 mb-1">{t.copyrightViolation}</h5>
                  <p className="text-sm text-red-700">{t.legalAction}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Acceptance */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-green-800 mb-2">
              {staticTexts.acceptanceTitle}
            </h4>
            <p className="text-sm text-green-700">
              {staticTexts.acceptanceDesc}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {t.contactInfo}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {t.contactInfoDesc}
          </p>
        </div>

      </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </AppLayout>
  )
}
