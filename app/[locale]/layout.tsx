import { Providers } from "./providers";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { Metadata } from "next";
import Script from "next/script";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// Add metadata for SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://draftworksproject.com'),
  title: {
    template: '%s | Draftworks Project',
    default: 'Draftworks Project | Architecture & Design',
  },
  description: 'Professional architecture, interior design, and building services by Draftworks Project',
  keywords: ['architecture', 'interior design', 'building permit', 'BIM modeling', 'architecture firm', 'Georgia'],
  authors: [{ name: 'Draftworks Project' }],
  creator: 'Draftworks Project',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://draftworksproject.com',
    siteName: 'Draftworks Project',
    title: 'Draftworks Project | Architecture & Design',
    description: 'Professional architecture, interior design, and building services by Draftworks Project',
    images: ['/assets/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Draftworks Project | Architecture & Design',
    description: 'Professional architecture, interior design, and building services by Draftworks Project',
    images: ['/assets/logo.png'],
  },
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  // Next.js 15 requires await for params
  const { locale } = await params;

  const georgianFont = locale === "ka";
  const fontFamily = georgianFont
    ? '"Bebas Neue", sans-serif'
    : '"Montserrat", sans-serif';

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily }}>
        <Providers locale={locale}>
          <Header />
          <FloatingContact />
          {children}
          <Footer />
        </Providers>

        <Script id="font-application" strategy="afterInteractive">{`
          try {
            document.documentElement.style.setProperty('--font-family', '${fontFamily}');
          } catch (e) {
            console.error('Failed to set font variable:', e);
          }
        `}</Script>
      </body>
    </html>
  );
}