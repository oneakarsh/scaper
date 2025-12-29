'use client';

import React from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
} from '@mui/material';

const mockBookings = [
  {
    id: 'BK-001',
    resort: 'Paradise Resort',
    checkIn: '2025-05-01',
    checkOut: '2025-05-07',
    guests: 2,
    total: 3150,
    status: 'confirmed',
  },
  {
    id: 'BK-002',
    resort: 'Forest Retreat',
    checkIn: '2025-06-15',
    checkOut: '2025-06-18',
    guests: 4,
    total: 750,
    status: 'pending',
  },
];

export default function BookingsPage() {
  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        My Bookings
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Resort</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                <TableCell>{b.resort}</TableCell>
                <TableCell>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(b.checkOut).toLocaleDateString()}</TableCell>
                <TableCell>{b.guests}</TableCell>
                <TableCell>${b.total}</TableCell>
                <TableCell>
                  <Chip label={b.status} color={b.status === 'confirmed' ? 'success' : 'warning'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          This is a mock view. Real bookings will appear here when connected to the API.
        </Typography>
      </Box>
    </Box>
  );
}
