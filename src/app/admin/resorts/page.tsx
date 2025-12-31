'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Hotel as HotelIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { resortAPI } from '@/lib/api';
import { Resort, User } from '@/types';

export default function ResortsManagement() {
  const [loading, setLoading] = useState(true);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Resort management state
  const [resortDialog, setResortDialog] = useState(false);
  const [editingResort, setEditingResort] = useState<Resort | null>(null);
  const [resortForm, setResortForm] = useState({
    name: '',
    description: '',
    location: '',
    latitude: 0,
    longitude: 0,
    pricePerNight: 0,
    amenities: '',
    maxGuests: 1,
    rooms: 1,
  });

  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchResorts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await resortAPI.getAll(session?.accessToken);
      const payload = response?.data?.data ?? response?.data;
      console.log('Resorts fetched:', payload);
      setResorts(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error('Error fetching resorts:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }

    // Check if user has admin or superadmin role
    const userRole = session.user.role;
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      router.push('/');
      return;
    }

    setCurrentUser(session.user);
    fetchResorts();
  }, [router, session, status, fetchResorts]);

  const handleOpenResortDialog = (resort?: Resort) => {
    if (resort) {
      setEditingResort(resort);
      setResortForm({
        name: resort.name,
        description: resort.description,
        location: resort.location,
        latitude: resort.latitude,
        longitude: resort.longitude,
        pricePerNight: resort.pricePerNight,
        amenities: resort.amenities.join(', '),
        maxGuests: resort.maxGuests,
        rooms: resort.rooms,
      });
    } else {
      setEditingResort(null);
      setResortForm({
        name: '',
        description: '',
        location: '',
        latitude: 0,
        longitude: 0,
        pricePerNight: 0,
        amenities: '',
        maxGuests: 1,
        rooms: 1,
      });
    }
    setResortDialog(true);
  };

  const handleCloseResortDialog = () => {
    setResortDialog(false);
    setEditingResort(null);
    setResortForm({
      name: '',
      description: '',
      location: '',
      latitude: 0,
      longitude: 0,
      pricePerNight: 0,
      amenities: '',
      maxGuests: 1,
      rooms: 1,
    });
  };

  const handleSaveResort = async () => {
    try {
      const resortData = {
        ...resortForm,
        amenities: resortForm.amenities.split(',').map(a => a.trim()),
      };

      if (editingResort) {
        await resortAPI.update(editingResort.id ?? editingResort._id!, resortData, session?.accessToken);
      } else {
        await resortAPI.create(resortData, session?.accessToken);
      }

      handleCloseResortDialog();
      fetchResorts();
    } catch (error) {
      console.error('Error saving resort:', error);
    }
  };

  const handleDeleteResort = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resort?')) return;

    try {
      await resortAPI.delete(id, session?.accessToken);
      fetchResorts();
    } catch (error) {
      console.error('Error deleting resort:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 3,
          borderRadius: 2,
          color: 'white'
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            <HotelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Resort Management
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Create and manage resort properties
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenResortDialog()}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          Add Resort
        </Button>
      </Box>

      {/* Resorts Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Price/Night</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Rooms</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resorts.map((resort, index) => (
              <TableRow
                key={resort.id ?? resort._id ?? index}
                sx={{
                  '&:hover': { backgroundColor: '#f9f9f9' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{resort.name}</TableCell>
                <TableCell>{resort.location}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${resort.pricePerNight}
                </TableCell>
                <TableCell>{resort.rooms}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenResortDialog(resort)}
                    sx={{
                      mr: 1,
                      backgroundColor: '#1976d2',
                      color: 'white',
                      '&:hover': { backgroundColor: '#1565c0' }
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteResort(resort.id ?? resort._id!)}
                    sx={{
                      backgroundColor: '#d32f2f',
                      color: 'white',
                      '&:hover': { backgroundColor: '#b71c1c' }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {resorts.length === 0 && (
        <Box textAlign="center" py={6}>
          <HotelIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No resorts found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start by adding your first resort property
          </Typography>
        </Box>
      )}

      {/* Resort Dialog */}
      <Dialog open={resortDialog} onClose={handleCloseResortDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingResort ? 'Edit Resort' : 'Add New Resort'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Name"
                value={resortForm.name}
                onChange={(e) => setResortForm({ ...resortForm, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Location"
                value={resortForm.location}
                onChange={(e) => setResortForm({ ...resortForm, location: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={resortForm.description}
                onChange={(e) => setResortForm({ ...resortForm, description: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Price per Night"
                value={resortForm.pricePerNight}
                onChange={(e) => setResortForm({ ...resortForm, pricePerNight: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Max Guests"
                value={resortForm.maxGuests}
                onChange={(e) => setResortForm({ ...resortForm, maxGuests: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Rooms"
                value={resortForm.rooms}
                onChange={(e) => setResortForm({ ...resortForm, rooms: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Amenities (comma-separated)"
                value={resortForm.amenities}
                onChange={(e) => setResortForm({ ...resortForm, amenities: e.target.value })}
                helperText="e.g., WiFi, Pool, Spa, Restaurant"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Latitude"
                value={resortForm.latitude}
                onChange={(e) => setResortForm({ ...resortForm, latitude: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Longitude"
                value={resortForm.longitude}
                onChange={(e) => setResortForm({ ...resortForm, longitude: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResortDialog}>Cancel</Button>
          <Button onClick={handleSaveResort} variant="contained">
            {editingResort ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}