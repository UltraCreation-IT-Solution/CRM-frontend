import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: {
    default: 'CRM Dashboard',
    template: '%s | CRM Dashboard',
  },
  description: 'Modern CRM with WhatsApp, Voice, and Chatbot integration',
  keywords: [
    'CRM',
    'Customer Relationship Management', 
    'WhatsApp Business',
    'Voice Calls',
    'Chatbot',
    'Sales Pipeline',
    'Lead Management',
  ],
  authors: [{ name: 'CRM Team' }],
  creator: 'CRM Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'CRM Dashboard',
    description: 'Modern CRM with WhatsApp, Voice, and Chatbot integration',
    siteName: 'CRM Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CRM Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRM Dashboard',
    description: 'Modern CRM with WhatsApp, Voice, and Chatbot integration',
    images: ['/og-image.png'],
  },
  robots: {
    index: process.env.NODE_ENV === 'production',
    follow: process.env.NODE_ENV === 'production',
    googleBot: {
      index: process.env.NODE_ENV === 'production',
      follow: process.env.NODE_ENV === 'production',
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
        
        {/* Development tools */}
        {process.env.NODE_ENV === 'development' && (
          <div id="development-tools" className="fixed bottom-4 right-4 z-50">
            <div className="rounded-lg bg-black/80 p-2 text-xs text-white">
              <div>Mode: {process.env.NODE_ENV}</div>
              <div>API: {process.env.NEXT_PUBLIC_API_URL}</div>
            </div>
          </div>
        )}

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js');
              }
            `,
          }}
        />

        {/* Analytics Scripts */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Hotjar Tracking */}
        {process.env.NEXT_PUBLIC_HOTJAR_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
            }}
          />
        )}

        {/* Real-time Connection Status */}
        <div
          id="connection-status"
          className="fixed bottom-4 left-4 z-50 hidden rounded-full bg-red-500 px-3 py-1 text-xs text-white"
        >
          Connecting...
        </div>
      </body>
    </html>
  );
}