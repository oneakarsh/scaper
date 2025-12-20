'use client';

import React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Typography,
} from '@mui/material';

interface UserMenuProps {
  user: { name: string; role: string };
  anchorEl: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMenuClose: () => void;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export default function UserMenu({
  user,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  onLogout,
  onNavigate,
}: UserMenuProps) {
  return (
    <>
      <Button
        color="inherit"
        onClick={onMenuOpen}
        sx={{
          textTransform: 'none',
          display: 'flex',
          gap: 1,
          fontWeight: 500,
          color: '#333',
          borderRadius: 2,
          px: 2,
          py: 1,
          '&:hover': {
            backgroundColor: 'rgba(25,118,210,0.1)',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(25,118,210,0.2)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontWeight: 600 }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
          {user.name}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 200,
            mt: 1,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0,0,0,0.05)',
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(25,118,210,0.1)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => { onMenuClose(); onNavigate('/bookings'); }}>
          📋 My Bookings
        </MenuItem>
        <MenuItem onClick={() => { onMenuClose(); onNavigate('/profile'); }}>
          👤 Profile
        </MenuItem>
        {(user.role === 'admin' || user.role === 'superadmin') && (
          <MenuItem onClick={() => { onMenuClose(); onNavigate('/admin'); }}>
            ⚙️ Admin Panel
          </MenuItem>
        )}
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={onLogout} sx={{ color: 'error.main', fontWeight: 500 }}>
          🚪 Logout
        </MenuItem>
      </Menu>
    </>
  );
}