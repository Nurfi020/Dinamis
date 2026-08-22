import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kelola Lead — Sales CRM',
  description: 'Aplikasi manajemen lead dan CRM Sales modern, cepat, dan terorganisir untuk memantau follow up dan tingkat closing.',
  keywords: ['CRM', 'Sales Lead', 'Follow Up', 'Kelola Lead', 'Sales Dashboard'],
  authors: [{ name: 'Kelola Lead Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#06111F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#06111F] text-[#F8FAFC] antialiased min-h-screen selection:bg-[#168BFF]/30 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
