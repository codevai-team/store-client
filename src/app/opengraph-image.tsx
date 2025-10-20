import { ImageResponse } from 'next/og'

// Размеры изображения
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Генерация Open Graph изображения
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              marginBottom: 20,
            }}
          >
            Unimark
          </div>
          <div
            style={{
              fontSize: 36,
              opacity: 0.9,
            }}
          >
            Интернет-магазин качественной одежды
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
