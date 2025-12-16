'use client';

import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, logout, setToken, setUser } from '@/lib/auth';
import { authAPI } from '@/lib/api';
import { User } from '@/types';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      return getUser();
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    amenities: [] as string[],
    priceRange: [0, 2000] as [number, number],
  });

  // Dialog states
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form states
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const router = useRouter();

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

  const handleFilterChange = (key: string, value: unknown) => {
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

  // Login handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginEmail || !loginPassword) return setLoginError('Please enter email and password');

    try {
      setLoginLoading(true);
      const res = await authAPI.login({ email: loginEmail, password: loginPassword });
      const data = res.data;
      if (data && data.token) {
        setToken(data.token);
        if (data.user) setUser(data.user);
        setOpenLoginDialog(false);
        router.push('/');
      } else {
        setLoginError(data?.message || 'Login failed');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setLoginError(error?.response?.data?.message || error?.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOpenRegisterFromLogin = () => {
    setOpenLoginDialog(false);
    setOpenRegisterDialog(true);
  };

  // Register handlers
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    if (!registerName || !registerEmail || !registerPassword) return setRegisterError('Please fill the required fields');
    if (registerPassword.length < 6) return setRegisterError('Password should be at least 6 characters');
    if (registerPassword !== registerConfirmPassword) return setRegisterError('Passwords do not match');

    try {
      setRegisterLoading(true);
      const res = await authAPI.register({ name: registerName, email: registerEmail, password: registerPassword, phone: registerPhone });
      const data = res.data;
      if (data && data.token) {
        setToken(data.token);
        if (data.user) setUser(data.user);
        setOpenRegisterDialog(false);
        router.push('/');
      } else {
        setRegisterError(data?.message || 'Registration failed');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setRegisterError(error?.response?.data?.message || error?.message || 'Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleOpenLoginFromRegister = () => {
    setOpenRegisterDialog(false);
    setOpenLoginDialog(true);
  };

  return (
    <><><Box>
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
              <Link href="/" style={{ textDecoration: 'none' }}>
                <IconButton
                  color="inherit"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <HomeIcon />
                </IconButton>
              </Link>
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
                    <MenuItem onClick={() => { handleMenuClose(); router.push('/bookings'); } }>
                      📋 My Bookings
                    </MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); router.push('/profile'); } }>
                      👤 Profile
                    </MenuItem>

                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <MenuItem onClick={() => { handleMenuClose(); router.push('/admin'); } }>
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
                    onClick={() => setOpenLoginDialog(true)}
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
                    onClick={() => setOpenRegisterDialog(true)}
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
                }} />
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
                  }} />
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
                  }} />
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
                  }} />
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
                    }} />
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
                      }} />
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
    </Box><Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Welcome Back</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your Scaper account
          </Typography>

          {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}

          <Box component="form" onSubmit={handleLoginSubmit}>
            <TextField
              label="Email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined" />

            <TextField
              label="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', px: 3, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loginLoading}
            onClick={handleLoginSubmit}
            sx={{ mb: 2, py: 1.5 }}
          >
            {loginLoading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
          </Button>

          <Typography align="center">
            Don&apos;t have an account?{' '}
            <Button
              onClick={handleOpenRegisterFromLogin}
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
            >
              Sign up
            </Button>
          </Typography>
        </DialogActions>
      </Dialog></><Dialog open={openRegisterDialog} onClose={() => setOpenRegisterDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join Scaper and start booking amazing resorts
          </Typography>

          {registerError && <Alert severity="error" sx={{ mb: 2 }}>{registerError}</Alert>}

          <Box component="form" onSubmit={handleRegisterSubmit}>
            <TextField
              label="Full Name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined" />

            <TextField
              label="Email"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined" />

            <TextField
              label="Phone"
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined" />

            <TextField
              label="Password"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined" />

            <TextField
              label="Confirm Password"
              type="password"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', px: 3, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={registerLoading}
            onClick={handleRegisterSubmit}
            sx={{ mb: 2, py: 1.5 }}
          >
            {registerLoading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
          </Button>

          <Typography align="center">
            Already have an account?{' '}
            <Button
              onClick={handleOpenLoginFromRegister}
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
            >
              Sign in
            </Button>
          </Typography>
        </DialogActions>
      </Dialog></>
  );
}
