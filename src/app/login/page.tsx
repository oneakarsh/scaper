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
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <Container maxWidth="sm" sx={{ py: 12 }}>
        <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white' }}>
          <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
            Login to Scaper
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={submit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Login'}
              </Button>
              <Button type="button" onClick={() => router.push('/register')}>
                Create account
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </div>
  );
}
