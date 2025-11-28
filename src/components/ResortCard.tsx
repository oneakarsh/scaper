'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { Resort } from '@/types';
import { useRouter } from 'next/navigation';

interface ResortCardProps {
  resort: Resort;
  onBook?: (resort: Resort) => void;
}

export default function ResortCard({ resort, onBook }: ResortCardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const router = useRouter();

  const handleBookClick = () => {
    setOpenDialog(true);
  };

  const handleBooking = () => {
    if (checkIn && checkOut && guests) {
      onBook?.(resort);
      router.push(
        `/booking/${resort.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
      );
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 3,
          },
        }}
      >
        <CardMedia
          component="div"
          sx={{
            pt: '56.25%',
            backgroundColor: '#e0e0e0',
          }}
          image={resort.images?.[0] || `https://via.placeholder.com/400x300?text=${resort.name}`}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2">
            {resort.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {resort.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            {resort.amenities?.slice(0, 3).map((amenity) => (
              <Chip key={amenity} label={amenity} size="small" variant="outlined" />
            ))}
          </Box>
          <Typography variant="body2" color="textSecondary">
            📍 {resort.location}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            👥 Max {resort.maxGuests} guests | 🛏️ {resort.rooms} rooms
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            ${resort.pricePerNight}/night
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleBookClick} variant="contained" color="primary">
            Book Now
          </Button>
          <Button size="small">View Details</Button>
        </CardActions>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book {resort.name}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Check-in Date"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Check-out Date"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Number of Guests"
            type="number"
            inputProps={{ min: 1, max: resort.maxGuests }}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleBooking} variant="contained" color="primary">
            Continue to Booking
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
