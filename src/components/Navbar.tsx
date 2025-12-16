'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Box,
  Container,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Collapse,
  Paper,
  Grid,
  Slider,
  Chip,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { User } from '@/types';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    amenities: [] as string[],
    priceRange: [0, 2000] as [number, number],
  });

  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/');
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery, filters);
    // You can implement search logic here or pass to parent component
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const availableAmenities = [
    'WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Beach', 'Bar', 'Fireplace',
    'Hiking', 'Water Sports', 'Camel Rides', 'Hot Springs'
  ];

  return (
    <Box>
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          background: 'linear-gradient(135deg, #1976d2, #1565c0)',
          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1, gap: 2 }}>
            {/* Left Side - Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Button
                    color="inherit"
                    onClick={handleMenuOpen}
                    sx={{
                      textTransform: 'none',
                      display: 'flex',
                      gap: 1,
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                      },
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff9800' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    {user.name}
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        minWidth: 180,
                        mt: 1,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <MenuItem onClick={() => { handleMenuClose(); router.push('/bookings'); }}>
                      📋 My Bookings
                    </MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); router.push('/profile'); }}>
                      👤 Profile
                    </MenuItem>

                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <MenuItem onClick={() => { handleMenuClose(); router.push('/admin'); }}>
                        ⚙️ Admin Panel
                      </MenuItem>
                    )}

                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      🚪 Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => router.push('/login')}
                    sx={{
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => router.push('/register')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      bgcolor: '#ff9800',
                      boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                      '&:hover': {
                        bgcolor: '#fb8c00',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>

            {/* Center - Search Bar */}
            <Box sx={{ flex: 1, maxWidth: 500, mx: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Search resorts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 25,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      boxShadow: '0 0 0 2px rgba(255,255,255,0.3)',
                    },
                    '& input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.7)',
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
              <IconButton
                onClick={() => setShowSearch(!showSearch)}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                {showSearch ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            {/* Right Side - Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: 1,
                  color: 'white',
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 0.85,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                🏖️ Scaper
              </Box>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Advanced Filters Panel */}
      <Collapse in={showSearch}>
        <Paper
          elevation={2}
          sx={{
            mx: 2,
            mb: 2,
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3} alignItems="center">
              {/* Location Filter */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                      borderRadius: 3,
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Grid>

              {/* Check-in Date */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Check-in"
                  value={filters.checkIn}
                  onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Grid>

              {/* Check-out Date */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Check-out"
                  value={filters.checkOut}
                  onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Grid>

              {/* Price Range */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ px: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <MoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
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
                    }}
                  />
                </Box>
              </Grid>

              {/* Amenities Filter */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
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
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Search Button */}
              <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Search Resorts
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Collapse>
    </Box>
  );
}
