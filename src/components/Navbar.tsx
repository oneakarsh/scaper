'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  FilterAlt as FilterAltIcon,
  FilterAltOff as FilterAltOff,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getUser, logout } from '@/lib/auth';
import { User } from '@/types';
import SearchBar from './SearchBar';
import AdvancedFilters from './AdvancedFilters';
import UserMenu from './UserMenu';

const LoginDialog = dynamic(() => import('./LoginDialog'), { ssr: false });
const RegisterDialog = dynamic(() => import('./RegisterDialog'), { ssr: false });
export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(() => {
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

  const router = useRouter();

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    setUser(null);
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

  // Success handlers
  const handleLoginSuccess = () => {
    setOpenLoginDialog(false);
    setUser(getUser());
  };

  const handleRegisterSuccess = () => {
    setOpenRegisterDialog(false);
    setUser(getUser());
  };

  // Switch handlers
  const handleSwitchToRegister = () => {
    setOpenLoginDialog(false);
    setOpenRegisterDialog(true);
  };

  const handleSwitchToLogin = () => {
    setOpenRegisterDialog(false);
    setOpenLoginDialog(true);
  };

  return (
    <>
        <AppBar
        position="sticky"
        elevation={2}
        sx={{
          backgroundColor: '#fff',
          color: '#333',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 48, md: 56 },
              px: { xs: 1.5, md: 2 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'nowrap', // ❗ no mobile swapping
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    fontSize: { xs: 22, md: 26 },
                    fontWeight: 800,
                    color: '#1976d2',
                    lineHeight: 1,
                  }}
                >
                  🏖️ Scaper
                </Box>
              </Link>
            </Box>

            {/* Search */}
            <Box
              sx={{
                flex: 1,
                maxWidth: 360,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <IconButton
                size="small"
                onClick={() => setShowSearch(!showSearch)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  color: '#1976d2',
                  backgroundColor: 'rgba(25,118,210,0.1)',
                  border: '1px solid rgba(25,118,210,0.2)',
                }}
              >
                {showSearch ? <FilterAltOff /> : <FilterAltIcon />}
              </IconButton>
            </Box>

            {/* Right actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Link href="/">
                <IconButton
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    color: '#1976d2',
                  }}
                >
                  <HomeIcon />
                </IconButton>
              </Link>

              {user ? (
                <UserMenu
                  user={user}
                  anchorEl={anchorEl}
                  onMenuOpen={e => setAnchorEl(e.currentTarget)}
                  onMenuClose={() => setAnchorEl(null)}
                  onLogout={handleLogout}
                  onNavigate={router.push}
                />
              ) : (
                <>
                  <Button size="small" onClick={() => setOpenLoginDialog(true)}>
                    Login
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setOpenRegisterDialog(true)}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <AdvancedFilters
        showSearch={showSearch}
        filters={filters}
        handleFilterChange={handleFilterChange}
        toggleAmenity={toggleAmenity}
        availableAmenities={availableAmenities}
        handleSearch={handleSearch}
      />

      <LoginDialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterDialog
        open={openRegisterDialog}
        onClose={() => setOpenRegisterDialog(false)}
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}
