import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Scaper - Resort Booking',
  description: 'Book your perfect resort getaway',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
