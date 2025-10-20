import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Unimark - Интернет-магазин одежды',
    short_name: 'Unimark',
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
        src: '/unimark-logo.svg',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        src: '/unimark-logo.svg',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        src: '/unimark-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
