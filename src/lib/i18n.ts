export type Language = 'kg' | 'ru'

export interface Translations {
  // Navigation
  home: string
  cart: string
  favorites: string
  orders: string
  
  // Search and filters
  search: string
  searchProducts: string
  filters: string
  seeAll: string
  categories: string
  
  // Product related
  featuredProducts: string
  newCollection: string
  shopNow: string
  summerSale: string
  upTo70Off: string
  explore: string
  newArrivals: string
  freshStyles: string
  discover: string
  
  // Filter modal
  priceRange: string
  min: string
  max: string
  minimumRating: string
  any: string
  sortBy: string
  newestFirst: string
  oldestFirst: string
  priceLowToHigh: string
  priceHighToLow: string
  highestRated: string
  reset: string
  applyFilters: string
  
  // Product categories
  tshirt: string
  pant: string
  dress: string
  jacket: string
  
  // Product titles
  categoryProducts: string
  filteredProducts: string
  allProducts: string
  
  // Product page
  productDetails: string
  selectSize: string
  selectColor: string
  quantity: string
  totalPrice: string
  addToCart: string
  readMore: string
  goBack: string
  noImage: string
  specifications: string
  noColorsAvailable: string
  
  // Favorites page
  myWishlist: string
  noFavoritesTitle: string
  noFavoritesSubtitle: string
  startShopping: string
  all: string
  removeFromFavorites: string
  
  // Modal confirmations
  confirm: string
  confirmRemoveTitle: string
  confirmRemoveMessage: string
  remove: string
  
  // Cart page
  myCart: string
  emptyCartTitle: string
  emptyCartSubtitle: string
  subtotal: string
  deliveryFee: string
  totalCost: string
  proceedToCheckout: string
  removeFromCart: string
  confirmRemoveFromCartTitle: string
  confirmRemoveFromCartMessage: string
  yesRemove: string
  color: string
  price: string
  
  // Orders page
  myOrders: string
  active: string
  completed: string
  cancelled: string
  trackOrder: string
  noOrdersTitle: string
  noOrdersSubtitle: string
  orderStatus: string
  orderDate: string
  orderNumber: string
  customerPhone: string
  customerComment: string
  courierInfo: string
  orderCreated: string
  orderInProgress: string
  orderDelivered: string
  orderCancelled: string
  orderCourierWait: string
  orderCourierPicked: string
  orderEnroute: string
  
  // Track Order page
  orderDetails: string
  expectedDeliveryDate: string
  trackingId: string
  orderPlaced: string
  inProgress: string
  shipped: string
  delivered: string
  orderPlacedDate: string
  inProgressDate: string
  shippedDate: string
  deliveredDate: string
  expectedDate: string
  
  // Additional translations for ProductGrid
  inCart: string
  
  // Reviews page
  reviewsTitle: string
  reviewSubmitted: string
  
  // Checkout modal
  orderCheckout: string
  orderTotal: string
  enterName: string
  enterPhone: string
  enterAddress: string
  optionalComment: string
  phoneValidation: string
  placeOrder: string
  
  // Common actions
  submit: string
  edit: string
  close: string
  
  // Additional missing translations
  back: string
  loading: string
  error: string
  success: string
  warning: string
  info: string
  
  // Notification messages
  errorInsufficientData: string
  addedToFavorites: string
  errorAddingToFavorites: string
  addedToCart: string
  
  // Product grid labels
  sizeLabel: string
  addToCartButton: string
  
  // Review page messages
  errorLoadingReviews: string
  reviewSubmitError: string
  reviewSubmitErrorGeneral: string
  
  // Loading states
  loadingText: string
  loadingProducts: string
  loadingCategories: string
  loadingData: string
  
  // Status labels
  available: string
  unavailable: string
  inStock: string
  outOfStock: string
  
  // Common words
  hot: string
  new: string
  sale: string
  
  
  // Product labels
  men: string
  women: string
  children: string
  sport: string
  shoes: string
  accessories: string
  
  // Time units
  days: string
  hours: string
  
  // Product names examples
  classicTshirt: string
  elegantDress: string
  sportJacket: string
  classicPants: string
  summerDress: string
  childrenClothing: string
  sneakers: string
  bag: string
  
  // Action buttons
  view: string
  buy: string
  watch: string
  economy: string
  colors: string
  sizes: string
  
  // New arrivals page
  newCollectionHero: string
  latestTrends: string
  newItemsCount: string
  
  // Returns page
  wrongSize: string
  wrongColor: string
  poorQuality: string
  notAsExpected: string
  returnRight: string
  otherReason: string
  importantNotice: string
  returnProcessInfo: string
  returnDeliveryCost: string
  returnDeliveryCostDesc: string
  
  // Returns page - new policy
  returns: string
  returnPolicy: string
  returnPolicyDescription: string
  returnPossible: string
  returnConditionsTitle: string
  onDeliveryReturn: string
  onDeliveryReturnDesc: string
  checkOnDelivery: string
  checkOnDeliveryDesc: string
  noOtherReturns: string
  noOtherReturnsDesc: string
  returnSteps: string
  step1Title: string
  step1Desc: string
  step2Title: string
  step2Desc: string
  step3Title: string
  step3Desc: string
  contactSupport: string
  contactSupportDesc: string
  alwaysAvailable: string
  responseWithin24h: string
  
  // Page titles
  aboutUs: string
  privacy: string
  
  // About page
  storeName: string
  storeDescription: string
  customersCount: string
  customersCountValue: string
  loyalCustomers: string
  experienceYears: string
  experienceYearsValue: string
  years: string
  productsCount: string
  productsCountValue: string
  variousProducts: string
  reliability: string
  reliabilityValue: string
  customerSatisfaction: string
  ourStory: string
  storyParagraph1: string
  storyParagraph2: string
  ourValues: string
  qualityValue: string
  satisfactionValue: string
  innovationValue: string
  reliabilityValueText: string
  ourMission: string
  missionDescription: string
  missionQuote: string
  contactUs: string
  questionsHelp: string
  contactButton: string
  
  // Privacy page
  privacyDescription: string
  dataCollection: string
  personalInfo: string
  personalInfoDesc: string
  technicalInfo: string
  technicalInfoDesc: string
  dataUsage: string
  serviceProvision: string
  serviceProvisionDesc: string
  notifications: string
  notificationsDesc: string
  dataSharing: string
  thirdParties: string
  thirdPartiesDesc: string
  employees: string
  employeesDesc: string
  security: string
  dataProtection: string
  dataProtectionDesc: string
  encryption: string
  encryptionDesc: string
  yourRights: string
  accessRight: string
  accessRightDesc: string
  editRight: string
  editRightDesc: string
  deleteRight: string
  deleteRightDesc: string
  contactInfo: string
  contactInfoDesc: string
  policyUpdates: string
  policyUpdatesDesc: string
  
  // Footer
  footerDescription: string
  quickLinks: string
  customerService: string
  contacts: string
  allRightsReserved: string
  termsOfUse: string
  address: string
  
  // Review Modal
  editReview: string
  leaveReview: string
  yourRating: string
  yourName: string
  yourReview: string
  enterYourName: string
  writeReview: string
  shareImpressions: string
  minimumCharacters: string
  notSelected: string
  cancel: string
  save: string
  send: string
  saving: string
  sending: string
  reviewHelp: string
  enterNameError: string
  writeReviewError: string
  minimumLengthError: string
  setRatingError: string
  
  // Product page additional translations
  reviews: string
  noReviewsYet: string
  beFirstToReview: string
  showAllReviews: string
  productNotFound: string
  errorLoadingProduct: string
  alreadyReviewed: string
  reviewUpdated: string
  reviewAdded: string
  errorUpdatingReview: string
  errorAddingReview: string
  errorOccurred: string
  tryAgain: string
  highQualityProduct: string
  outOf5: string
  
  // Terms page
  personalDataProtection: string
  personalDataDescription: string
  falseInformation: string
  accountBlocked: string
  serviceDisruption: string
  accessSuspended: string
  copyrightViolation: string
  legalAction: string
  spamDistribution: string
  fineApplied: string
  
  // Orders page
  loadingOrders: string
  errorLoading: string
  orderFrom: string
  status: string
  details: string
  
  // Order statuses
  created: string
  courierWait: string
  courierPicked: string
  enroute: string
  canceled: string
  
  // Product page
  addToFavorites: string
  description: string
  relatedProducts: string
  averageRating: string
  failedToLoad: string
  
  // Boolean values
  yes: string
  no: string
  
  // Track order page
  order: string
  orderNotFound: string
  orderNotFoundDesc: string
  loadingOrder: string
  itemsInOrder: string
  customerInfo: string
  customerName: string
  phone: string
  deliveryAddress: string
  createdDate: string
  total: string
  deliveryStatus: string
  pieces: string
  currentStatus: string
  orderComment: string
  
  // Order tracking statuses
  waitingCourier: string
  courierTook: string
  inTransit: string
  deliveredStatus: string
  
  // Category page
  category: string
  subcategory: string
  categoryNotFound: string
  categoryNotFoundDesc: string
  subcategories: string
  backToCategory: string
  productsInCategory: string
  productsInSubcategory: string
  productsNotFound: string
  noProductsInCategory: string
  noProductsInSubcategory: string
  categoryProductsCount: string
}

export const translations: Record<Language, Translations> = {
  kg: {
    // Navigation
    home: 'Башкы бет',
    cart: 'Себет',
    favorites: 'Тандалмалар',
    orders: 'Заказдар',
    
    // Search and filters
    search: 'Издөө',
    searchProducts: 'Товарларды издөө...',
    filters: 'Чыпкалар',
    seeAll: 'Бардыгын көрүү',
    categories: 'Категориялар',
    
    // Product related
    featuredProducts: 'Сунушталган товарлар',
    newCollection: 'Жаңы коллекция',
    shopNow: 'Азыр сатып алуу',
    summerSale: 'Жайкы арзандатуу',
    upTo70Off: 'Тандалган товарларга\n70% чейин арзандатуу',
    explore: 'Изилдөө',
    newArrivals: 'Жаңы келгендер',
    freshStyles: 'Жаңы стилдер\nкелди',
    discover: 'Ачуу',
    
    // Filter modal
    priceRange: 'Баа диапазону',
    min: 'Мин',
    max: 'Макс',
    minimumRating: 'Минималдуу рейтинг',
    any: 'Каалаган',
    sortBy: 'Иреттөө',
    newestFirst: 'Алгач жаңылар',
    oldestFirst: 'Алгач эскилер',
    priceLowToHigh: 'Баа: арзандан кымбатка',
    priceHighToLow: 'Баа: кымбаттан арзанга',
    highestRated: 'Эң жогорку рейтинг',
    reset: 'Тазалоо',
    applyFilters: 'Чыпкаларды колдонуу',
    
    // Product categories
    tshirt: 'Футболка',
    pant: 'Шым',
    dress: 'Көйнөк',
    jacket: 'Куртка',
    
    // Product titles
    categoryProducts: 'товарлары',
    filteredProducts: 'Чыпкаланган товарлар',
    allProducts: 'Бардык товарлар',
    
    // Product page
    productDetails: 'Товардын тарыхы',
    selectSize: 'Өлчөмдү тандаңыз',
    selectColor: 'Түстү тандаңыз',
    quantity: 'Саны',
    totalPrice: 'Жалпы баасы',
    addToCart: 'Себетке кошуу',
    readMore: 'Толугу менен окуу',
    goBack: 'Артка кайтуу',
    noImage: 'Сүрөт жок',
    specifications: 'Атрибуттар',
    noColorsAvailable: 'Түстөр жеткиликсиз',
    
    // Favorites page
    myWishlist: 'Менин тилек тизмем',
    noFavoritesTitle: 'Сиздин тилек тизмеңиз бош',
    noFavoritesSubtitle: 'Жакшы көргөн товарларыңызды сактоо үчүн жүрөк белгисин басыңыз',
    startShopping: 'Соода кылууну баштоо',
    all: 'Баары',
    removeFromFavorites: 'Тандалмалардан чыгаруу',
    
    // Modal confirmations
    confirm: 'Ырастоо',
    confirmRemoveTitle: 'Тандалмалардан чыгаруу',
    confirmRemoveMessage: 'Бул товарды тандалмалардан чыгарууну каалайсызбы?',
    remove: 'Чыгаруу',
    
    // Cart page
    myCart: 'Менин себетим',
    emptyCartTitle: 'Сиздин себетиңиз бош',
    emptyCartSubtitle: 'Жакшы көргөн товарларыңызды кошуп баштаңыз',
    subtotal: 'Жыйынтык',
    deliveryFee: 'Жеткирүү акысы',
    totalCost: 'Жалпы наркы',
    proceedToCheckout: 'Төлөмгө өтүү',
    removeFromCart: 'Себеттен чыгаруу',
    confirmRemoveFromCartTitle: 'Себеттен чыгаруу',
    confirmRemoveFromCartMessage: 'Бул товарды себеттен чыгарууну каалайсызбы?',
    yesRemove: 'Ооба, чыгаруу',
    color: 'Түсү',
    price: 'Баасы',
    
    // Orders page
    myOrders: 'Менин заказдарым',
    active: 'Активдүү',
    completed: 'Аякталган',
    cancelled: 'Жокко чыгарылган',
    trackOrder: 'Заказды көзөмөлдөө',
    noOrdersTitle: 'Сиздин заказдарыңыз жок',
    noOrdersSubtitle: 'Биринчи заказды берүү үчүн товарларды сатып алыңыз',
    orderStatus: 'Заказдын статусу',
    orderDate: 'Заказдын датасы',
    orderNumber: 'Заказдын номуру',
    courierInfo: 'Курьер тууралуу маалымат',
    orderCreated: 'Түзүлгөн',
    orderInProgress: 'Ишке ашырылууда',
    orderDelivered: 'Жеткирилген',
    orderCancelled: 'Жокко чыгарылган',
    orderCourierWait: 'Курьер күтүүдө',
    orderCourierPicked: 'Курьер алып кеткен',
    orderEnroute: 'Жолдо',
    
    // Track Order page
    orderDetails: 'Заказдын маалыматтары',
    expectedDeliveryDate: 'Күтүлгөн жеткирүү күнү',
    trackingId: 'Көзөмөлдөө ID',
    orderPlaced: 'Заказ берилген',
    inProgress: 'Ишке ашырылууда',
    shipped: 'Жөнөтүлгөн',
    delivered: 'Жеткирилген',
    orderPlacedDate: '23 Авг 2023, 04:25 PM',
    inProgressDate: '23 Авг 2023, 03:54 PM',
    shippedDate: 'Күтүлгөн 02 Сен 2023',
    deliveredDate: '23 Авг 2023, 2023',
    expectedDate: '03 Сен 2023',
    
    // Additional translations for ProductGrid
    inCart: 'Корзинада',
    
    // Reviews page
    reviewsTitle: 'Пикирлер',
    reviewSubmitted: 'Пикир жөнөтүлдү',
    
    // Checkout modal
    orderCheckout: 'Заказ берүү',
    orderTotal: 'Жалпы сумма',
    customerName: 'Атыңыз',
    customerPhone: 'Телефон номуру',
    deliveryAddress: 'Жеткирүү дареги',
    customerComment: 'Комментарий',
    enterName: 'Атыңызды киргизиңиз',
    enterPhone: 'Телефон номурун киргизиңиз',
    enterAddress: 'Даректи киргизиңиз',
    optionalComment: 'Комментарий (милдеттүү эмес)',
    phoneValidation: 'Туура телефон номурун киргизиңиз (+996 XXX XXX XXX)',
    placeOrder: 'Заказ берүү',
    
    // Common actions
    submit: 'Жөнөтүү',
    edit: 'Түзөтүү',
    close: 'Жабуу',
    
    // Additional missing translations
    back: 'Артка',
    loading: 'Жүктөлүүдө...',
    error: 'Ката',
    success: 'Ийгиликтүү',
    warning: 'Эскертүү',
    info: 'Маалымат',
    
    // Notification messages
    errorInsufficientData: 'Ката: товар жөнүндө жетишсиз маалымат',
    addedToFavorites: 'Тандалмаларга кошулду',
    errorAddingToFavorites: 'Тандалмаларга кошуудагы ката',
    addedToCart: 'Себетке кошулду',
    
    // Product grid labels
    sizeLabel: 'Өлчөмү:',
    addToCartButton: 'Себетке',
    
    // Review page messages
    errorLoadingReviews: 'Пикирлерди жүктөөдөгү ката',
    reviewSubmitError: 'Пикирди кошуудагы ката',
    reviewSubmitErrorGeneral: 'Ката кетти. Кайра аракет кылыңыз.',
    
    // Loading states
    loadingText: 'Жүктөлүүдө...',
    loadingProducts: 'Товарлар жүктөлүүдө...',
    loadingCategories: 'Категориялар жүктөлүүдө...',
    loadingData: 'Маалыматтар жүктөлүүдө...',
    
    // Status labels
    available: 'Жеткиликтүү',
    unavailable: 'Жеткиликсиз',
    inStock: 'Бар',
    outOfStock: 'Жок',
    
    // Common words
    hot: 'Ысык',
    new: 'Жаңы',
    sale: 'Арзандатуу',
    
    
    // Product labels
    men: 'Эркектер',
    women: 'Аялдар',
    children: 'Балдар',
    sport: 'Спорт',
    shoes: 'Аяк кийимдери',
    accessories: 'Аксессуарлар',
    
    // Time units
    days: 'күн',
    hours: 'саат',
    
    // Product names examples
    classicTshirt: 'Классикалык футболка',
    elegantDress: 'Элеганттуу көйнөк',
    sportJacket: 'Спорттуу куртка',
    classicPants: 'Классикалык шым',
    summerDress: 'Жайкы көйнөк',
    childrenClothing: 'Балалардын кийими',
    sneakers: 'Кроссовкалар',
    bag: 'Сумка',
    
    // Action buttons
    view: 'Көрүү',
    buy: 'Сатып алуу',
    watch: 'Көрүү',
    economy: 'Экономия:',
    colors: 'Түстөр:',
    sizes: 'Өлчөмдөр:',
    
    // New arrivals page - custom for this page
    newCollectionHero: 'Жаңы коллекция!',
    latestTrends: 'Эң акыркы мода тенденциялары менен таанышыңыз. Жаңы товарлар ар дайым эң жакшы баада!',
    newItemsCount: 'Жаңы товарлар: 50+',
    
    // Returns page
    wrongSize: 'Өлчөм туура эмес',
    wrongColor: 'Түс туура эмес',
    poorQuality: 'Сапат туура эмес',
    notAsExpected: 'Кыялдан айырма',
    returnRight: 'Кайтаруу укугу',
    otherReason: 'Башка себеп',
    importantNotice: 'Маанилүү эскертүү',
    returnProcessInfo: 'Товарды кайтаруу курьердан алуу учурунда гана мүмкүн. Товарды алгандан кийин кайтаруу мүмкүн эмес. Бардык текшерүүлөрдү жеткирүү учурунда жасаңыз.',
    returnDeliveryCost: 'Кайтаруу жеткирүүсүнүн баасы',
    returnDeliveryCostDesc: 'Алгачкы жеткирүү акысыз болгондуктан, товарды кайтаруу үчүн кардар 100 сом төлөшү керек.',
    
    // Returns page - new policy
    returns: 'Кайтаруу',
    returnPolicy: 'Кайтаруу эрежелери',
    returnPolicyDescription: 'Биздин дүкөндө кайтаруу жөнүндө маанилүү маалымат',
    returnPossible: 'Кайтаруу мүмкүн',
    returnConditionsTitle: 'Кайтаруу шарттары',
    onDeliveryReturn: 'Жеткирүү учурунда гана кайтаруу',
    onDeliveryReturnDesc: 'Товарды кайтаруу курьердан алуу учурунда гана мүмкүн. Заказчы товарды алып, ошол жерде текшериши керек.',
    checkOnDelivery: 'Жеткирүү учурунда текшерүү',
    checkOnDeliveryDesc: 'Заказчы товарды алуу учурунда сапатын, өлчөмүн, түсүн жана башка параметрлерин текшериши керек. Эгер бир нерсе туура эмес болсо, ошол жерде кайтаруу керек.',
    noOtherReturns: 'Башка учурларда кайтаруу мүмкүн эмес',
    noOtherReturnsDesc: 'Товарды алгандан кийин кайтаруу мүмкүн эмес. Бардык текшерүүлөрдү жеткирүү учурунда жасаңыз.',
    returnSteps: 'Кайтаруу алгоритми',
    step1Title: 'Курьер келди',
    step1Desc: 'Курьер сиздин заказыңызды алып келди',
    step2Title: 'Товарды текшериңиз',
    step2Desc: 'Өлчөмү, түсү, сапаты жана башка параметрлерди кылдат текшериңиз',
    step3Title: 'Чечим кабыл алыңыз',
    step3Desc: 'Эгер товар жакпаса - ошол жерде кайтарыңыз. Эгер бардыгы туура болсо - кабыл алыңыз',
    contactSupport: 'Колдоо кызматы',
    contactSupportDesc: 'Суроолоруңуз барбы? Биз менен байланышыңыз',
    alwaysAvailable: 'Дайыма жеткиликтүү',
    responseWithin24h: '24 саат ичинде жооп',
    
    // Page titles
    aboutUs: 'Биз жөнүндө',
    privacy: 'Колдонуу шарттары жана жеке маалыматтын коопсуздугу',
    
    // About page
    storeName: 'Unimark',
    storeDescription: 'Биздин дүкөндө эң сонун жана сапаттуу кийимдерди табасыз. Биз ар бир кардарыбызды баалайбыз жана аларга эң жакшы кызмат көрсөтүүгө аракет кылабыз.',
    customersCount: 'Кардарлардын саны',
    customersCountValue: '10,000+',
    loyalCustomers: 'Ырааттуу кардарлар',
    experienceYears: 'Жылдардын тажрыйбасы',
    experienceYearsValue: '5+',
    years: 'Жылдар',
    productsCount: 'Товарлардын саны',
    productsCountValue: '500+',
    variousProducts: 'Ар кандай товарлар',
    reliability: 'Ырааты',
    reliabilityValue: '100%',
    customerSatisfaction: 'Кардарлардын канааттануусу',
    ourStory: 'Биздин тарых',
    storyParagraph1: 'Unimark 2019-жылы негизделген жана алгачкы күндөрүнөн тартып биздин негизги максат - кардарларга сапаттуу жана стилдүү кийимдерди жеткирүү болгон. Биз ар бир кардарыбыздын муктаждыктарын түшүнүп, аларга эң жакшы кызмат көрсөтүүгө аракет кылабыз.',
    storyParagraph2: 'Бүгүнкү күндө биз Кыргызстандын алдыңкы онлайн дүкөнү болуп саналат жана ар бир күнү жаңы кардарларды тартууда улантабыз. Биздин команда профессионалдык кызматкерлерден турат, алар сизге эң жакшы кызмат көрсөтүү үчүн дайыма даяр.',
    ourValues: 'Биздин баалуулуктар',
    qualityValue: 'Сапат - биздин негизги баалуулук. Биз ар бир товардын сапатына көңүл бурабыз.',
    satisfactionValue: 'Кардарлардын канааттануусу - биздин негизги максат.',
    innovationValue: 'Инновация - биз дайыма жаңы технологияларды колдонобуз.',
    reliabilityValueText: 'Ырааттуулук - биздин кардарлар бизге ишенишет.',
    ourMission: 'Биздин миссия',
    missionDescription: 'Биздин миссия - ар бир адамга өз стилин табууга жана өзүн жакшы сезүүгө жардам берүү. Биз сапаттуу, стилдүү жана арзан баадагы кийимдерди сунуштайбыз.',
    missionQuote: '"Биздин максат - сизди эң жакшы көрүнүшүңүздү табууга жардам берүү"',
    contactUs: 'Биз менен байланышыңыз',
    questionsHelp: 'Сорууларыңыз барбы? Биз сизге жардам берүүгө дайымыз!',
    contactButton: 'Байланышуу',
    
    // Privacy page
    privacyDescription: 'Биз сиздин жеке маалыматтарыңыздын коопсуздугуна кам көрөбүз. Биздин кызмат катталууну талап кылбайт - биз заказдарды иштетүү үчүн гана керектүү маалыматты топтойбуз.',
    dataCollection: 'Маалымат топтоо',
    personalInfo: 'Жеке маалымат',
    personalInfoDesc: 'Биз сиздин атыңыз, телефон номериңиз жана жеткирүү дарегиңизди гана топтойбуз заказдарды иштетүү жана аткаруу үчүн.',
    technicalInfo: 'Техникалык маалымат',
    technicalInfoDesc: 'Биз сиздин түзүлүшүңүздүн техникалык маалыматын топтобойбуз. Биздин кызмат катталуусуз иштейт.',
    dataUsage: 'Маалыматты колдонуу',
    serviceProvision: 'Кызмат көрсөтүү',
    serviceProvisionDesc: 'Биз сиздин маалыматтарыңызды гана заказдарды иштетүү жана жеткирүү үчүн колдонобуз.',
    notifications: 'Билдирүүлөр',
    notificationsDesc: 'Биз сизге заказ статусу, жаңы товарлар жана акциялар жөнүндө билдирүүлөр жөнөтөбүз.',
    dataSharing: 'Маалыматты бөлүшүү',
    thirdParties: 'Үчүнчү тараптар',
    thirdPartiesDesc: 'Биз сиздин маалыматтарыңызды үчүнчү тараптарга бере албайбыз, эгерде мыйзам талап кылбаса.',
    employees: 'Кызматкерлер',
    employeesDesc: 'Биздин кызматкерлер сиздин маалыматтарыңызды кызмат көрсөтүү үчүн гана колдонушу мүмкүн.',
    security: 'Коопсуздук',
    dataProtection: 'Маалыматты коргоо',
    dataProtectionDesc: 'Биз сиздин маалыматтарыңызды коргоо үчүн бардык зарыл чараларды көрөбүз.',
    encryption: 'Шифрлөө',
    encryptionDesc: 'Биздин сайт SSL шифрлөөсүн колдонот жана бардык маалыматтар коопсуз ташылат.',
    yourRights: 'Сиздин укуктарыңыз',
    accessRight: 'Кирүү укугу',
    accessRightDesc: 'Сиз өзүңүздүн заказдарыңыз жөнүндө маалыматты бизден суроо укугуна ээсиз.',
    editRight: 'Өзгөртүү укугу',
    editRightDesc: 'Сиз заказдагы маалыматты аны иштетүүдөн мурун биз менен байланышып өзгөртө аласыз.',
    deleteRight: 'Жок кылуу укугу',
    deleteRightDesc: 'Сиз заказдарыңыз аткарылгандан кийин алардын маалыматтарын жок кылдырууну суроо укугуна ээсиз.',
    contactInfo: 'Байланыш маалыматы',
    contactInfoDesc: 'Сорууларыңыз болсо, биз менен байланышыңыз: privacy@unimark.kg',
    policyUpdates: 'Саясатты жаңыртуу',
    policyUpdatesDesc: 'Биз бул саясатты каалаган убакта өзгөртүшүбүз мүмкүн. Өзгөртүүлөр жөнүндө сизге электрондук почта аркылуу кабарлайбыз.',
    
    // Footer
    footerDescription: 'Биздин дүкөндө эң сонун жана сапаттуу кийимдерди табасыз. Биз ар бир кардарыбызды баалайбыз.',
    quickLinks: 'Тез шилтемелер',
    customerService: 'Кардарларды тейлөө',
    contacts: 'Байланыш',
    allRightsReserved: 'Бардык укуктар корголгон.',
    termsOfUse: 'Колдонуу шарттары',
    address: 'Бишкек шаары, Чүй проспекти 123',
    
    // Review Modal
    editReview: 'Отзывды түзөтүү',
    leaveReview: 'Пикир калтыруу',
    yourRating: 'Сиздин баалооңуз *',
    yourName: 'Сиздин атыңыз *',
    yourReview: 'Сиздин отзыв *',
    enterYourName: 'Атыңызды киргизиңиз',
    shareImpressions: 'Товар жөнүндө өз пикириңизди бөлүшүңүз...',
    minimumCharacters: 'Эң аз 10 символ',
    notSelected: 'Тандалган жок',
    cancel: 'Жокко чыгаруу',
    save: 'Сактоо',
    send: 'Жөнөтүү',
    saving: 'Сакталууда...',
    sending: 'Жөнөтүлүүдө...',
    reviewHelp: 'Сиздин отзыв башка сатып алуучуларга туура тандоо жасашына жардам берет',
    enterNameError: 'Атыңызды киргизиңиз',
    writeReviewError: 'Отзыв жазыңыз',
    minimumLengthError: 'Отзыв эң аз 10 символду камтышы керек',
    setRatingError: 'Баалоо коюңуз',
    
    // Product page additional translations
    reviews: 'Пикирлер',
    noReviewsYet: 'Пикирлер жок',
    beFirstToReview: 'Бул товар жөнүндө биринчи пикир калтыргыч болуңуз',
    writeReview: 'Пикир жазуу',
    showAllReviews: 'Бардык пикирлерди көрүү',
    productNotFound: 'Товар табылган жок',
    errorLoadingProduct: 'Товарды жүктөөдө ката',
    alreadyReviewed: 'Сиз бул товар үчүн пикир калтыргансыз',
    reviewUpdated: 'Пикир ийгиликтүү жаңыртылды!',
    reviewAdded: 'Пикир ийгиликтүү кошулду!',
    errorUpdatingReview: 'Пикирди жаңыртууда ката',
    errorAddingReview: 'Пикир кошууда ката',
    errorOccurred: 'Ката кетти. Кайра аракет кылыңыз.',
    tryAgain: 'Кайра аракет кылыңыз',
    highQualityProduct: 'Жогорку сапаттагы товар эң сонун мүнөздөмөлөр менен. Күнүмдүк колдонууга жарамдуу жана ишенимдүүлүк жана туруктуулук менен айырмаланат.',
    outOf5: '5тен',
    
    // Terms page
    personalDataProtection: 'Жеке маалыматты коргоо',
    personalDataDescription: 'Сиз өз жеке маалыматтарыңызды коргоого милдеттүүсүз.',
    falseInformation: 'Жалган маалымат берүү',
    accountBlocked: 'Аккаунт жокко чыгарылат',
    serviceDisruption: 'Кызматтарды бузуу',
    accessSuspended: 'Доступ токтотулат',
    copyrightViolation: 'Автордук укукту бузуу',
    legalAction: 'Мыйзамдык чаралар көрүлөт',
    spamDistribution: 'Спам жайылтуу',
    fineApplied: 'Айып салынат',
    
    // Additional orders page
    loadingOrders: 'Заказдар жүктөлүүдө...',
    errorLoading: 'Жүктөөдөгү ката',
    orderFrom: 'Заказ',
    status: 'Статус',
    details: 'Толук маалымат',
    
    // Order statuses
    created: 'Түзүлдү',
    courierWait: 'Курьерди күтүүдө',
    courierPicked: 'Курьер алды',
    enroute: 'Жолдо',
    canceled: 'Жокко чыгарылды',
    
    // Additional product page
    addToFavorites: 'Тандалмаларга кошуу',
    description: 'Тарыхы',
    relatedProducts: 'Окшош товарлар',
    averageRating: 'Орточо рейтинг',
    failedToLoad: 'Жүктөөдө ката',
    
    // Boolean values
    yes: 'Ооба',
    no: 'Жок',
    
    // Additional track order page
    order: 'Заказ',
    orderNotFound: 'Заказ табылган жок',
    orderNotFoundDesc: 'Мындай ID менен заказ жок',
    loadingOrder: 'Заказ жүктөлүүдө...',
    itemsInOrder: 'Заказдагы товарлар',
    customerInfo: 'Кардардын маалыматы',
    phone: 'Телефон',
    createdDate: 'Түзүлгөн датасы',
    total: 'Жалпы',
    deliveryStatus: 'Жеткирүү статусу',
    pieces: 'дана',
    currentStatus: 'Учурдагы статус',
    orderComment: 'Заказга комментарий',
    
    // Additional order tracking statuses
    waitingCourier: 'Курьерди күтүүдө',
    courierTook: 'Курьер алды',
    inTransit: 'Жолдо',
    deliveredStatus: 'Жеткирилди',
    
    // Category page
    category: 'Категория',
    subcategory: 'Подкатегория',
    categoryNotFound: 'Категория табылган жок',
    categoryNotFoundDesc: 'Мындай ID менен категория жок',
    subcategories: 'Подкатегориялар',
    backToCategory: 'Категорияга кайтуу',
    productsInCategory: 'Категориядагы товарлар',
    productsInSubcategory: 'Подкатегориядагы товарлар',
    productsNotFound: 'Товарлар табылган жок',
    noProductsInCategory: 'Бул категорияда товарлар жок',
    noProductsInSubcategory: 'Бул подкатегорияда товарлар жок',
    categoryProductsCount: 'товар'
  },
  
  ru: {
    // Navigation
    home: 'Главная',
    cart: 'Корзина',
    favorites: 'Избранное',
    orders: 'Заказы',
    
    // Search and filters
    search: 'Поиск',
    searchProducts: 'Поиск товаров...',
    filters: 'Фильтры',
    seeAll: 'Смотреть все',
    categories: 'Категории',
    
    // Product related
    featuredProducts: 'Рекомендуемые товары',
    newCollection: 'Новая коллекция',
    shopNow: 'Купить сейчас',
    summerSale: 'Летняя распродажа',
    upTo70Off: 'Скидки до 70%\nна выбранные товары',
    explore: 'Исследовать',
    newArrivals: 'Новинки',
    freshStyles: 'Новые стили\nуже здесь',
    discover: 'Открыть',
    
    // Filter modal
    priceRange: 'Диапазон цен',
    min: 'Мин',
    max: 'Макс',
    minimumRating: 'Минимальный рейтинг',
    any: 'Любой',
    sortBy: 'Сортировка',
    newestFirst: 'Сначала новые',
    oldestFirst: 'Сначала старые',
    priceLowToHigh: 'Цена: по возрастанию',
    priceHighToLow: 'Цена: по убыванию',
    highestRated: 'Высокий рейтинг',
    reset: 'Сбросить',
    applyFilters: 'Применить фильтры',
    
    // Product categories
    tshirt: 'Футболка',
    pant: 'Брюки',
    dress: 'Платье',
    jacket: 'Куртка',
    
    // Product titles
    categoryProducts: 'товары',
    filteredProducts: 'Отфильтрованные товары',
    allProducts: 'Все товары',
    
    // Product page
    productDetails: 'Описание товара',
    selectSize: 'Выберите размер',
    selectColor: 'Выберите цвет',
    quantity: 'Количество',
    totalPrice: 'Общая стоимость',
    addToCart: 'Добавить в корзину',
    readMore: 'Читать далее',
    goBack: 'Вернуться назад',
    noImage: 'Нет изображения',
    specifications: 'Атрибуты',
    noColorsAvailable: 'Цвета недоступны',
    
    // Favorites page
    myWishlist: 'Мои избранные',
    noFavoritesTitle: 'Ваш список избранного пуст',
    noFavoritesSubtitle: 'Нажмите на сердечко, чтобы сохранить понравившиеся товары',
    startShopping: 'Начать покупки',
    all: 'Все',
    removeFromFavorites: 'Удалить из избранного',
    
    // Modal confirmations
    confirm: 'Подтвердить',
    confirmRemoveTitle: 'Удалить из избранного',
    confirmRemoveMessage: 'Вы уверены, что хотите удалить этот товар из избранного?',
    remove: 'Удалить',
    
    // Cart page
    myCart: 'Моя корзина',
    emptyCartTitle: 'Ваша корзина пуста',
    emptyCartSubtitle: 'Начните добавлять понравившиеся товары',
    subtotal: 'Промежуточный итог',
    deliveryFee: 'Стоимость доставки',
    totalCost: 'Общая стоимость',
    proceedToCheckout: 'Перейти к оформлению',
    removeFromCart: 'Удалить из корзины',
    confirmRemoveFromCartTitle: 'Удалить из корзины',
    confirmRemoveFromCartMessage: 'Вы уверены, что хотите удалить этот товар из корзины?',
    yesRemove: 'Да, удалить',
  color: 'Цвет',
  price: 'Цена',
  
  // Orders page
    myOrders: 'Мои заказы',
    active: 'Активные',
    completed: 'Завершенные',
    cancelled: 'Отмененные',
    trackOrder: 'Отследить заказ',
    noOrdersTitle: 'У вас нет заказов',
    noOrdersSubtitle: 'Сделайте первую покупку, чтобы увидеть заказы здесь',
    orderStatus: 'Статус заказа',
    orderDate: 'Дата заказа',
    orderNumber: 'Номер заказа',
    courierInfo: 'Информация о курьере',
    orderCreated: 'Создан',
    orderInProgress: 'В обработке',
    orderDelivered: 'Доставлен',
    orderCancelled: 'Отменен',
    orderCourierWait: 'Ожидает курьера',
    orderCourierPicked: 'Курьер забрал',
    orderEnroute: 'В пути',
    
    // Track Order page
    orderDetails: 'Детали заказа',
    expectedDeliveryDate: 'Ожидаемая дата доставки',
    trackingId: 'ID отслеживания',
    orderPlaced: 'Заказ размещен',
    inProgress: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    orderPlacedDate: '23 Авг 2023, 04:25 PM',
    inProgressDate: '23 Авг 2023, 03:54 PM',
    shippedDate: 'Ожидается 02 Сен 2023',
    deliveredDate: '23 Авг 2023, 2023',
    expectedDate: '03 Сен 2023',
    
    // Additional translations for ProductGrid
    inCart: 'В корзине',
    
    // Reviews page
    reviewsTitle: 'Отзывы',
    reviewSubmitted: 'Отзыв отправлен',
    
    // Checkout modal
    orderCheckout: 'Оформление заказа',
    orderTotal: 'Итого к оплате',
    customerName: 'Ваше имя',
    customerPhone: 'Номер телефона',
    deliveryAddress: 'Адрес доставки',
    customerComment: 'Комментарий',
    enterName: 'Введите ваше имя',
    enterPhone: 'Введите номер телефона',
    enterAddress: 'Введите адрес',
    optionalComment: 'Комментарий (необязательно)',
    phoneValidation: 'Введите корректный номер телефона (+996 XXX XXX XXX)',
    placeOrder: 'Оформить заказ',
    
    // Common actions
    submit: 'Отправить',
    edit: 'Редактировать',
    close: 'Закрыть',
    
    // Additional missing translations
    back: 'Назад',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    warning: 'Предупреждение',
    info: 'Информация',
    
    // Notification messages
    errorInsufficientData: 'Ошибка: недостаточно данных о товаре',
    addedToFavorites: 'Добавлено в избранное',
    errorAddingToFavorites: 'Ошибка при добавлении в избранное',
    addedToCart: 'Добавлено в корзину',
    
    // Product grid labels
    sizeLabel: 'Размер:',
    addToCartButton: 'В корзину',
    
    // Review page messages
    errorLoadingReviews: 'Ошибка загрузки отзывов',
    reviewSubmitError: 'Ошибка при добавлении отзыва',
    reviewSubmitErrorGeneral: 'Произошла ошибка. Попробуйте снова.',
    
    // Loading states
    loadingText: 'Загрузка...',
    loadingProducts: 'Загрузка товаров...',
    loadingCategories: 'Загрузка категорий...',
    loadingData: 'Загрузка данных...',
    
    // Status labels
    available: 'Доступно',
    unavailable: 'Недоступно',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    
    // Common words
    hot: 'ХИТ',
    new: 'НОВИНКА',
    sale: 'РАСПРОДАЖА',
    
    
    // Product labels
    men: 'Мужчины',
    women: 'Женщины',
    children: 'Дети',
    sport: 'Спорт',
    shoes: 'Обувь',
    accessories: 'Аксессуары',
    
    // Time units
    days: 'дня',
    hours: 'часов',
    
    // Product names examples
    classicTshirt: 'Классическая футболка',
    elegantDress: 'Элегантное платье',
    sportJacket: 'Спортивная куртка',
    classicPants: 'Джинсы',
    summerDress: 'Летнее платье',
    childrenClothing: 'Детская одежда',
    sneakers: 'Кроссовки',
    bag: 'Сумка',
    
    // Action buttons
    view: 'Смотреть',
    buy: 'Купить',
    watch: 'Смотреть',
    economy: 'Экономия:',
    colors: 'Цвета:',
    sizes: 'Размеры:',
    
    // New arrivals page - custom for this page
    newCollectionHero: 'Новая коллекция!',
    latestTrends: 'Ознакомьтесь с последними модными тенденциями. Новые товары всегда по лучшим ценам!',
    newItemsCount: 'Новых товаров: 50+',
    
    // Returns page
    wrongSize: 'Неподходящий размер',
    wrongColor: 'Неподходящий цвет',
    poorQuality: 'Некачественный товар',
    notAsExpected: 'Не соответствует ожиданиям',
    returnRight: 'Право на возврат',
    otherReason: 'Другая причина',
    importantNotice: 'Важное уведомление',
    returnProcessInfo: 'Возврат товара возможен только при получении от курьера. После получения товара возврат невозможен. Проводите все проверки при получении.',
    returnDeliveryCost: 'Стоимость доставки при возврате',
    returnDeliveryCostDesc: 'Поскольку первоначальная доставка была бесплатной, клиент должен оплатить 100 сом за доставку при возврате товара.',
    
    // Returns page - new policy
    returns: 'Возвраты',
    returnPolicy: 'Политика возврата',
    returnPolicyDescription: 'Важная информация о возврате товаров в нашем магазине',
    returnPossible: 'Возврат возможен',
    returnConditionsTitle: 'Условия возврата',
    onDeliveryReturn: 'Возврат только при получении',
    onDeliveryReturnDesc: 'Возврат товара возможен только при получении заказа от курьера. Заказчик должен получить товар и проверить его на месте.',
    checkOnDelivery: 'Проверка при получении',
    checkOnDeliveryDesc: 'Заказчик должен проверить качество, размер, цвет и другие параметры товара при получении. Если что-то не так, возврат осуществляется на месте.',
    noOtherReturns: 'В других случаях возврат невозможен',
    noOtherReturnsDesc: 'После получения товара возврат невозможен. Проводите все проверки при получении.',
    returnSteps: 'Алгоритм возврата',
    step1Title: 'Курьер прибыл',
    step1Desc: 'Курьер доставил ваш заказ',
    step2Title: 'Проверьте товар',
    step2Desc: 'Тщательно проверьте размер, цвет, качество и другие параметры',
    step3Title: 'Примите решение',
    step3Desc: 'Если товар не подходит - верните на месте. Если всё в порядке - принимайте',
    contactSupport: 'Служба поддержки',
    contactSupportDesc: 'Есть вопросы? Свяжитесь с нами',
    alwaysAvailable: 'Всегда доступен',
    responseWithin24h: 'Ответ в течение 24 часов',
    
    // Page titles
    aboutUs: 'О нас',
    privacy: 'Условия использования и конфиденциальность',
    
    // About page
    storeName: 'Unimark',
    storeDescription: 'В нашем магазине вы найдете самую красивую и качественную одежду. Мы ценим каждого нашего клиента и стремимся предоставить им лучший сервис.',
    customersCount: 'Количество клиентов',
    customersCountValue: '10,000+',
    loyalCustomers: 'Постоянных клиентов',
    experienceYears: 'Опыт работы',
    experienceYearsValue: '5+',
    years: 'Лет',
    productsCount: 'Количество товаров',
    productsCountValue: '500+',
    variousProducts: 'Различных товаров',
    reliability: 'Надежность',
    reliabilityValue: '100%',
    customerSatisfaction: 'Удовлетворенность клиентов',
    ourStory: 'Наша история',
    storyParagraph1: 'Unimark был основан в 2019 году, и с первых дней нашей основной целью было предоставление качественной и стильной одежды нашим клиентам. Мы понимаем потребности каждого клиента и стремимся предоставить им лучший сервис.',
    storyParagraph2: 'Сегодня мы являемся ведущим интернет-магазином Кыргызстана и продолжаем привлекать новых клиентов каждый день. Наша команда состоит из профессиональных сотрудников, которые всегда готовы предоставить вам лучший сервис.',
    ourValues: 'Наши ценности',
    qualityValue: 'Качество - наша основная ценность. Мы уделяем внимание качеству каждого товара.',
    satisfactionValue: 'Удовлетворенность клиентов - наша основная цель.',
    innovationValue: 'Инновации - мы всегда используем новые технологии.',
    reliabilityValueText: 'Надежность - наши клиенты доверяют нам.',
    ourMission: 'Наша миссия',
    missionDescription: 'Наша миссия - помочь каждому человеку найти свой стиль и чувствовать себя хорошо. Мы предлагаем качественную, стильную и доступную по цене одежду.',
    missionQuote: '"Наша цель - помочь вам найти свой лучший образ"',
    contactUs: 'Свяжитесь с нами',
    questionsHelp: 'Есть вопросы? Мы готовы помочь вам!',
    contactButton: 'Связаться',
    
    // Privacy page
    privacyDescription: 'Мы заботимся о безопасности ваших личных данных. Наш сервис не требует регистрации - мы собираем только необходимую информацию для обработки заказов.',
    dataCollection: 'Сбор информации',
    personalInfo: 'Личная информация',
    personalInfoDesc: 'Мы собираем только ваше имя, номер телефона и адрес доставки для обработки и выполнения заказов.',
    technicalInfo: 'Техническая информация',
    technicalInfoDesc: 'Мы не собираем техническую информацию о вашем устройстве. Наш сервис работает без регистрации.',
    dataUsage: 'Использование информации',
    serviceProvision: 'Предоставление услуг',
    serviceProvisionDesc: 'Мы используем вашу информацию только для обработки и доставки заказов.',
    notifications: 'Уведомления',
    notificationsDesc: 'Мы отправляем вам уведомления о статусе заказа, новых товарах и акциях.',
    dataSharing: 'Обмен информацией',
    thirdParties: 'Третьи стороны',
    thirdPartiesDesc: 'Мы не передаем вашу информацию третьим лицам, если этого не требует закон.',
    employees: 'Сотрудники',
    employeesDesc: 'Наши сотрудники могут использовать вашу информацию только для предоставления услуг.',
    security: 'Безопасность',
    dataProtection: 'Защита информации',
    dataProtectionDesc: 'Мы принимаем все необходимые меры для защиты вашей информации.',
    encryption: 'Шифрование',
    encryptionDesc: 'Наш сайт использует SSL-шифрование и все данные передаются безопасно.',
    yourRights: 'Ваши права',
    accessRight: 'Право доступа',
    accessRightDesc: 'Вы можете запросить информацию о ваших заказах, обратившись к нам.',
    editRight: 'Право редактирования',
    editRightDesc: 'Вы можете изменить данные в заказе, связавшись с нами до его обработки.',
    deleteRight: 'Право на удаление',
    deleteRightDesc: 'Вы можете запросить удаление информации о ваших заказах после их выполнения.',
    contactInfo: 'Контактная информация',
    contactInfoDesc: 'Если у вас есть вопросы, свяжитесь с нами: privacy@unimark.kg',
    policyUpdates: 'Обновления политики',
    policyUpdatesDesc: 'Мы можем изменить эту политику в любое время. О изменениях мы уведомим вас по электронной почте.',
    
    // Footer
    footerDescription: 'В нашем магазине вы найдете самую красивую и качественную одежду. Мы ценим каждого нашего клиента.',
    quickLinks: 'Быстрые ссылки',
    customerService: 'Служба поддержки',
    contacts: 'Контакты',
    allRightsReserved: 'Все права защищены.',
    termsOfUse: 'Условия использования',
    address: 'г. Бишкек, пр. Чуй 123',
    
    // Review Modal
    editReview: 'Редактировать отзыв',
    leaveReview: 'Оставить отзыв',
    yourRating: 'Ваша оценка *',
    yourName: 'Ваше имя *',
    yourReview: 'Ваш отзыв *',
    enterYourName: 'Введите ваше имя',
    shareImpressions: 'Поделитесь своими впечатлениями о товаре...',
    minimumCharacters: 'Минимум 10 символов',
    notSelected: 'Не выбрано',
    cancel: 'Отмена',
    save: 'Сохранить',
    send: 'Отправить',
    saving: 'Сохранение...',
    sending: 'Отправка...',
    reviewHelp: 'Ваш отзыв поможет другим покупателям сделать правильный выбор',
    enterNameError: 'Введите ваше имя',
    writeReviewError: 'Напишите отзыв',
    minimumLengthError: 'Отзыв должен содержать минимум 10 символов',
    setRatingError: 'Поставьте оценку',
    
    // Product page additional translations
    reviews: 'Отзывы',
    noReviewsYet: 'Отзывов пока нет',
    beFirstToReview: 'Будьте первым, кто оставит отзыв о этом товаре',
    writeReview: 'Написать отзыв',
    showAllReviews: 'Показать все отзывы',
    productNotFound: 'Товар не найден',
    errorLoadingProduct: 'Ошибка загрузки товара',
    alreadyReviewed: 'Вы уже оставили отзыв для этого товара',
    reviewUpdated: 'Отзыв успешно обновлен!',
    reviewAdded: 'Отзыв успешно добавлен!',
    errorUpdatingReview: 'Ошибка при обновлении отзыва',
    errorAddingReview: 'Ошибка при добавлении отзыва',
    errorOccurred: 'Произошла ошибка. Попробуйте снова.',
    tryAgain: 'Попробуйте снова',
    highQualityProduct: 'Высококачественный товар с отличными характеристиками. Идеально подходит для повседневного использования и отличается надежностью и долговечностью.',
    outOf5: 'из 5',
    
    // Terms page
    personalDataProtection: 'Защита личных данных',
    personalDataDescription: 'Вы обязаны защищать свои личные данные.',
    falseInformation: 'Предоставление ложной информации',
    accountBlocked: 'Аккаунт будет заблокирован',
    serviceDisruption: 'Нарушение работы сервисов',
    accessSuspended: 'Доступ будет приостановлен',
    copyrightViolation: 'Нарушение авторских прав',
    legalAction: 'Будут приняты правовые меры',
    spamDistribution: 'Распространение спама',
    fineApplied: 'Будет наложен штраф',
    
    // Additional orders page
    loadingOrders: 'Загрузка заказов...',
    errorLoading: 'Ошибка загрузки',
    orderFrom: 'Заказ от',
    status: 'Статус',
    details: 'Детали',
    
    // Order statuses
    created: 'Создан',
    courierWait: 'Ожидает курьера',
    courierPicked: 'Забрал курьер',
    enroute: 'В пути',
    canceled: 'Отменен',
    
    // Additional product page
    addToFavorites: 'Добавить в избранное',
    description: 'Описание',
    relatedProducts: 'Похожие товары',
    averageRating: 'Средний рейтинг',
    failedToLoad: 'Ошибка загрузки',
    
    // Boolean values
    yes: 'Да',
    no: 'Нет',
    
    // Additional track order page
    order: 'Заказ',
    orderNotFound: 'Заказ не найден',
    orderNotFoundDesc: 'Заказ с таким ID не существует',
    loadingOrder: 'Загрузка заказа...',
    itemsInOrder: 'Товары в заказе',
    customerInfo: 'Информация о клиенте',
    phone: 'Телефон',
    createdDate: 'Дата создания',
    total: 'Итого',
    deliveryStatus: 'Статус доставки',
    pieces: 'шт',
    currentStatus: 'Текущий статус',
    orderComment: 'Комментарий к заказу',
    
    // Additional order tracking statuses
    waitingCourier: 'Ожидает курьера',
    courierTook: 'Забрал курьер',
    inTransit: 'В пути',
    deliveredStatus: 'Доставлен',
    
    // Category page
    category: 'Категория',
    subcategory: 'Подкатегория',
    categoryNotFound: 'Категория не найдена',
    categoryNotFoundDesc: 'Категория с таким ID не существует',
    subcategories: 'Подкатегории',
    backToCategory: 'Назад к категории',
    productsInCategory: 'Товары в категории',
    productsInSubcategory: 'Товары в подкатегории',
    productsNotFound: 'Товары не найдены',
    noProductsInCategory: 'В этой категории пока нет товаров',
    noProductsInSubcategory: 'В этой подкатегории пока нет товаров',
    categoryProductsCount: 'товаров'
  }
}

export const useTranslation = (language: Language) => {
  return translations[language]
}

