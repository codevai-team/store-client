# 🔧 Исправление ошибки .dockerignore

## Проблема
Ошибка: `"/public": not found` при копировании папки public в Dockerfile.

## Причина
В файле `.dockerignore` была строка `public`, которая исключала папку `public` из build context Docker.

## Исправление

### Удалена строка из .dockerignore
```dockerignore
# Было:
# Gatsby files
.cache/
public

# Стало:
# Gatsby files
.cache/
```

## Объяснение
- Папка `public` была исключена из build context из-за строки `public` в `.dockerignore`
- Эта строка была добавлена для Gatsby проектов, но не подходит для Next.js
- В Next.js папка `public` содержит статические файлы, которые нужны в контейнере

## Результат
- ✅ Папка `public` теперь включена в build context
- ✅ Копирование `COPY public/ ./public/` работает корректно
- ✅ Все статические файлы (изображения, иконки, манифесты) доступны в контейнере
- ✅ Nginx может правильно обслуживать статические ресурсы

## Запуск
```bash
docker build -t store-client .
docker run -d --name store-client -p 80:80 --env-file .env store-client
```

Теперь сборка должна пройти без ошибок!
