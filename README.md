# Unimark - Интернет-магазин одежды

Современный интернет-магазин одежды, построенный на Next.js 15 с использованием TypeScript, Prisma ORM и PostgreSQL. Приложение поддерживает многоязычность (русский и кыргызский языки) и включает полный функционал электронной коммерции.

## 🚀 Основной функционал

### 🛍️ Каталог товаров
- **Просмотр товаров** с изображениями, описаниями и ценами
- **Категории и подкатегории** с иерархической структурой
- **Фильтрация товаров** по категориям, цене, рейтингу
- **Поиск товаров** по названию и описанию
- **Сортировка** по дате, цене, рейтингу
- **Размеры и цвета** для каждого товара
- **Отзывы и рейтинги** клиентов

### 🛒 Корзина и заказы
- **Добавление товаров в корзину** с выбором размера и цвета
- **Управление количеством** товаров в корзине
- **Сохранение корзины** в cookies браузера
- **Оформление заказов** с указанием контактных данных
- **Отслеживание заказов** по статусам
- **История заказов** клиента

### ❤️ Избранное
- **Сохранение понравившихся товаров**
- **Управление списком избранного**
- **Быстрый доступ** к сохраненным товарам

### 🌐 Многоязычность
- **Русский язык** (основной)
- **Кыргызский язык** (полная локализация)
- **Переключение языков** в реальном времени
- **Сохранение выбранного языка** в cookies

### 📱 Адаптивный дизайн
- **Мобильная версия** с нижней навигацией
- **Десктопная версия** с боковой навигацией
- **PWA поддержка** для установки как приложение
- **Оптимизация изображений** с Next.js Image

### 🔔 Уведомления
- **Telegram уведомления** о новых заказах
- **Система уведомлений** в интерфейсе
- **Toast сообщения** для обратной связи

## 🏗️ Архитектура

### Frontend
- **Next.js 15** с App Router
- **React 19** с хуками и контекстами
- **TypeScript** для типизации
- **Tailwind CSS** для стилизации
- **Lucide React** для иконок

### Backend
- **Next.js API Routes** для серверной логики
- **Prisma ORM** для работы с базой данных
- **PostgreSQL** как основная база данных
- **Server Actions** для серверных операций

### Состояние приложения
- **React Context** для глобального состояния:
  - `CartContext` - управление корзиной
  - `FavoritesContext` - управление избранным
  - `LanguageContext` - переключение языков
  - `OrdersContext` - управление заказами
  - `NotificationContext` - система уведомлений

### База данных
- **PostgreSQL** с Prisma схемой
- **Модели**: User, Category, Product, Order, Review, Setting
- **Связи**: категории-товары, заказы-позиции, отзывы-товары
- **Индексы** для оптимизации запросов

## 📁 Структура проекта

```
unimark/
├── prisma/
│   └── schema.prisma          # Схема базы данных
├── public/                    # Статические файлы
│   ├── unimark-logo.svg  # Иконка сайта
│   ├── unimark-logo.svg  # Логотип
│   └── unimark-logo.svg      # PWA иконка
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API маршруты
│   │   │   ├── banners/      # API баннеров
│   │   │   ├── categories/   # API категорий
│   │   │   ├── orders/       # API заказов
│   │   │   ├── products/     # API товаров
│   │   │   └── telegram/     # API Telegram
│   │   ├── cart/             # Страница корзины
│   │   ├── category/         # Страницы категорий
│   │   ├── favorites/        # Страница избранного
│   │   ├── orders/           # Страницы заказов
│   │   ├── product/          # Страницы товаров
│   │   ├── about/            # О нас
│   │   ├── privacy/          # Политика конфиденциальности
│   │   ├── returns/          # Политика возврата
│   │   ├── layout.tsx        # Основной layout
│   │   ├── page.tsx          # Главная страница
│   │   ├── manifest.ts       # PWA манифест
│   │   ├── robots.ts         # SEO robots.txt
│   │   └── sitemap.ts        # SEO sitemap
│   ├── components/           # React компоненты
│   │   ├── AppLayout.tsx     # Основной layout
│   │   ├── Header.tsx        # Шапка сайта
│   │   ├── BottomNavigation.tsx # Мобильная навигация
│   │   ├── DesktopNavigation.tsx # Десктопная навигация
│   │   ├── ProductGrid.tsx   # Сетка товаров
│   │   ├── CartItemOptionsModal.tsx # Модал опций товара
│   │   ├── CheckoutModal.tsx # Модал оформления заказа
│   │   ├── FilterModal.tsx   # Модал фильтров
│   │   ├── ReviewModal.tsx   # Модал отзывов
│   │   └── ...               # Другие компоненты
│   ├── context/              # React контексты
│   │   ├── CartContext.tsx   # Контекст корзины
│   │   ├── FavoritesContext.tsx # Контекст избранного
│   │   ├── LanguageContext.tsx # Контекст языка
│   │   ├── OrdersContext.tsx # Контекст заказов
│   │   └── NotificationContext.tsx # Контекст уведомлений
│   ├── lib/                  # Утилиты и конфигурация
│   │   ├── db.ts            # Подключение к БД
│   │   ├── cookies.ts       # Работа с cookies
│   │   ├── i18n.ts          # Интернационализация
│   │   └── reviewStorage.ts # Хранение отзывов
│   └── services/            # Сервисы
│       └── telegram/        # Telegram сервис
├── add_banners_data.sql     # SQL для добавления баннеров
├── next.config.ts          # Конфигурация Next.js
├── package.json            # Зависимости проекта
├── tsconfig.json           # Конфигурация TypeScript
└── README.md               # Документация
```

## 🛠️ Технологический стек

### Основные технологии
- **Next.js 15.5.4** - React фреймворк
- **React 19.1.0** - UI библиотека
- **TypeScript 5** - Типизация
- **Tailwind CSS 4** - CSS фреймворк
- **Prisma 6.16.2** - ORM для работы с БД
- **PostgreSQL** - База данных

### Дополнительные библиотеки
- **Lucide React** - Иконки
- **ESLint** - Линтинг кода
- **Turbopack** - Быстрая сборка (dev режим)

## ⚙️ Переменные окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# База данных (обязательно)
DATABASE_URL="postgresql://username:password@localhost:5432/store_client"

# Telegram уведомления (опционально)
# Настройки Telegram бота для уведомлений о заказах
# Добавляются через API в таблицу settings:
# - TELEGRAM_BOT_TOKEN: токен бота
# - TELEGRAM_CHAT_ID: ID чата для уведомлений

# Дополнительные настройки (опционально)
# NODE_ENV=production
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Настройка Telegram уведомлений

Для настройки Telegram уведомлений добавьте в базу данных записи в таблицу `settings`:

```sql
INSERT INTO settings (key, value) VALUES 
('TELEGRAM_BOT_TOKEN', 'your_bot_token_here'),
('TELEGRAM_CHAT_ID', 'your_chat_id_here');
```

## 🚀 Установка и запуск

### Предварительные требования
- Node.js 18+ 
- PostgreSQL 12+
- npm или yarn

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd unimark
```

### 2. Установка зависимостей
```bash
npm install
# или
yarn install
```

### 3. Настройка базы данных
```bash
# Создайте базу данных PostgreSQL
createdb store_client

# Настройте DATABASE_URL в .env файле
echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/store_client\"" > .env
```

### 4. Инициализация базы данных
```bash
# Генерация Prisma клиента
npx prisma generate

# Применение миграций
npx prisma db push

# (Опционально) Заполнение тестовыми данными
psql -d store_client -f add_banners_data.sql
```

### 5. Запуск приложения

#### Режим разработки
```bash
npm run dev
# или
yarn dev
```

Приложение будет доступно по адресу: http://localhost:3000


## 📊 База данных

### Основные таблицы

#### Users (Пользователи)
- `id` - Уникальный идентификатор
- `fullname` - Полное имя
- `phoneNumber` - Номер телефона
- `password` - Пароль
- `role` - Роль (ADMIN, COURIER, SELLER)
- `status` - Статус (ACTIVE, INACTIVE, DELETED)

#### Categories (Категории)
- `id` - Уникальный идентификатор
- `name` - Название категории
- `description` - Описание
- `categoryId` - ID родительской категории
- `imageUrl` - URL изображения

#### Products (Товары)
- `id` - Уникальный идентификатор
- `name` - Название товара
- `description` - Описание
- `imageUrl` - JSON массив изображений
- `price` - Цена
- `categoryId` - ID категории
- `sellerId` - ID продавца
- `attributes` - JSON атрибуты
- `status` - Статус (ACTIVE, INACTIVE, DELETED)

#### Orders (Заказы)
- `id` - Уникальный идентификатор
- `customerName` - Имя клиента
- `customerPhone` - Телефон клиента
- `deliveryAddress` - Адрес доставки
- `courierId` - ID курьера
- `status` - Статус заказа
- `customerComment` - Комментарий клиента

#### Reviews (Отзывы)
- `id` - Уникальный идентификатор
- `productId` - ID товара
- `clientName` - Имя клиента
- `text` - Текст отзыва
- `rating` - Рейтинг (1-5)

#### Settings (Настройки)
- `id` - Уникальный идентификатор
- `key` - Ключ настройки
- `value` - Значение настройки

## 🔧 API Endpoints

### Товары
- `GET /api/products` - Получить товары с фильтрацией
- `POST /api/products` - Получить товары по ID

### Категории
- `GET /api/categories` - Получить все категории
- `GET /api/categories/tree` - Получить дерево категорий
- `GET /api/categories/[id]` - Получить категорию по ID

### Заказы
- `GET /api/orders` - Получить все заказы
- `POST /api/orders` - Создать новый заказ
- `GET /api/orders/[id]` - Получить заказ по ID

### Отзывы
- `GET /api/products/[id]/reviews` - Получить отзывы товара
- `POST /api/products/[id]/reviews` - Добавить отзыв

### Баннеры
- `GET /api/banners` - Получить баннеры

### Telegram
- `POST /api/telegram/send-notification` - Отправить уведомление
- `GET /api/telegram/test` - Тест Telegram бота

## 🌐 SEO и производительность

### SEO оптимизация
- **Мета-теги** для каждой страницы
- **Open Graph** для социальных сетей
- **Structured Data** (JSON-LD)
- **Sitemap.xml** автоматическая генерация
- **Robots.txt** настройка индексации

### Производительность
- **Next.js Image** оптимизация изображений
- **Turbopack** быстрая сборка в dev режиме
- **Lazy loading** для компонентов
- **Code splitting** автоматическое разделение кода
- **PWA** поддержка для офлайн работы

## 🔒 Безопасность

- **Валидация данных** на клиенте и сервере
- **SQL injection** защита через Prisma
- **XSS защита** через Next.js
- **CSRF защита** встроенная в Next.js
- **HTTPS** обязателен для продакшена

## 📱 PWA функции

- **Манифест** для установки как приложение
- **Service Worker** для кэширования
- **Офлайн поддержка** базового функционала
- **Push уведомления** (готовность к реализации)

## 🧪 Тестирование

Для тестирования функционала:

1. **Telegram уведомления**: `GET /api/telegram/test`
2. **API endpoints**: Используйте Postman или curl
3. **База данных**: Проверьте через Prisma Studio (`npx prisma studio`)



## 📝 Лицензия

Этот проект создан для демонстрационных целей.

## 🤝 Поддержка

Для вопросов и поддержки создайте issue в репозитории или свяжитесь с командой разработки.

---

**Unimark** - современный интернет-магазин с полным функционалом электронной коммерции, построенный на передовых технологиях веб-разработки.