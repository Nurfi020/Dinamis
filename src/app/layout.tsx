import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kelola Lead — Sales CRM',
  description: 'Aplikasi manajemen lead dan CRM Sales modern, cepat, dan terorganisir dengan visual identity hijau BSI untuk memantau follow up dan closing.',
  keywords: ['CRM', 'Sales Lead', 'Follow Up', 'Kelola Lead', 'Sales Dashboard'],
  authors: [{ name: 'Kelola Lead Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#006B3C',
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
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F7F9F8] text-[#17221C] antialiased min-h-screen selection:bg-[#00A651]/20 selection:text-[#004D2A]">
        {children}
      </body>
    </html>
  );
}