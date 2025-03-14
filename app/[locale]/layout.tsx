import { Providers } from "./providers";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({
  children,
  params,
}: LayoutProps) {
  // Extract locale from params directly, no need for await as it's already available
  const locale = params.locale;

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers locale={locale}>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}