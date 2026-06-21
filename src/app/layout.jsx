import './globals.css';
import { Toaster } from 'react-hot-toast';
import ServiceWorkerRegistry from '@/components/ServiceWorkerRegistry';

export const metadata = {
  title: 'QueueCare – Smart Clinic Queue Management',
  description: 'Real-time healthcare queue management. No more waiting in crowded clinics.',
  icons: { icon: '/icon.svg' },
  manifest: '/manifest.json',
  openGraph: {
    title: 'QueueCare',
    description: 'Real-time clinic queue management. See your live token status.',
    url: 'https://queuecare.app',
    siteName: 'QueueCare',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QueueCare',
    description: 'Real-time clinic queue management.',
  },
};
export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#0c2461' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0c2461" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-gray-50 max-w-[430px] mx-auto min-h-screen">
        <ServiceWorkerRegistry />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: { background:'#0c2461', color:'#fff', fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600, fontSize:13, borderRadius:99, padding:'12px 20px' },
            success: { iconTheme: { primary:'#f59e0b', secondary:'#fff' } },
            error: { style: { background:'#d63031' } },
          }}
        />
      </body>
    </html>
  );
}
