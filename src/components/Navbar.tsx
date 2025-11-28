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
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { User } from '@/types';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setUser(getUser());
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/');
  };

  if (!isClient) return null;

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link href="/">
            <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>
               Scaper
            </Box>
          </Link>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Link href="/">
              <Button color="inherit">Home</Button>
            </Link>
            <Link href="/resorts">
              <Button color="inherit">Resorts</Button>
            </Link>

            {user ? (
              <>
                <Button color="inherit" onClick={handleMenuOpen}>
                  {user.name}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose} component={Link} href="/bookings">
                    My Bookings
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} component={Link} href="/profile">
                    Profile
                  </MenuItem>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <MenuItem onClick={handleMenuClose} component={Link} href="/admin">
                      Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button color="inherit">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="contained" color="secondary">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
