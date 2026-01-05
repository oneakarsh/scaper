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
  CircularProgress, IconButton,
  InputAdornment,
  Box,
} from '@mui/material';
import { authAPI } from '@/lib/api';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterDialog({
  open,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: RegisterDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) return setError('Please fill the required fields');
    if (password.length < 6) return setError('Password should be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    try {
      setLoading(true);
      const res = await authAPI.register({ name, email, password, confirmPassword, phone });
      const data = res.data;
      if (data) {
        // Registration successful, switch to login
        onSuccess();
        onSwitchToLogin();
      } else {
        setError(data?.message || 'Registration failed');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#1976d2', fontSize: '1.5rem' }}>
        Create Account
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Join Scaper and start booking amazing resorts
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
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
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
              },
            }}
          />

          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
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
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
        </Button>
        <Typography align="center" sx={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Button
            onClick={onSwitchToLogin}
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
            Sign in
          </Button>
        </Typography>
      </DialogActions>
    </Dialog>
  );
}