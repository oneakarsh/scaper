'use client';

import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 4, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">{children}</Container>
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
