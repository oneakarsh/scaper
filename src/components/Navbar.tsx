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

  useEffect(() => {
    // only read localStorage on client after mount
    setUser(getUser());
  }, []);
  const router = useRouter();

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

  // Navbar is client-only and uses localStorage-safe helpers

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
                  <MenuItem onClick={() => { handleMenuClose(); router.push('/bookings'); }}>
                    My Bookings
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); router.push('/profile'); }}>
                    Profile
                  </MenuItem>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <MenuItem onClick={() => { handleMenuClose(); router.push('/admin'); }}>
                      Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => router.push('/login')}>Login</Button>
                <Button variant="contained" color="secondary" onClick={() => router.push('/register')}>Sign Up</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
