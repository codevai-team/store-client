#!/bin/sh

# Скрипт запуска для Next.js приложения с nginx

echo "🚀 Запуск Store Client..."

# Генерируем Prisma клиент если нужно
if [ ! -d "node_modules/.prisma" ]; then
    echo "📦 Генерируем Prisma клиент..."
    npx prisma generate
fi

# Проверяем подключение к базе данных
echo "🔍 Проверяем подключение к базе данных..."
npx prisma db push --accept-data-loss || {
    echo "❌ Ошибка подключения к базе данных. Проверьте DATABASE_URL"
    exit 1
}

# Запускаем nginx в фоне
echo "🌐 Запускаем nginx..."
nginx -g "daemon on;" &

# Запускаем Next.js приложение
echo "⚡ Запускаем Next.js приложение..."
exec node server.js
