'use client';

import React from 'react';
import {
  TextField,
  InputAdornment,
  Collapse,
  Paper,
  Box,
  Slider,
  Chip,
  Typography,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface FiltersProps {
  showSearch: boolean;
  filters: {
    location: string;
    checkIn: string;
    checkOut: string;
    amenities: string[];
    priceRange: [number, number];
  };
  handleFilterChange: (key: string, value: unknown) => void;
  toggleAmenity: (amenity: string) => void;
  availableAmenities: string[];
  handleSearch: () => void;
}

export default function AdvancedFilters({
  showSearch,
  filters,
  handleFilterChange,
  toggleAmenity,
  availableAmenities,
  handleSearch,
}: FiltersProps) {
  return (
    <Collapse in={showSearch}>
      <Paper
        elevation={3}
        sx={{
          mx: { xs: 1, md: 2 },
          mb: 2,
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, alignItems: 'flex-start' }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: '200px' }}>
            <TextField
              fullWidth
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.1)',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover': {
                    borderColor: 'rgba(25,118,210,0.3)',
                  },
                  '&.Mui-focused': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 0 3px rgba(25,118,210,0.1)',
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: '200px' }}>
            <TextField
              fullWidth
              type="date"
              label="Check-in"
              value={filters.checkIn}
              onChange={(e) => handleFilterChange('checkIn', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.1)',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover': {
                    borderColor: 'rgba(25,118,210,0.3)',
                  },
                  '&.Mui-focused': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 0 3px rgba(25,118,210,0.1)',
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: '200px' }}>
            <TextField
              fullWidth
              type="date"
              label="Check-out"
              value={filters.checkOut}
              onChange={(e) => handleFilterChange('checkOut', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.1)',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover': {
                    borderColor: 'rgba(25,118,210,0.3)',
                  },
                  '&.Mui-focused': {
                    borderColor: '#1976d2',
                    boxShadow: '0 0 0 3px rgba(25,118,210,0.1)',
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: '200px' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
              <MoneyIcon sx={{ fontSize: 18, mr: 0.5, color: '#1976d2' }} />
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) => handleFilterChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              step={50}
              sx={{
                color: '#1976d2',
                '& .MuiSlider-thumb': {
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  opacity: 0.3,
                },
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 100%', minWidth: '200px' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
              <StarIcon sx={{ fontSize: 18, mr: 0.5, color: '#1976d2' }} />
              Amenities:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableAmenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  variant={filters.amenities.includes(amenity) ? 'filled' : 'outlined'}
                  color={filters.amenities.includes(amenity) ? 'primary' : 'default'}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 2,
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ flex: '1 1 100%', textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                px: { xs: 3, md: 4 },
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Search Resorts
            </Button>
          </Box>
        </Box>
      </Paper>
    </Collapse>
  );
}