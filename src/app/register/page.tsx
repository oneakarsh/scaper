"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { authAPI } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) return setError('Please fill the required fields');
    if (password.length < 6) return setError('Password should be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    try {
      setLoading(true);
      const res = await authAPI.register({ name, email, password, phone });
      const data = res.data;
      if (data && data.token) {
        setToken(data.token);
        if (data.user) setUser(data.user);
        router.push('/');
      } else {
        setError(data?.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Registration failed');
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
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join Scaper and start booking amazing resorts
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={submit}>
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />

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
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              margin="normal"
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

            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
            </Button>

            <Typography align="center">
              Already have an account?{' '}
              <Button
                onClick={() => router.push('/login')}
                sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
              >
                Sign in
              </Button>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
