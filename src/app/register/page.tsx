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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <Container maxWidth="sm" sx={{ py: 12 }}>
        <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white' }}>
          <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
            Create an account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={submit}>
            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

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
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              margin="normal"
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

            <TextField
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign up'}
              </Button>
              <Button type="button" onClick={() => router.push('/login')}>
                Already have an account?
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </div>
  );
}
