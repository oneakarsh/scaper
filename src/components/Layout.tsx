'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import ResortCard from './ResortCard';
import { Resort } from '@/types';
import { resortAPI } from '@/lib/api';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [resorts, setResorts] = useState<Resort[]>([]);
  useEffect(() => {
    async function fetchResorts() {
      try {
        // use the app-wide API helper which handles tokens & base URL
        const response = await resortAPI.getAll();
        // support both { data: [{...}] } and { data: { data: [...] } }
        const payload = response?.data?.data ?? response?.data;
        console.log('Resorts fetched:', payload);
        setResorts(Array.isArray(payload) ? payload : []);
      } catch (error) {
        console.error("Failed to fetch resorts:", error);
      }
    }

    fetchResorts();
  }, []);
  // hide resort grid on dedicated auth pages
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const hideResortGrid = pathname.startsWith('/login') || pathname.startsWith('/register');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 4, backgroundColor: '#f5f5f5' }}>
        {/* render children (pages) first — this layout also shows a resorts grid after the page content */}
        {children}
        {!hideResortGrid && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
            padding: { xs: 1, md: 2, lg: 4 },
          }}>
            {resorts.map((resort) => (
              <Box key={resort.id} sx={{ width: '100%' }}>
                <ResortCard resort={resort} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Box
        component="footer"
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          py: 3,
          mt: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <p>&copy; 2025 Scaper - Resort Booking System. All rights reserved.</p>
        </Container>
      </Box>
    </Box>
  );
}
