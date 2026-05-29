# Многоэтапная сборка для Next.js приложения
FROM node:18-alpine AS base

# Установка зависимостей только для сборки
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./
RUN npm ci

# Этап сборки
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем приложение
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Продакшн этап
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем public папку
COPY --from=builder /app/public ./public

# Копируем собранное standalone приложение
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Копируем Prisma схему
COPY --from=builder /app/prisma ./prisma

# Копируем скрипт запуска
COPY --chown=nextjs:nodejs start.sh ./
RUN chmod +x start.sh

# Устанавливаем права доступа
RUN chown -R nextjs:nodejs /app

USER nextjs

# Next.js слушает на порту 3000 по умолчанию
EXPOSE 3000

# Устанавливаем порт
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./start.sh"]
