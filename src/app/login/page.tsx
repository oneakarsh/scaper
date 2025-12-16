"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { authAPI } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError('Please enter email and password');

    try {
      setLoading(true);
      const res = await authAPI.login({ email, password });
      const data = res.data;
      if (data && data.token) {
        setToken(data.token);
        if (data.user) setUser(data.user);
        router.push('/');
      } else {
        setError(data?.message || 'Login failed');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your Scaper account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={submit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
            </Button>

            <Typography align="center">
              Don&apos;t have an account?{' '}
              <Button
                onClick={() => router.push('/register')}
                sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
              >
                Sign up
              </Button>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
