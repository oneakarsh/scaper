import type { Metadata } from 'next';
import './globals.css';
import MuiProvider from '@/components/MuiProvider';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Scaper - Resort Booking',
  description: 'Book your perfect resort getaway',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MuiProvider>
          <Layout>{children}</Layout>
        </MuiProvider>
      </body>
    </html>
  );
}
