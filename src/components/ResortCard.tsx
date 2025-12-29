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
  IconButton,
  Stack,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Resort } from '@/types';
import { useRouter } from 'next/navigation';

interface ResortCardProps {
  resort: Resort;
}

export default function ResortCard({ resort }: ResortCardProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);

  const handleBookNow = () => {
    const id = resort.id ?? resort._id;
    if (!id) {
      console.error('Resort id is missing, cannot navigate to booking page', resort);
      return;
    }
    router.push(`/resorts/${id}`);
  };

  const toggleWishlist = () => {
    setWishlisted((prev) => !prev);
    // later: call wishlist API here
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'all 0.25s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Wishlist Button */}
      <IconButton
        onClick={toggleWishlist}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          bgcolor: 'white',
          zIndex: 2,
          '&:hover': { bgcolor: 'white' },
        }}
      >
        {wishlisted ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>

      {/* Image */}
      <CardMedia
        sx={{
          height: 220,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        image={
          resort.images?.[0] ??
          `https://via.placeholder.com/400x300?text=${encodeURIComponent(
            resort.name
          )}`
        }
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
            <Typography
              variant="h6"
              fontWeight={600}
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexGrow: 1,
              }}
            >
              {resort.name}
            </Typography>

            <Typography variant="h6" color="primary" sx={{ whiteSpace: 'nowrap' }}>
              ${resort.pricePerNight}
              <Typography component="span" variant="body2" color="text.secondary">
                {' '}
                / night
              </Typography>
            </Typography>
          </Box>

          <Box display="flex" gap={1} flexWrap="wrap">
            {resort.amenities?.slice(0, 4).map((amenity) => (
              <Chip key={amenity} label={amenity} size="small" />
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary">
            📍 {resort.location}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            👥 Max {resort.maxGuests} · 🛏️ {resort.rooms} rooms
          </Typography>


        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleBookNow}
          sx={{
            py: 1.5,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            boxShadow: "0 6px 20px rgba(25, 118, 210, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #1565c0, #1e88e5)",
              boxShadow: "0 8px 28px rgba(25, 118, 210, 0.45)",
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 4px 14px rgba(25, 118, 210, 0.35)",
            },
          }}
        >
          View Resort
        </Button>
      </CardActions>
    </Card>
  );
}
