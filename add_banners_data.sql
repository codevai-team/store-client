-- Добавляем тестовые данные для баннеров
INSERT INTO settings (key, value) VALUES (
  'add_banners',
  '[
    "https://kelkel.store/_next/image?url=https%3A%2F%2Fi.ibb.co%2FxSPr7yp4%2F20250810-124343-0000.png",
    "https://kelkel.store/_next/image?url=https%3A%2F%2Fi.ibb.co%2FxSPr7yp4%2F20250810-124343-0000.png",
    "https://kelkel.store/_next/image?url=https%3A%2F%2Fi.ibb.co%2FxSPr7yp4%2F20250810-124343-0000.png",
    "https://kelkel.store/_next/image?url=https%3A%2F%2Fi.ibb.co%2FxSPr7yp4%2F20250810-124343-0000.png",
    "https://kelkel.store/_next/image?url=https%3A%2F%2Fi.ibb.co%2FxSPr7yp4%2F20250810-124343-0000.png"
  ]'
) ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();
