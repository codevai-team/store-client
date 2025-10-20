import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartProvider } from "@/context/CartContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { NotificationProvider } from "@/context/NotificationContext";
import NotificationContainer from "@/components/NotificationContainer";
import DesktopLayout from "@/components/DesktopLayout";
import StructuredData, { organizationSchema, websiteSchema } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Unimark",
    template: "%s | Unimark"
  },
  description: "Интернет-магазин качественной одежды в Кыргызстане. Широкий ассортимент футболок, брюк, платьев и курток. Быстрая доставка, гарантия качества.",
  keywords: ["одежда", "интернет-магазин", "Кыргызстан", "футболки", "брюки", "платья", "куртки", "мода", "стиль", "качественная одежда"],
  authors: [{ name: "Codev team" }],
  creator: "Codev",
  publisher: "Codev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://unimark.kg'),
  alternates: {
    canonical: '/',
    languages: {
      'ru': '/ru',
      'ky': '/ky',
    },
  },
  openGraph: {
    title: "Unimark - Интернет-магазин качественной одежды",
    description: "Интернет-магазин качественной одежды в Кыргызстане. Широкий ассортимент, быстрая доставка, гарантия качества.",
    url: 'https://unimark.kg',
    siteName: 'Unimark',
    images: [
      {
        url: '/unimark-logo.svg',
        width: 1200,
        height: 630,
        alt: 'Unimark - Интернет-магазин одежды',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Unimark - Интернет-магазин качественной одежды",
    description: "Интернет-магазин качественной одежды в Кыргызстане. Широкий ассортимент, быстрая доставка, гарантия качества.",
    images: ['/unimark-logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/unimark-logo.svg",
    shortcut: "/unimark-logo.svg",
    apple: "/unimark-logo.svg",
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <NotificationProvider>
            <FavoritesProvider>
              <CartProvider>
                <OrdersProvider>
                  <DesktopLayout>
                    {children}
                  </DesktopLayout>
                  <NotificationContainer />
                </OrdersProvider>
              </CartProvider>
            </FavoritesProvider>
          </NotificationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
