'use client';

import { SessionProvider } from 'next-auth/react';
import MuiProvider from '@/components/MuiProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MuiProvider>
        {children}
      </MuiProvider>
    </SessionProvider>
  );
}