'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { signIn } from 'next-auth/react';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginDialog({
  open,
  onClose,
  onSuccess,
  onSwitchToRegister,
}: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError('Please enter email and password');

    try {
      setLoading(true);
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else if (result?.ok) {
        onSuccess();
      }
    } catch (err: unknown) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#1976d2', fontSize: '1.5rem' }}>
        Welcome Back
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Sign in to your Scaper account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', px: 4, pb: 3, gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          onClick={handleSubmit}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
        </Button>
        <Typography align="center" sx={{ fontSize: '0.9rem' }}>
          Don&apos;t have an account?{' '}
          <Button
            onClick={onSwitchToRegister}
            sx={{
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              color: '#1976d2',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign up
          </Button>
        </Typography>
      </DialogActions>
    </Dialog>
  );
}