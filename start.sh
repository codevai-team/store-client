#!/bin/sh

# Скрипт запуска для Next.js приложения

echo "🚀 Запуск Unimark..."

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

# Запускаем Next.js приложение
echo "⚡ Запускаем Next.js приложение..."
if [ -f "server.js" ]; then
    exec node server.js
else
    echo "❌ Файл server.js не найден. Запускаем через npm start..."
    exec npm start
fi
