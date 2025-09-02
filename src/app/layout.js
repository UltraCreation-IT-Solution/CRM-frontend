import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'CRM Dashboard',
    template: '%s | CRM Dashboard',
  },
  description: 'Modern CRM Dashboard for managing contacts, leads, and deals',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'CRM Dashboard',
    description: 'Modern CRM Dashboard for managing contacts, leads, and deals',
    url: 'http://localhost:3000',
    siteName: 'CRM Dashboard',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRM Dashboard',
    description: 'Modern CRM Dashboard for managing contacts, leads, and deals',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className='relative flex min-h-screen flex-col'>
            <main className='flex-1'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
