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
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { User } from '@/types';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);
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

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: 'linear-gradient(135deg, #1976d2, #1565c0)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 1,
                color: 'white',
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.85 },
              }}
            >
              Scaper
            </Box>
          </Link>

          {/* Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button
                color="inherit"
                sx={{
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                Home
              </Button>
            </Link>
            <Link href="/resorts" style={{ textDecoration: 'none' }}>
              <Button
                color="inherit"
                sx={{
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                Resorts
              </Button>
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
                    },
                  }}
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

                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => router.push('/login')}
                  sx={{ textTransform: 'none' }}
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
                    '&:hover': {
                      bgcolor: '#fb8c00',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
