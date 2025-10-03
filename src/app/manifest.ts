import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Store Client - Интернет-магазин одежды',
    short_name: 'Store Client',
    description: ' ',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f97316',
    orientation: 'portrait',
    categories: ['shopping', 'lifestyle'],
    lang: 'ru',
    icons: [
      {
        src: '/client-store-logo.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        src: '/client-store-logo.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        src: '/logo-for-pwa.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
