import './theme.css';
import '@coinbase/onchainkit/styles.css';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AppProvider } from './context/AppContext';
import { Inter } from 'next/font/google';
import { FloatingChat } from './components/FloatingChat';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Study Guide Marketplace",
  description: "Marketplace for study guides using NFTs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppProvider>
            {children}
          </AppProvider>
        </Providers>
        <FloatingChat />
      </body>
    </html>
  );
}
