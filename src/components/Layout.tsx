'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Container, Typography, Skeleton, Grid } from '@mui/material';
import Navbar from './Navbar';
import ResortCard from './ResortCard';
import { Resort } from '@/types';
import { resortAPI } from '@/lib/api';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResorts() {
      try {
        setLoading(true);
        const response = await resortAPI.getAll();
        const payload = response?.data?.data ?? response?.data;
        console.log('Resorts fetched:', payload);
        setResorts(Array.isArray(payload) ? payload : []);
      } catch (error) {
        console.error("Failed to fetch resorts:", error);
        // Use mock data for development
        setResorts([
          {
            id: '1',
            name: 'Paradise Resort',
            description: 'A luxurious beachfront resort with stunning ocean views.',
            location: 'Maldives',
            pricePerNight: 450,
            amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
            maxGuests: 4,
            rooms: 2,
            images: ['https://via.placeholder.com/400x300?text=Paradise+Resort']
          },
          {
            id: '2',
            name: 'Mountain View Lodge',
            description: 'Cozy mountain retreat with hiking trails and fireplaces.',
            location: 'Switzerland',
            pricePerNight: 320,
            amenities: ['Fireplace', 'Hiking', 'Restaurant', 'Bar'],
            maxGuests: 6,
            rooms: 3,
            images: ['https://via.placeholder.com/400x300?text=Mountain+View+Lodge']
          },
          {
            id: '3',
            name: 'Urban Luxury Hotel',
            description: 'Modern city hotel with rooftop pool and fine dining.',
            location: 'New York',
            pricePerNight: 280,
            amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'WiFi'],
            maxGuests: 2,
            rooms: 1,
            images: ['https://via.placeholder.com/400x300?text=Urban+Luxury+Hotel']
          },
          {
            id: '4',
            name: 'Tropical Paradise',
            description: 'Island resort with private beaches and water sports.',
            location: 'Hawaii',
            pricePerNight: 520,
            amenities: ['Beach', 'Water Sports', 'Spa', 'Restaurant'],
            maxGuests: 8,
            rooms: 4,
            images: ['https://via.placeholder.com/400x300?text=Tropical+Paradise']
          },
          {
            id: '5',
            name: 'Desert Oasis',
            description: 'Luxury desert resort with camel rides and traditional dining.',
            location: 'Dubai',
            pricePerNight: 380,
            amenities: ['Camel Rides', 'Pool', 'Restaurant', 'Spa'],
            maxGuests: 4,
            rooms: 2,
            images: ['https://via.placeholder.com/400x300?text=Desert+Oasis']
          },
          {
            id: '6',
            name: 'Forest Retreat',
            description: 'Peaceful forest cabin with nature trails and hot springs.',
            location: 'Canada',
            pricePerNight: 250,
            amenities: ['Hot Springs', 'Hiking', 'Fireplace', 'Restaurant'],
            maxGuests: 4,
            rooms: 2,
            images: ['https://via.placeholder.com/400x300?text=Forest+Retreat']
          }
        ]);
      } finally {
        setLoading(false);
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
      <Box component="main" sx={{ flexGrow: 1, py: 0, backgroundColor: '#fafafa' }}>
        {children}
        {!hideResortGrid && (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Featured Resorts
            </Typography>
            {loading ? (
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="text" sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="60%" />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {resorts.map((resort) => (
                  <Grid key={resort.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ResortCard resort={resort} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
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
          <Typography variant="body1">
            &copy; 2025 Scaper - Resort Booking System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
